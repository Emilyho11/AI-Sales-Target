const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const cheerio = require('cheerio');

// Load environment variables from .env file
dotenv.config({ path: '../.env' });

const app = express();
const port = 3000;
app.use(cors());

const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
if (!apiKey) {
  console.error('API Key not found. Please check your .env file.');
  process.exit(1); // Exit the process if the API key is not found
}

app.get('/api/get-website', async (req, res) => {
  const placeId = req.query.place_id; // Getting place_id from query params

  if (!placeId) {
    return res.status(400).json({ error: 'place_id is required' });
  }

  try {
    // Making the request to Google Places API
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;
    const response = await axios.get(url);

    const placeDetails = response.data.result;

    // Check if the website is present in the API response
    if (placeDetails && placeDetails.website) {
      return res.json(placeDetails.website); // Return the website URL
    } else {
      return res.status(404).json({ error: 'Website not found for this place' });
    }
  } catch (error) {
    console.error('Error fetching place details:', error.response ? error.response.data : error.message);
    return res.status(500).json({ error: 'An error occurred while fetching place details' });
  }
});

// Function to extract email addresses and phone numbers from a page
async function extractContactInfo(baseUrl) {
  try {
      const { data: html } = await axios.get(baseUrl);
      const $ = cheerio.load(html);

      const emails = [];
      const phoneNumbers = [];

      // Extract email addresses
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const pageText = $('body').text();
      const emailMatches = pageText.match(emailRegex);
      if (emailMatches) {
          emails.push(...emailMatches);
      }

      // Extract phone numbers (simple regex for demonstration purposes)
      const phoneRegex = /(\+?\d{1,4}[\s-])?(?:\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}/g;
      const phoneMatches = pageText.match(phoneRegex);
      if (phoneMatches) {
          phoneNumbers.push(...phoneMatches);
      }

      return { emails, phoneNumbers };
  } catch (error) {
      console.error(`Error extracting contact info from ${baseUrl}:`, error.message);
      return { emails: [], phoneNumbers: [] };
  }
}

app.get('/api/scrape-contact-info', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const contactInfo = await extractContactInfo(url);
    res.json(contactInfo);
  } catch (error) {
    console.error('Error scraping contact info:', error.message);
    res.status(500).json({ error: 'Failed to scrape contact info' });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
