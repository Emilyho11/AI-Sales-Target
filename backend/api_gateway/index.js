import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import ServerService from './routes/Server.js';
import UserService from './routes/Database.js';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure required environment variables are set
if (!process.env.SERVICE_USER || !process.env.SERVICE_SERVER) {
  console.error('Error: SERVICE_USER and SERVICE_SERVER environment variables are required.');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// Define a middleware function to log requests
function logRequest(req, res, next) {
  console.log(`Request to: ${req.url}`);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Request params:', req.params);
  console.log('Request method:', req.method);
  next();
}

app.use(logRequest);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'API Gateway is running. Use /user or /server to access services.' });
});

app.use('/user', createProxyMiddleware({
  target: process.env.SERVICE_USER,
  changeOrigin: true,
  pathRewrite: { '^/user': '' },
},
UserService));

app.use('/server', createProxyMiddleware({
  target: process.env.SERVICE_SERVER,
  changeOrigin: true,
  pathRewrite: { '^/server': '' },
},
ServerService));

// Catch-all route to handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the API gateway
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
