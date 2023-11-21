// import axios from "axios";
// import cheerio from "cheerio";
import {chromium} from 'playwright';
// Check if a URL is relative
// function isRelativeUrl(url) {
//   const regex = /^((?:https?|ftp):\/\/)?[^\/\n]+(\/?.*)?$/;
//   return !regex.test(url);
// }

export async function extractLinks(url) {
  try {

    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Navigate to the target web page
    await page.goto(url);

    // Extract all links
    const links = await page.$$eval("a", (anchors) => {
      return anchors.map((anchor) => anchor.href);
    });

    // console.log(links);

    await browser.close();


    // const response = await axios.get(url);
    // const html = response.data;

    // const $ = cheerio.load(html);
    // const links = $("a")
    //   .map((i, el) => $(el).attr("href"))
    //   .toArray();

    // console.log("Collected Links:", links);
    return links;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
