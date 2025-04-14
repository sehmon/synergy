// server.ts

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust this for production
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

let sliderValue = 0.5; // Default intensity

// REST endpoint (optional, if needed for polling or debugging)
app.get('/slider', (req, res) => {
  res.json({ value: sliderValue });
});

// Simulate slider updates from some source
setInterval(() => {
  // Simulate slider value change
  sliderValue = parseFloat((Math.random()).toFixed(2));
  io.emit('slider-update', sliderValue);
  console.log(`Broadcasting slider value: ${sliderValue}`);
}, 3000);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Optionally send the current value on connect
  socket.emit('slider-update', sliderValue);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});

