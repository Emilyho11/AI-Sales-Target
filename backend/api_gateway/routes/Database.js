import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import * as cheerio from 'cheerio';
import bodyParser from 'body-parser';
import { insertUser, deleteUser, updateUser, getUsers, getUserByEmail, loginUser, userExists } from '../../database/Users.js';

const app = express();
const port = 3001;
app.use(cors());
app.use(bodyParser.json());

// Route to insert the user in the database
app.post('/api/addUser', async (req, res) => {
  const newUser = req.body.user; // Getting user from query params
  
  if (!newUser) {
    return res.status(400).json({ error: 'user is required' });
  }

  // Check if user exists
  const exists = await userExists(newUser.email);
  if (exists) {
    return res.json({ message: 'User already exists' });
  }

  try {
    // Insert the user in the database
    await insertUser(newUser);
    return res.json({ message: 'User inserted successfully' });
  } catch (error) {
    console.error('Error inserting user:', error);
    return res.status(500).json({ error: 'An error occurred while inserting user' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  try {
    // Login the user
    const user = await loginUser(email, password);
    if (user === "User not found") {
      return res.json({ message: 'User not found' });
    }
    if (user === "Incorrect password") {
      return res.json({ message: 'Incorrect password' });
    }
    return res.json({ message: 'User logged in successfully', user });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ error: 'An error occurred while logging in user' });
  }
});

// Delete a user by email
app.delete('/api/deleteUser', async (req, res) => {
  const userEmail = req.query.email; // Getting email from query params

  if (!userEmail) {
    return res.status(400).json({ error: 'email is required' });
  }

  try {
    // Delete the user from the database
    deleteUser(userEmail);
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'An error occurred while deleting user' });
  }
});

// Update a user by email
app.put('/api/updateUser', async (req, res) => {
  const userEmail = req.query.email; // Getting email from query params
  const updatedUser = req.query.user; // Getting user from query params

  if (!userEmail || !updatedUser) {
    return res.status(400).json({ error: 'email and user are required' });
  }

  try {
    // Update the user in the database
    updateUser(userEmail, updatedUser);
    return res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'An error occurred while updating user' });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
