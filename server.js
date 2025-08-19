require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/promote', async (req, res) => {
  const { issuer, target, groupId } = req.body;

  // Validate issuer permissions here
  // Use Roblox API to get current rank and set new rank

  res.json({ success: true, message: `Promoted ${target}` });
});

app.listen(3000, () => console.log('API running on port 3000'));
