// server.js
const WebSocket = require("ws");
const express = require("express");
const path = require("path");

const app = express();
const wss = new WebSocket.Server({ noServer: true });

const clients = new Set();

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

wss.on("connection", (ws) => {
  clients.add(ws);
  ws.on("close", () => clients.delete(ws));
});

app.use(express.json());

app.post("/send", (req, res) => {
  const message = req.body.message;
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
  res.send("Message sent to WebSocket clients.");
});

// Optional: a simple health check or message at root (served by index.html if exists)
// app.get("/", (req, res) => {
//   res.send("Roblox Chat Relay Server is running");
// });

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`HTTP/WebSocket server running on port ${PORT}`);
});

server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});
