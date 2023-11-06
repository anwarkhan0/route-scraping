import cheerio from "cheerio";
import axios from "axios";

export async function scrape(url) {
  console.log("scrapping text from...", url);

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Remove specific tags
    $("script, style, img, iframe, video, audio").remove();

    // Extract text content from the body
    const textContent = $("body").text().trim();
    return textContent;
  } catch (error) {
    console.error(`Error processing link ${link}: ${error.message}`);
    return null;
  }
}
