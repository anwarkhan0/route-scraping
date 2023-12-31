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


const port = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));

const __dirname = process.cwd();


app.get("/", (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "./mainPage.html"));
  } catch (error) {
    console.log(error);
    res.status(401).send("page not found");
  }
});

app.get("/display-routes", async (req, res) => {
  res.sendFile(path.join(__dirname, "./routesList.html"));
});

//////////////// API's //////////////////
app.get("/scrape", async (req, res) => {
  try {
    const { url, identifier } = req.query;
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
    }else{
      return res.status(201).json({message: 'No routes links found, if there are routes Links, Check identifier and try again.'})
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

    if(results.length === 0) {

      return res.status(201).json({ message: 'No routes found on the pages..', data: results });

    }else{

      return res.status(201).json({ message: 'Rotues results found.', data: results });
      
    }
    

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Error while processing." });
  }
});

app.listen(port, "0.0.0.0", function () {
  console.log(`Listening on Port ${port}`);
});
