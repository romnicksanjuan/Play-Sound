









const WebSocket = require("ws");
const fs = require("fs");

const wss = new WebSocket.Server({ port: 3000 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  // ws.on("message", (message) => {
  //   console.log("Received:", message);

    // if (message === "TRIGGER_AUDIO") {
      sendAudio(ws); // Send audio when triggered
    // }
  // });

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

// Expose an API endpoint to trigger audio
const express = require("express");
const app = express();

app.get("/trigger-audio", (req, res) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      sendAudio(client);
    }
  });
  res.send("Audio triggered!");
});

app.listen(4000, () => console.log("Trigger server running on http://localhost:4000"));




/*



const WebSocket = require("ws");
const fs = require("fs");

const wss = new WebSocket.Server({ port: 3000 });
// Read and convert audio file to Base64
const audioFile = fs.readFileSync("sound.mp3").toString("base64");
wss.on("connection", (ws) => {
  console.log("Client connected");



  // Send the full Base64 string at once
  ws.send(audioFile);
  ws.send("END");

  console.log("Audio sent successfully");
});
*/