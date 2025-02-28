const WebSocket = require("ws");
const fs = require("fs");
const express = require("express");
const http = require("http");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app); // Create HTTP server

// Attach WebSocket to the same HTTP server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("close", () => console.log("Client disconnected"));
});

// Function to send audio
const sendAudio = (ws) => {
  const audioPath = "sound.mp3"; // Path to your audio file

  fs.readFile(audioPath, { encoding: "base64" }, (err, base64Data) => {
    if (err) {
      console.error("Error reading audio file:", err);
      return;
    }

    console.log("Sending audio...");
    ws.send(base64Data);
    ws.send("END"); // Signal end of file
  });
};

// API endpoint to trigger audio
app.get("/trigger-audio", (req, res) => {
  let sent = false;

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      sendAudio(client);
      sent = true;
    }
  });

  if (sent) {
    res.send("Audio sent successfully!");
  } else {
    res.status(500).send("No WebSocket clients connected.");
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
