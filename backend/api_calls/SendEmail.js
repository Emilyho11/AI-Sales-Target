const sgMail = require('@sendgrid/mail')
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: '../.env' });
const app = express();
app.use(cors());

// Print the API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: 'emily.ho@clio.com', // Change to your recipient
  from: 'emily.ho@clio.com', // Change to your verified sender
  subject: 'Testing email for Clio Hackathon',
  text: 'Hackathon email sent works!',
  html: '<strong>Hackathon email sent works!</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
