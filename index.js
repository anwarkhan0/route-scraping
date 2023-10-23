import path from "path";
import express from "express";
import { config } from "dotenv";
import extractDomain from "extract-domain";

import { encode } from "gpt-tokenizer";

import { aiExtract } from "./aiExtracter.js";
import { extractLinks } from "./extractLinks.js";
import { ExtractRouteLinks } from "./aiExtractRouteLinks.js";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { scrape } from "./scrape.js";
import { splitArrayInto4Pieces } from './utils.js';

config();
const app = express();

app.use(express.urlencoded({ extended: true }));

const __dirname = process.cwd();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./mainPage.html"));
});


app.post("/scrape", async (req, res) => {
  try {
    const url = req.body.url;
    if (!url) {
      res.status(400).json({ message: 'Missing URL' });
      return;
    }

    const mainDomain = extractDomain(url);
    // loading web pages
    console.log("collecting links.........");
    const links = await extractLinks(url, mainDomain);

    console.log('links collected');
    let routeLinks = [];
    if (links.length > 50) {
      const linksChunks = splitArrayInto4Pieces(links);
      for (let i = 0; i < linksChunks.length; i++) {
        const result = await ExtractRouteLinks(linksChunks[i]);
        routeLinks = routeLinks.concat(result.data || []);
      }
    } else {
      const result = await ExtractRouteLinks(links);
      routeLinks = result.data;
    }

    console.log(routeLinks);
    
    const contents = [];

    const urlPage = await scrape(url);
    contents.push(urlPage);

    if (routeLinks.length > 0) {
      for (const link of routeLinks) {
        const data = await scrape(link);
        if (data) {
          contents.push(data);
        }
      }
    }

    console.log(contents.length, " pages loaded.");

    console.log(
      "Content Extraction started from scrapped text................"
    );

    let results = [];
    for (let i = 0; i < contents.length; i++) {
      console.log("Extraction of page=>> " + i);
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

    return res.json({ data: results });
  } catch (error) {
    console.error("Error:", error);
    return res.json({ message: "Error while processing." });
  }
});

app.listen(3000, () => {
  console.log("running on port 3000");
});
