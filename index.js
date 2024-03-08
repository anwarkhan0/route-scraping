import { config } from "dotenv";
config();

import path from "path";
import express from "express";

import { encode } from "gpt-tokenizer";

import { aiExtract } from "./aiExtracter.js";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { scrape } from "./scrape.js";

const port = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));

const __dirname = process.cwd();

app.get("/", (req, res) => {
  try {
    res.status(200).sendFile(path.join(__dirname, "./mainPage.html"));
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
    const { url } = req.query;
    if (!url) {
      res.status(400).json({ message: "Missing URL" });
      return;
    }

    let data = await scrape(url);

    if (!data) {
      return res.status(404).json({ message: "No data found" });
    }

    console.log(
      "Content Extraction started from scrapped text................"
    );

    let results = [];
    // for (let i = 0; i < contents.length; i++) {
    console.log("Extraction of page ");

    if (data === undefined) {
      console.log(`data is undefined`);
      // continue;
    }

    data += "Website = " + url;

    const tokens = encode(data);

    const result = await aiExtract(data);
    results = results.concat(result.routes || []);

    console.log("Content Extraction completed...............");

    if (results.length === 0) {
      return res
        .status(201)
        .json({ message: "No Listing found on the pages..", data: results });
    } else {
      return res
        .status(201)
        .json({ message: "Listing result found.", data: results });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Error while processing." });
  }
});

app.listen(port, "0.0.0.0", function () {
  console.log(`Listening on Port ${port}`);
});
