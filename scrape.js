import cheerio from "cheerio";
import axios from "axios";

export async function scrape(url) {
  console.log("scrapping text from...", url);

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });
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
