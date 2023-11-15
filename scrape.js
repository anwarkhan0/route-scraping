// import cheerio from "cheerio";
// import axios from "axios";
import { chromium } from "playwright";

export async function scrape(link) {
  console.log("scrapping text from...", link);

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(link);

    // Remove unwanted elements
    await page.evaluate(() => {
      let elements = document.querySelectorAll(
        "script, style, img, iframe, video, audio"
      );
      for (let element of elements) {
        element.remove();
      }
    });

    // Get the text content after removing scripts
    const content = await page.evaluate(() => document.body.innerText);
    await browser.close();
    return content;
  } catch (error) {
    console.error(`Error processing link ${link}: ${error.message}`);
    return null;
  }
}
