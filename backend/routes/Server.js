import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import * as cheerio from 'cheerio';
import bodyParser from 'body-parser';
import { sendEmail } from '../api_calls/SendEmail.js';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env file
dotenv.config({ path: '../.env' });

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
if (!apiKey) {
  console.error('API Key not found. Please check your .env file.');
  process.exit(1); // Exit the process if the API key is not found
}

// Route to get the website URL from a Google Places API place_id
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
      const emailRegex = /\b[A-Za-z._%+-][A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
      const pageText = $('body').text();
      const emailMatches = pageText.match(emailRegex);
      if (emailMatches) {
          emails.push(...emailMatches);
      }

      // Extract phone numbers (simple regex for demonstration purposes)
      const phoneRegex = /(?:\d{3}[-.]?){2}\d{4}|\(\d{3}\) \d{3}-\d{4}/g;
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

// Route to scrape contact information from a website
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

app.post('/api/send-email', (req, res) => {
  const { subject, text, to, from, name } = req.body;

  if (!subject || !text || !to || !from) {
    return res.status(400).json({ error: 'All fields (subject, text, to, from) are required' });
  }

  try {
    sendEmail(subject, text, to, from, name);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Sending email failed:', error.message);
    res.status(500).json({ error: 'Sending email failed' });
  }
});

// Route to serve the HTML template
app.get('/api/email-template', (req, res) => {
  const name = req.query.name; // Get the name from query parameters
  const templatePath = '../../frontend/src/assets/email_template.html';

  fs.readFile(templatePath, 'utf8', (err, template) => {
    if (err) {
      console.error('Error reading email template:', err.message);
      return res.status(500).json({ error: 'Failed to load email template' });
    }

    const htmlContent = template.replace('{{name}}', name || 'there'); // Replace placeholder with name

    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
