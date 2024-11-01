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
export async function summarizeContent(websiteUrl, promptType = "general", modelType) {
    if (!websiteUrl) {
        return "N/A";
    }

    let prompt = '';
    if (promptType === "clio_compare") {
        prompt = `What specific services/software can Clio offer to support the law firm ${websiteUrl}? Focus on relevant software that align with the firm's needs. Please tailor the response to that specific law firm, and avoid too much white space.`;
    } else if (promptType === "firm_summary") {
        prompt = `Summarize the website at ${websiteUrl} with a professional overview of the company, focusing on its legal services, software usage, employee count, strengths, and challenges. Include insights from any available trends report, analyzing company growth, market position, or industry challenges if possible. Exclude any address or contact information, and get to the point. If it doesn't have information on a certain part, you can skip it and avoid saying it was not found on the website or the website itself. Use company name.`;
    } else if (promptType === "pitch") {
        prompt = `Write a pitch to sell Clio's services/software to the following company. State services it can offer and how clio can benefit them: ${websiteUrl}. Address the company by name.`;
    } else if (promptType === "percentage") {
        prompt = `Given the current trends in law firm technology adoption, cloud-based software advantages, and recent developments in ${websiteUrl}, predict the likelihood (as a percentage) that ${websiteUrl} will choose to adopt Clio software and become their client. Factors to consider include the benefits of Clio's cloud-based solutions, current market demands for legal tech, client needs, and the potential cost-efficiency advantages for ${websiteUrl}. Get information about the company. Give me only a percentage as the answer.`;
    }

    const selectedModel = modelType;

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
