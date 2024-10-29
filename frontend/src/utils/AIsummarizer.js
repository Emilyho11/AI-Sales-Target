import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { scrapeWebsite } from './webScrape.js';

dotenv.config(); // Load environment variables

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const model = "gpt-4o";

export async function summarizeContent(content) {
    if (!content) {
        console.error('Content is required');
        return null;
    }

    try {
        const response = await openai.chat.completions.create({
            model: model,
            messages: [
                {
                    role: "user",
                    content: `Summarize the following text to have enough detail to know everything:\n\n${content}`
                }
            ],
            max_tokens: 1000,
        });

        // Return the summarized content
        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error summarizing content:', error.response ? error.response.data : error.message);
        return null;
    }
}

// Sample usage
// Example usage
const baseUrl = 'https://cscd01.com/';
const data = await scrapeWebsite(baseUrl);
// console.log("Collected Data:", data);
// Convert the collected data to a string
const textToSummarize = data.map(item => item.content).join(' ');

summarizeContent(textToSummarize).then((summary) => {
    console.log("Summary:", summary);
});
