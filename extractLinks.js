import axios from "axios";
import cheerio from "cheerio";

function containsContactOrAbout(url) {
  const regex = /(contact-us|about-us|faq|tel|contact|about)/i; // i flag for case-insensitive matching
  return regex.test(url);
}

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
    // Load the HTML document into Cheerio.
    const $ = cheerio.load(html);

    // Select all the anchor tags in the body element of the page.
    const links = $("body a");

    // Extract the href attribute from each anchor tag.
    const extractedLinks = links.map((index, element) => {
        const href = $(element).attr("href");
        if (isValidURL(href)) {
            console.log(href);
            return href;
        }
        return null;
    }).get();

    //exclude links
    const filteredLinks = extractedLinks.filter(
      (link) => !containsContactOrAbout(link)
    );

    // Return the array of extracted links.
    return filteredLinks;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
