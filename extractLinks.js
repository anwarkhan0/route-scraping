// import axios from "axios";
// import cheerio from "cheerio";
import {chromium} from 'playwright';
// Check if a URL is relative
// function isRelativeUrl(url) {
//   const regex = /^((?:https?|ftp):\/\/)?[^\/\n]+(\/?.*)?$/;
//   return !regex.test(url);
// }

export async function extractLinks(url) {
  try {

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to the website
    await page.goto(url);

    // Wait for all network requests to finish (including dynamic content)
    await page.waitForLoadState('load');

    // Extract all links from the page
    const links = await page.$$eval('a', links => links.map(link => link.href));

    // Print the collected links
    console.log('Collected Links:', links);

    await browser.close();

    // Return the array of extracted links.
    return links;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
