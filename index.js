import { compile } from "html-to-text";
import { RecursiveUrlLoader } from "langchain/document_loaders/web/recursive_url";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

import path from "path";
import express from "express";
import { config } from 'dotenv';

import { aiExtract } from './aiExtracter.js';
import { extractLinks } from './extractLinks.js';

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
    
    links.forEach( url => {
      console.log('scrapping===========>>>>>>>', url);
      
    })



    const loader = new CheerioWebBaseLoader(
      url,
      {
        selector: "a", // Select all anchor elements
      }
    );

    const docs = await loader.load();

    const hrefLinks = docs.map((doc) => doc.attr("href")); // Extract href attribute from each anchor element

    console.log(hrefLinks);
    
    res.sendStatus(200);
   
  } catch (error) {
    return res.sendStatus(500).json({ error: error.message });
  }
});


app.listen(3000, () => {
  console.log("running on port 3000");
});


