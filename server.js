const WebSocket = require("ws");
const express = require("express");
const path = require("path");

const app = express();  // Declare app before usage

const wss = new WebSocket.Server({ noServer: true });

const clients = new Set();

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

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`HTTP/WebSocket server running on port ${PORT}`);
});

server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});
