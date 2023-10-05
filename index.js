import { compile } from "html-to-text";
import { RecursiveUrlLoader } from "langchain/document_loaders/web/recursive_url";

import path from "path";
import express from "express";
import { config } from 'dotenv';

import { aiExtract } from './aiExtracter.js';

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
    
    const compiledConvert = compile({
      wordwrap: 130,
      selectors: [{ selector: "img", format: "skip" }],
    }); // returns (text: string) => string;

    // loading web pages
    const loader = new RecursiveUrlLoader(url, {
      extractor: compiledConvert,
      maxDepth: 100,
      preventOutside: true,
      excludeDirs: [
        "https://www.mrrouteinc.com/contact-us/",
        "https://www.mrrouteinc.com/about-us",
      ],
    });

    const docs = await loader.load();
    const scrappedData = [];
    
    for(let i = 0; i< docs.length; i++) {
      console.log('scraping =>>> ', docs[i].metadata.source + "\n");
      const data = await aiExtract(docs[i].pageContent);
      scrappedData.push(data);
    }
    console.log(scrappedData);
    res.json(scrappedData);
   
  } catch (error) {
    return res.sendStatus(500).json({ error: error.message });
  }
});


app.listen(3000, () => {
  console.log("running on port 3000");
});