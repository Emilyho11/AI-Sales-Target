const express = require('express');
const app = express();
const port = 3000;

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
console.log(apiKey);

app.get('/api/get-website', (req, res) => {
  // Print api key
  res.send("test");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
