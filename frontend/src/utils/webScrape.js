import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';

// Function to determine if a link is internal
function isInternalLink(href, baseUrl) {
    try {
        const fullUrl = new URL(href, baseUrl);
        return fullUrl.hostname === new URL(baseUrl).hostname; // Compare hostnames
    } catch (err) {
        return false; // Skip invalid URLs
    }
}

// Function to clean up the text content
function cleanText(text) {
    // Remove any unwanted content using regex or specific conditions
    // Example: remove extra whitespace and newlines
    let cleaned = text.replace(/\s+/g, ' ').trim();

    // Remove common phrases that are unnecessary
    const filters = [
        'advertisement',
        'copyright',
        'terms of service',
    ];

    // Remove filtered phrases
    filters.forEach(filter => {
        cleaned = cleaned.replace(new RegExp(filter, 'gi'), ''); // Case insensitive
    });

    return cleaned;
}

// Function to extract and return all visible text from a page
async function extractPageInfo(baseUrl) {
    try {
        const { data: html } = await axios.get(baseUrl);
        const $ = cheerio.load(html);

        // Extract all visible text from the page
        let pageInfo = $('body').text().trim();
        console.log(`Extracted information from: ${baseUrl}`);

        // Clean the extracted text
        pageInfo = cleanText(pageInfo);

        return pageInfo;
    } catch (error) {
        console.error(`Error extracting information from ${baseUrl}:`, error.message);
        return null;
    }
}

// Function to scrape the website and collect all text info
 export async function scrapeWebsite(baseUrl, visited = new Set(), collectedData = []) {
    try {
        // Fetch the page content and extract the info
        const pageInfo = await extractPageInfo(baseUrl);
        if (pageInfo) {
            collectedData.push({ url: baseUrl, content: pageInfo });
        }

        // Fetch the HTML content
        const { data: html } = await axios.get(baseUrl);
        const $ = cheerio.load(html);

        console.log(`Scraping: ${baseUrl}`);
        visited.add(baseUrl); // Add the current page to visited

        // Find all anchor tags and scrape internal links
        const promises = []; // Array to hold promises for internal links

        $('a').each((i, element) => {
            const href = $(element).attr('href');
            if (href && isInternalLink(href, baseUrl)) {
                const fullUrl = new URL(href, baseUrl).href;

                // If it's an internal link and not visited, recurse into it
                if (!visited.has(fullUrl)) {
                    visited.add(fullUrl);
                    promises.push(scrapeWebsite(fullUrl, visited, collectedData));
                }
            }
        });

        // Wait for all internal link promises to resolve
        await Promise.all(promises);
    } catch (error) {
        console.error(`Error scraping ${baseUrl}:`, error.message);
    }
    return collectedData;
}

// Example usage
const baseUrl = 'https://cscd01.com/';
const data = await scrapeWebsite(baseUrl);
console.log("Collected Data:", data);
