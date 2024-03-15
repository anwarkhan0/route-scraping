import cheerio from "cheerio";
import axios from "axios";
// import { firefox } from "playwright";


export async function scrape(link) {
  console.log("scrapping text from...", link);

  try {

    // ------------------ Playwright Code ----------------------//////

    // const browser = await firefox.launch();
    // const page = await browser.newPage();


    // // Navigate to the target web page
    // await page.goto(link);

    // // Exclude scripts, images, and iframes
    // await page.addScriptTag({
    //   content: `
    //   const elements = document.querySelectorAll('script, img, iframe');
    //   for (const element of elements) {
    //     element.parentNode.removeChild(element);
    //   }
    // `,
    // });

    // // Extract the text content
    // const content = await page.evaluate(() => document.body.textContent);

    // await browser.close();

    // return content;

    //------------------- end -------------///

    const response = await axios.get(link);
    const $ = cheerio.load(response.data);

    // Remove all tags
    $('body *').remove();

    // Get the remaining text
    const text = $.text().trim();

    return text;

    

  } catch (error) {
    console.error(`Error processing link ${link}: ${error.message}`);
    return null;
  }

}
