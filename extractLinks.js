import axios from "axios";
import cheerio from "cheerio";
// Check if a URL is relative
// function isRelativeUrl(url) {
//   const regex = /^((?:https?|ftp):\/\/)?[^\/\n]+(\/?.*)?$/;
//   return !regex.test(url);
// }

export async function extractLinks(url) {
  try {
    
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const links = [];

    // Extract all anchor tags with an href attribute
    $("a[href]").each((index, element) => {
      links.push($(element).attr("href"));
    });

    // Return the array of extracted links.
    return links;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
