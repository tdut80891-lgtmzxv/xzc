const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 8000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Serve static files
  if (pathname === '/' || pathname === '/index.html') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (pathname === '/styles.css') {
    fs.readFile(path.join(__dirname, 'styles.css'), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(data);
    });
  } else if (pathname === '/app.js') {
    fs.readFile(path.join(__dirname, 'app.js'), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(data);
    });
  } else if (pathname === '/coins.js') {
    fs.readFile(path.join(__dirname, 'coins.js'), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(data);
    });
  } else if (pathname === '/txs/') {
    const { id } = parsedUrl.query;
    if (!id) {
      res.writeHead(400);
      res.end('Missing id parameter');
      return;
    }
    fs.readFile(path.join(__dirname, 'TXID', 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (pathname === '/api/createTransaction' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      // Proxy to GhostSwap API
      const https = require('https');
      const options = {
        hostname: 'api.ghostswap.io',
        path: '/api/createTransaction',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      };

      const proxyReq = https.request(options, (proxyRes) => {
        let data = '';
        proxyRes.on('data', (chunk) => {
          data += chunk;
        });
        proxyRes.on('end', () => {
          res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
          res.end(data);
        });
      });

      proxyReq.on('error', (error) => {
        console.error('Proxy error:', error);
        res.writeHead(500);
        res.end('Proxy error');
      });

      proxyReq.write(body);
      proxyReq.end();
    });
  } else if (pathname === '/api/getTransactions' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      // Proxy to GhostSwap API
      const https = require('https');
      const options = {
        hostname: 'api.ghostswap.io',
        path: '/api/getTransactions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      };

      const proxyReq = https.request(options, (proxyRes) => {
        let data = '';
        proxyRes.on('data', (chunk) => {
          data += chunk;
        });
        proxyRes.on('end', () => {
          res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
          res.end(data);
        });
      });

      proxyReq.on('error', (error) => {
        console.error('Proxy error:', error);
        res.writeHead(500);
        res.end('Proxy error');
      });

      proxyReq.write(body);
      proxyReq.end();
    });
  } else if (pathname === '/api/getExchangeAmount' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      // Proxy to GhostSwap API
      const https = require('https');
      const options = {
        hostname: 'api.ghostswap.io',
        path: '/api/getExchangeAmount',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      };

      const proxyReq = https.request(options, (proxyRes) => {
        let data = '';
        proxyRes.on('data', (chunk) => {
          data += chunk;
        });
        proxyRes.on('end', () => {
          res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
          res.end(data);
        });
      });

      proxyReq.on('error', (error) => {
        console.error('Proxy error:', error);
        res.writeHead(500);
        res.end('Proxy error');
      });

      proxyReq.write(body);
      proxyReq.end();
    });
  } else if (pathname === '/exchange' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { sendAmount, sendAsset, receiveAmount, receiveAsset, recipientAddress } = data;

        // Generate a fake exchange ID
        const exchangeId = 'ex-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

        // Log the exchange data
        console.log('New exchange:', { exchangeId, sendAmount, sendAsset, receiveAmount, receiveAsset, recipientAddress });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ exchangeId }));
      } catch (error) {
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});
