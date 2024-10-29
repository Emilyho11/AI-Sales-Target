import sgMail from '@sendgrid/mail';
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: '../.env' });
const app = express();
app.use(cors());

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export function sendEmail(subject, text, to, from) {
  
  const msg = {
    to: to, // recipient
    from: from, // verified sender
    subject: subject,
    text: text,
    html: `<strong>${text}</strong>`,
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
