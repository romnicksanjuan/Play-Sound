import React, { useEffect, useState } from "react";

export default function App() {
  const [audioBase64, setAudioBase64] = useState("");
  const [audioContext, setAudioContext] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onmessage = async (event) => {
      if (event.data === "END") {
        console.log("Full Base64 received, playing...");
        await playAudio();
      } else {
        setAudioBase64((prev) => prev + event.data);
      }
    };

    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, []);

  useEffect(() => {
    if (audioBase64) {
      playAudio();
    }
  }, [audioBase64]);

  const playAudio = async () => {
    if (!audioBase64) return;

    try {
      console.log("Base64 Length:", audioBase64.length);

      // Ensure proper padding (Base64 length must be a multiple of 4)
      const correctedBase64 = audioBase64.padEnd(audioBase64.length + (4 - (audioBase64.length % 4)) % 4, "=");

      // Convert Base64 to binary
      const binaryString = atob(correctedBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Initialize AudioContext if not already set
      let context = audioContext;
      if (!context) {
        context = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(context);
      }

      // Decode audio and play it
      const audioBuffer = await context.decodeAudioData(bytes.buffer);
      const source = context.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(context.destination);
      source.start();
      console.log("Audio playing via Web Audio API...");
    } catch (error) {
      console.error("Error decoding Base64:", error);
    }
  };

  return (
    <div>
      <h2>Receiving Audio Stream...</h2>
    </div>
  );
}
