import cheerio from "cheerio";
import axios from "axios";
// import { chromium } from "playwright";

export async function scrape(link) {
  console.log("scrapping text from...", link);

  try {
    const response = await axios.get(link);
    const html = response.data;

    const $ = cheerio.load(html);
    $("script, style, img, iframe, video, audio").remove();
    const content = $(".content").html();
    return content;
  } catch (error) {
    console.error(`Error processing link ${link}: ${error.message}`);
    return null;
  }
}
