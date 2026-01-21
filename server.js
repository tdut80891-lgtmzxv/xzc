// server.js
const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // install with npm i node-fetch@2
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for your frontend
app.use(cors({ origin: 'https://nokycexch.xyz' }));
app.use(express.json()); // parse JSON POST bodies

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// Route: /txs/?id=...
app.get('/txs', (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).send('Missing id parameter');

  res.sendFile(path.join(__dirname, 'TXID', 'index.html'));
});

// Proxy helper function
async function proxyPost(req, res, apiPath) {
  try {
    const response = await fetch(`https://api.ghostswap.io${apiPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error' });
  }
}

// API routes
app.post('/api/createTransaction', (req, res) => proxyPost(req, res, '/api/createTransaction'));
app.post('/api/getTransactions', (req, res) => proxyPost(req, res, '/api/getTransactions'));
app.post('/api/getExchangeAmount', (req, res) => proxyPost(req, res, '/api/getExchangeAmount'));

// Example: local exchange endpoint
app.post('/exchange', (req, res) => {
  try {
    const { sendAmount, sendAsset, receiveAmount, receiveAsset, recipientAddress } = req.body;
    const exchangeId = 'ex-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    console.log('New exchange:', { exchangeId, sendAmount, sendAsset, receiveAmount, receiveAsset, recipientAddress });
    res.json({ exchangeId });
  } catch (err) {
    res.status(400).json({ error: 'Invalid JSON' });
  }
});

// Catch-all: serve index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
