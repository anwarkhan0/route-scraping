import path from "path";
import express from "express";
import { config } from 'dotenv';
import cheerio from "cheerio";
import axios from "axios";

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

    // loading web pages
    console.log('loading web pages');
    const links = await extractLinks(url);
    
    const contents = [];

    for (const link of links) {
      console.log("Processing...", link);

      const axiosConfig = {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          "If-Modified-Since": "Thu, 01 Jan 1970 00:00:00 GMT",
          "If-None-Match": "W/" + Math.random().toString(36).substr(2, 9),
        },
        timeout: 10000, // 10 seconds timeout
      };

      try {
        const response = await axios.get(link, axiosConfig);
        const html = response.data;
        const $ = cheerio.load(html);

        $("script").remove();
        $("style").remove();

        // Get the text content after removing scripts
        const content = $("body").text();
        contents.push(content);
      } catch (error) {
        console.error(`Error processing link ${link}: ${error.message}`);
        continue;
      }
    }


    console.log(contents.length, ' pages loaded.');

    console.log('Content Extraction started................');

    let results = [];
    for(let i = 0; i< contents.length; i++){
      console.log('Extraction of page=>> ' + i);
      const result = await aiExtract(contents[i]);
      if(result.route.length > 0){
        results = [...results, result.route];
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


