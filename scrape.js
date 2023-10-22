import cheerio from "cheerio";
import axios from "axios";

export async function scrape(link) {
    console.log("scrapping text from...", link);

    const axiosConfig = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Upgrade-Insecure-Requests": "1",
        "Connection": "keep-alive",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "If-Modified-Since": "Thu, 01 Jan 1970 00:00:00 GMT",
        "If-None-Match": "W/" + Math.random().toString(36).substr(2, 9),
      }
    };

    try {
      const response = await axios.get(link, axiosConfig);
      const html = response.data;
      const $ = cheerio.load(html);

      $("script").remove();
      $("style").remove();
      $("img").remove();
      $("iframe").remove();
      $("video").remove();
      $("audio").remove();

      // Get the text content after removing scripts
      const content = $("body").text();
      return content;
    } catch (error) {
      console.error(`Error processing link ${link}: ${error.message}`);
      return null;
    }
}
