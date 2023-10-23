import axios from "axios";
import cheerio from "cheerio";

// Check if a URL is relative
function isRelativeUrl(url) {
  const regex = /^((?:https?|ftp):\/\/)?[^\/\n]+(\/?.*)?$/;
  return !regex.test(url);
}

export async function extractLinks(url, mainDomain) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const links = [];

    $("a").each((i, element) => {
      const href = $(element).attr("href");
      if (href) {
        isRelativeUrl(href) ? links.push(`https://www.${mainDomain}${href}`) : links.push(href);
      }
      
    });

    // Return the array of extracted links.
    return links;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
