const express = require("express");
const WebSocket = require("ws");

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

const app = express();
app.use(express.json());

const wss = new WebSocket.Server({ noServer: true });
const clients = new Set();

// Broadcast helper
function broadcast(message) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// WebSocket connection handler
wss.on("connection", (ws) => {
  clients.add(ws);
  ws.on("close", () => clients.delete(ws));
});

// POST /send endpoint to receive chat messages
app.post("/send", (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).send("Missing message");

  broadcast(message);
  res.send("Message sent");
});

// Optional: simple homepage to avoid "Cannot GET /"
app.get("/", (req, res) => {
  res.send("Roblox Chat Relay Server is running");
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 3000}`);
});

// Upgrade HTTP server to handle WebSocket connections
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
