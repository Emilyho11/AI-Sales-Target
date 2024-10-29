import axios from 'axios';
import * as cheerio from 'cheerio';
import { summarizeContent } from './AIsummarizer.js';

// Function to determine if a link is internal
function isInternalLink(href, baseUrl) {
    try {
        const fullUrl = new URL(href, baseUrl);
        return fullUrl.hostname === new URL(baseUrl).hostname; // Compare hostnames
    } catch (error) {
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

// Function that checks if scraping is allowed for legal reasons
async function isScrapingAllowed(baseUrl) {
    try {
        const robotsUrl = new URL('/robots.txt', baseUrl).href;
        const { data: robotsTxt } = await axios.get(robotsUrl);
        const lines = robotsTxt.split('\n');
        const disallowedPaths = [];
        const allowedPaths = [];
        let crawlDelay = 0;

        lines.forEach(line => {
            if (line.startsWith('Disallow')) {
                disallowedPaths.push(line.split(':')[1].trim());
            } else if (line.startsWith('Allow')) {
                allowedPaths.push(line.split(':')[1].trim());
            } else if (line.startsWith('Crawl-delay')) {
                crawlDelay = parseInt(line.split(':')[1].trim(), 10);
            }
        });

        const basePath = new URL(baseUrl).pathname;
        const isDisallowed = disallowedPaths.some(path => basePath.startsWith(path));
        const isAllowed = allowedPaths.some(path => basePath.startsWith(path));

        return {
            allowed: !isDisallowed || isAllowed,
            crawlDelay: crawlDelay
        };
    } catch (error) {
        console.error(`Error checking robots.txt for ${baseUrl}:`, error.message);
        return { allowed: false, crawlDelay: 0 }; // If there's an error, assume scraping is not allowed
    }
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
export async function scrapeWebsite(baseUrl, visited = new Set(), collectedData = [], siteCount = { count: 0 }) {
    try {
        // Check if scraping is allowed
        const { allowed, crawlDelay } = await isScrapingAllowed(baseUrl);
        if (!allowed) {
            if (siteCount.count === 0) {
                return [""];
            }
            console.log(`Scraping not allowed for ${baseUrl}`);
            return collectedData;
        }

        // Increment the site count
        siteCount.count++;
        if (siteCount.count > 10) {
            return collectedData;
        }

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
                    promises.push(scrapeWebsite(fullUrl, visited, collectedData, siteCount));
                }
            }
        });

        // Wait for all internal link promises to resolve
        await Promise.all(promises);

        // Respect crawl delay
        if (crawlDelay > 0) {
            await new Promise(resolve => setTimeout(resolve, crawlDelay * 1000));
        }
    } catch (error) {
        console.error(`Error scraping ${baseUrl}:`, error.message);
    }
    return collectedData;
}

// Example usage
// (async () => {
//     const baseUrl = 'https://williamshrlaw.com/';
//     const data = await scrapeWebsite(baseUrl);

//     // Convert the collected data to a string
//     const textToSummarize = data.map(item => item.content).join(' ');

//     summarizeContent(textToSummarize).then((summary) => {
//         console.log("Summary:", summary);
//     });
// })();
