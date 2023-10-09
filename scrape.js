import cheerio from  "cheerio";
import axios from "axios";

export async function scrape(url) {
  console.log("loading =====>>>>", url);
  const response = await axios.get(url);
  const html = response.data;

  const $ = cheerio.load(html);

  $("script").remove();
  $("img").remove();

  // return all the text from the HTML
  return $("body").text();
}
