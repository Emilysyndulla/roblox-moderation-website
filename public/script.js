const consoleEl = document.getElementById("console");

// Use the current host for WebSocket connection
const protocol = window.location.protocol === "https:" ? "wss" : "ws";
const socketUrl = `${protocol}://${window.location.host}`;

const socket = new WebSocket(socketUrl);

socket.addEventListener("message", (event) => {
  consoleEl.textContent += event.data + "\n";
  consoleEl.parentElement.scrollTop = consoleEl.parentElement.scrollHeight;
});

socket.addEventListener("open", () => {
  console.log("WebSocket connected");
});

socket.addEventListener("message", (event) => {
  consoleEl.textContent += event.data + "\n";
  consoleEl.parentElement.scrollTop = consoleEl.parentElement.scrollHeight;
});

socket.addEventListener("close", () => {
  consoleEl.textContent += "\n[Disconnected from server]";
});

socket.addEventListener("error", (err) => {
  consoleEl.textContent += `\n[WebSocket error: ${err.message}]`;
});
