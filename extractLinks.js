import axios from "axios";
import cheerio from "cheerio";
// Check if a URL is relative
// function isRelativeUrl(url) {
//   const regex = /^((?:https?|ftp):\/\/)?[^\/\n]+(\/?.*)?$/;
//   return !regex.test(url);
// }

export async function extractLinks(url) {
  try {
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });
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
