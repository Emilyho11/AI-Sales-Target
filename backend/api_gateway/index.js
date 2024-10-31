import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config({ path: '../.env' });
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

// Define a middleware function to log requests
function logRequest(req, res, next) {
	console.log("Request to:", req.url);
	console.log("Request headers:", req.headers);
	console.log("Request body:", req.body); // if you want to log request body
	console.log("Request params:", req.params);

	next(); // call next middleware in chain
}

app.use(logRequest);

  // User Service
app.use('/user', createProxyMiddleware({
  target: process.env.SERVICE_USER,
  changeOrigin: true,
  pathRewrite: { '^/user': '' },
}));

// Email and Website Service
app.use('/server', createProxyMiddleware({
  target: process.env.SERVICE_SERVER,
  changeOrigin: true,
  pathRewrite: { '^/server': '' },
}));

// Catch-all route to handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the API gateway
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
