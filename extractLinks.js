import axios from "axios";
import cheerio from "cheerio";

function isValidURL(url) {
  // Regular expression for matching URLs
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

  // Test if the provided string matches the URL pattern
  return urlRegex.test(url);
}

export async function extractLinks(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const links = [];

    $("a").each((i, element) => {
      const href = $(element).attr("href");

      if (href) {
        links.push(href)
        // isValidURL(href) ? links.push(href) : '';
      }
      
    });

    // Return the array of extracted links.
    return links;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
