import { compile } from "html-to-text";
import { RecursiveUrlLoader } from "langchain/document_loaders/web/recursive_url";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

import path from "path";
import express from "express";
import { config } from 'dotenv';

import { aiExtract } from './aiExtracter.js';
import { extractLinks } from './extractLinks.js';
import { scrape } from './scrape.js';

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
      selectors: [  { selector: 'a' }, { selector: "img", format: "skip" }],
    }); // returns (text: string) => string;

    // loading web pages
    console.log('loading web pages');
    const links = await extractLinks(url);


    const contents = [];

     for(let i = 0; i< links.length; i++){
      console.log('processing..... ', links[i])
      const loader = new RecursiveUrlLoader(links[i], {
        extractor: compiledConvert,
        maxDepth: 0,
      });
      const docs = await loader.load();
      contents.push(docs[0].pageContent);
    }
    
    console.log(contents.length, ' pages loaded.');

    console.log('Content Extraction started................');

    const results = [];
    for(let i = 0; i< contents.length; i++){
      console.log('Extraction of page=>> ' + i + 1);
      const result = await aiExtract(contents[i]);
      if(result.route.length > 0){
        results.push(result.route);
      }
    }
    
    console.log('Content Extraction completed...............');
     
    return res.json(results);
   
  } catch (error) {
    return res.sendStatus(500).json({ error: error.message });
  }
});


app.listen(3000, () => {
  console.log("running on port 3000");
});


