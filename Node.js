// server.js
const WebSocket = require("ws");
const express = require("express");
const app = express();
const wss = new WebSocket.Server({ noServer: true });

const clients = new Set();

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

const server = app.listen(3000, () => {
  console.log("HTTP/WebSocket server running on port 3000");
});

server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});
