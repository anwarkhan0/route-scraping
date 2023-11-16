import axios from "axios";
import cheerio from "cheerio";
// import {chromium} from 'playwright';
// Check if a URL is relative
// function isRelativeUrl(url) {
//   const regex = /^((?:https?|ftp):\/\/)?[^\/\n]+(\/?.*)?$/;
//   return !regex.test(url);
// }

export async function extractLinks(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);
    const links = $("a")
      .map((i, el) => $(el).attr("href"))
      .toArray();

    console.log("Collected Links:", links);
    return links;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
