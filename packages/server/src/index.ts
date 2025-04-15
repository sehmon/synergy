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

// Add this before `server.listen(...)`
app.get('/control', (req, res) => {
  res.send(`
    <html>
      <body style="font-family: sans-serif; padding: 2rem;">
        <h2>Lighting Slider Control</h2>
        <input type="range" id="slider" min="0" max="1" step="0.01" value="${sliderValue}" />
        <span id="value">${sliderValue}</span>
        
        <script>
          const slider = document.getElementById('slider');
          const valueDisplay = document.getElementById('value');

          slider.addEventListener('input', async () => {
            const value = parseFloat(slider.value);
            valueDisplay.innerText = value;

            await fetch('/slider', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ value }),
            });
          });
        </script>
      </body>
    </html>
  `);
});

app.post('/slider', (req, res) => {
  const { value } = req.body;
  sliderValue = parseFloat(value.toFixed(2));
  io.emit('slider-update', sliderValue);
  console.log(`Updated slider to: ${sliderValue}`);
  res.sendStatus(200);
});



const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});

