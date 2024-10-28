const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

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

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
