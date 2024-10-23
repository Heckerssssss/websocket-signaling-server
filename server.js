const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = {};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const msg = JSON.parse(message);
    
    if (msg.type === 'join') {
      clients[msg.id] = ws;
    } else if (msg.type === 'offer' || msg.type === 'answer' || msg.type === 'ice-candidate') {
      const targetClient = clients[msg.targetId];
      if (targetClient) {
        targetClient.send(JSON.stringify(msg));
      }
    }
  });

  ws.on('close', () => {
    for (const id in clients) {
      if (clients[id] === ws) {
        delete clients[id];
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3000; // Use PORT from Render
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
