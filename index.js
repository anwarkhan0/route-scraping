import { config } from "dotenv";
config();

import path from "path";
import express from "express";

import { encode } from "gpt-tokenizer";

import { aiExtract } from "./aiExtracter.js";
import { extractLinks } from "./extractLinks.js";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { scrape } from "./scrape.js";
import { fitlerLinks } from "./utils.js";
import { createRoute, getAllRoutes } from "./routesModel.js";

const app = express();

app.use(express.urlencoded({ extended: true }));

const __dirname = process.cwd();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./mainPage.html"));
});

app.get("/display-routes", async (req, res) => {
  res.sendFile(path.join(__dirname, "./routesList.html"));
});

//////////////// API's //////////////////
app.post("/scrape", async (req, res) => {
  try {
    const { url, identifier } = req.body;
    if (!url || !identifier) {
      res.status(400).json({ message: "Missing URL or Identifier" });
      return;
    }

    // loading web pages
    console.log("collecting links.........");
    const links = await extractLinks(url);

    const routeLinks = fitlerLinks(links, identifier);

    console.log(routeLinks.length, "routes found");

    const contents = [];

    // const urlPage = await scrape(url);
    // contents.push(urlPage);

    if (routeLinks.length > 0) {
      for (const link of routeLinks) {
        const data = await scrape(link);
        if (data) {
          contents.push(`${data} + This Page URL is: ${link}`);
        }
      }
    }

    console.log(contents.length, "pages text saved.");

    console.log(
      "Content Extraction started from scrapped text................"
    );

    let results = [];
    for (let i = 0; i < contents.length; i++) {
      console.log("Extraction of page=>> " + i);

      if (contents[i] === undefined) {
        console.log(`contents[${i}] is undefined`);
        continue;
      }

      const tokens = encode(contents[i]);
      const tokenCount = tokens.length;

      if (tokenCount > 3000) {
        const splitter = new RecursiveCharacterTextSplitter({
          chunkSize: 2500,
          chunkOverlap: 1,
        });

        const docs = await splitter.createDocuments([contents[i]]);

        for (let i = 0; i < docs.length; i++) {
          const result = await aiExtract(docs[i]);
          results = results.concat(result.routes || []);
        }
      } else {
        const result = await aiExtract(contents[i]);
        results = results.concat(result.routes || []);
      }
    }

    console.log("Content Extraction completed...............");

    results.forEach( async (route) => {
      console.log(route);
      const data = {
        title: route.title,
        url: route.page_url,
        location: route.location,
        other_content: JSON.stringify(route),
      };

      try {
        await createRoute(data);
      } catch (error) {
        console.error(`Error creating route for ${route.title}:`, error);
      }

    });

    return res.json({ data: results });
  } catch (error) {
    console.error("Error:", error);
    return res.json({ message: "Error while processing." });
  }
});

app.get("/routes", async (req, res) => {
  try {
    const routes = await getAllRoutes();

    if (!routes) {
      throw new Error("Failed to get all routes");
    }

    return res.json({ data: routes });
  } catch (error) {
    console.error("Error:", error);
    return res.json({ message: "Error while fetching routes." });
  }
});

app.listen(3000, () => {
  console.log("running on port 3000");
});
