const WebSocket = require("ws");
const express = require("express");
const app = express();
const wss = new WebSocket.Server({ noServer: true });
const clients = new Set();

app.use(express.json());

wss.on("connection", (ws) => {
  clients.add(ws);
  ws.on("close", () => clients.delete(ws));
});

app.post("/send", (req, res) => {
  const message = req.body.message;
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
  res.send("Message sent");
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});

server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});
