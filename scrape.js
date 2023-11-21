// import cheerio from "cheerio";
// import axios from "axios";
import { chromium } from "playwright";

function genRandSecs() {
  const randomNumber = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
  return randomNumber;
}


export async function scrape(link) {
  console.log("scrapping text from...", link);

  try {

    const browser = await chromium.launch();
    const page = await browser.newPage();

    page.setDefaultTimeout(2000);

    // Navigate to the target web page
    await page.goto(link);

    // Exclude scripts, images, and iframes
    await page.addScriptTag({
      content: `
      const elements = document.querySelectorAll('script, img, iframe');
      for (const element of elements) {
        element.parentNode.removeChild(element);
      }
    `,
    });

    // Extract the text content
    const content = await page.evaluate(() => document.body.textContent);

    await browser.close();


    // await new Promise((resolve) => setTimeout(resolve, genRandSecs()));
    // const response = await axios.get(link);
    // const html = response.data;

    // const $ = cheerio.load(html);
    // $("script, style, img, iframe, video, audio").remove();
    // const content = $(".content").html();
    return content;
  } catch (error) {
    console.error(`Error processing link ${link}: ${error.message}`);
    return null;
  }

}
