const { firefox, webkit, chromium } = require('playwright');

async function crawlSite(url) {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to the initial URL
    await page.goto(url);

    // Extract links from the initial page
    const links = await page.$$eval('a', anchors => anchors.map(anchor => anchor.href));

    // Process each link
    for (const link of links) {
        // Navigate to the link
        await page.goto(link);

        // Extract and process data from the page (you can modify this part based on your requirements)
        const pageTitle = await page.title();
        console.log(`Title of ${link}: ${pageTitle}`);

        // Here you can extract other data, click buttons, fill forms, etc.
    }

    await browser.close();
}

// Example usage
const targetUrl = 'https://example.com';
crawlSite(targetUrl);
