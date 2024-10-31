import sgMail from '@sendgrid/mail';
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path'; // Import the path module
import { fileURLToPath } from 'url'; // Import the fileURLToPath function from the url module

// Define __dirname for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the path to the .env file
const envPath = path.resolve(__dirname, '../../.env');
// Load environment variables from .env file
dotenv.config({ path: envPath });

const app = express();
app.use(cors());

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export function sendEmail(subject, text, to, from) {

  const msg = {
    to: to, // recipient
    from: from, // verified sender
    subject: subject,
    text: text,
    html: text,
  }
  
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

// Example usage
// sendEmail('Testing email for Clio Hackathon', 'Hackathon email sent works!', 'emily.ho@clio.com', 'emily.ho@clio.com')
