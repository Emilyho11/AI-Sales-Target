import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

const MAX_TOKENS = 1000;

/**
 * Summarize the content from a website with different prompt options and models.
 * @param {string} websiteUrl - The URL of the website to summarize.
 * @param {string} promptType - The type of prompt ("clio_compare" or "firm_summary").
 * @param {string} modelType - The model to use ("gpt-4" or "gpt-4o").
 * @returns {string} - The summarized content or "N/A" if URL is invalid.
 */
export async function summarizeContent(websiteUrl, promptType = "general", modelType = "gpt-4") {
    if (!websiteUrl) {
        return "N/A";
    }

    let prompt = '';
    if (promptType === "clio_compare") {
        prompt = `Write points of how Clio can help the following company. Tailor it to the law firm: ${websiteUrl}`;
    } else if (promptType === "firm_summary") {
        prompt = `Summarize ${websiteUrl} and give me information about the company (anything related to law, what software they use, number of employees, email and phone number, their strengths and weaknesses, etc.). Don't give me their address.`;
    } else if (promptType === "pitch") {
        prompt = `Write a pitch to sell Clio Law to the following company. State services it can offer and how clio can benefit them: ${websiteUrl}`;
    }

    const selectedModel = modelType === "gpt-4o" ? "gpt-4o" : "gpt-4";

    while (true) {
        try {
            const response = await openai.chat.completions.create({
                model: selectedModel,
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: MAX_TOKENS,
            });

            // Return the summarized content
            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error summarizing content:', error.response ? error.response.data : error.message);
            return null;
        }
    }
}

// Sample usage
// const baseUrl = 'https://accordlaw.ca/';

// // Use "clio" prompt with "gpt-4o"
// summarizeContent(baseUrl, "clio_compare", "gpt-4o").then((summary) => {
//     console.log("Clio Summary (GPT-4o):", summary);
// });

// // Use "general" prompt with "gpt-4"
// summarizeContent(baseUrl, "firm_summary", "gpt-4").then((summary) => {
//     console.log("General Summary (GPT-4):", summary);
// });

// // Use "pitch" prompt with "gpt-4o"
// summarizeContent(baseUrl, "pitch", "gpt-4o").then((summary) => {
//     console.log("Pitch Summary (GPT-4o):", summary);
// });
