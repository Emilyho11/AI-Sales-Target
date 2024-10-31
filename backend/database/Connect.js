import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path'; // Import the path module
import { fileURLToPath } from 'url'; // Import the fileURLToPath function from the url module

// Define __dirname for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the path to the .env file
const envPath = path.resolve(__dirname, '../.env');
// Load environment variables from .env file
dotenv.config({ path: envPath });

const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function connect() {
  try {
    if (!client.topology || !client.topology.isConnected()) {
      await client.connect();
    }
    return client.db('legalSalesTarget').collection('users');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}
