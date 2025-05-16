import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { PlayerPositionData } from '@synergy/shared';
import { TrailService } from './services/prisma.service';

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

const n = 4;
const half = n / 2;
const positions: [number, number][] = [];

for (let i = -half; i < half; i++) {
  for (let j = -half; j < half; j++) {
    positions.push([i, j]);
  }
}

const positionScale = 4;
const scaledPositions = positions.map(([x, y]) => [x * positionScale, y * positionScale]);

// REST endpoint (optional, if needed for polling or debugging)
app.get('/slider', (req, res) => {
  res.json({ value: sliderValue });
});

// Handle player trails using the database
app.post('/player-trail', async (req, res) => {
  try {
    const response = req.body as PlayerPositionData;
    const { userInfo, positionHistory } = response;
    console.log('post to /player-trail of length', positionHistory.length);
    
    // Add timestamp if not present
    const dataWithTimestamp = {
      ...response,
      userInfo: {
        ...response.userInfo,
        timestamp: new Date().toISOString()
      }
    };
    
    // Save to database
    const trailId = await TrailService.saveTrail(dataWithTimestamp);
    
    res.json({ 
      success: true, 
      trailId,
      message: 'Trail saved to database'
    });
  } catch (error) {
    console.error('Error saving trail:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to save trail'
    });
  }
})

// API endpoint to get all stored trails
app.get('/api/trails', async (req, res) => {
  try {
    // Get limit from query params or default to 50
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    
    // Get trails from database
    const trails = await TrailService.getAllTrails(limit);
    
    res.json({ trails });
  } catch (error) {
    console.error('Error fetching trails:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trails'
    });
  }
});

// API endpoint to clear all trails
app.post('/api/trails/clear', async (req, res) => {
  try {
    // Clear all trails from database
    const count = await TrailService.clearAllTrails();
    
    res.json({ 
      success: true, 
      message: `Successfully cleared ${count} trails from database` 
    });
  } catch (error) {
    console.error('Error clearing trails:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear trails'
    });
  }
});

// API endpoint to delete a specific trail
app.delete('/api/trails/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await TrailService.deleteTrail(id);
    
    if (success) {
      res.json({ 
        success: true, 
        message: `Successfully deleted trail ${id}` 
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Trail ${id} not found`
      });
    }
  } catch (error) {
    console.error(`Error deleting trail ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete trail'
    });
  }
});

// API endpoint to get heatmap data
app.get('/api/heatmap', async (req, res) => {
  try {
    // Get grid size from query parameter or use default
    const gridSizeParam = req.query.gridSize;
    let gridSize = 10; // Default
    
    if (gridSizeParam) {
      const parsed = parseInt(gridSizeParam as string);
      // Make sure grid size is valid
      if (!isNaN(parsed) && parsed > 0 && parsed <= 50) {
        gridSize = parsed;
      }
    }
    
    // Generate heatmap grid
    const grid = await TrailService.generateHeatmap(gridSize);
    
    // Validate grid
    if (!grid || !Array.isArray(grid) || grid.length === 0) {
      throw new Error('Invalid grid data generated');
    }
    
    // Calculate some statistics
    let maxValue = 0;
    let totalActivity = 0;
    
    grid.forEach(row => {
      if (Array.isArray(row)) {
        row.forEach(cell => {
          const value = Number(cell) || 0;
          maxValue = Math.max(maxValue, value);
          totalActivity += value;
        });
      }
    });
    
    // Make sure we have at least some activity
    if (maxValue === 0) {
      maxValue = 1; // Prevent division by zero
    }
    
    // Return the grid and stats
    res.json({
      grid,
      gridSize,
      stats: {
        maxValue,
        totalActivity,
        bounds: { 
          x: grid[0]?.length || 0, 
          z: grid.length 
        }
      }
    });
  } catch (error) {
    console.error('Error generating heatmap:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate heatmap',
      grid: [],
      gridSize: 10,
      stats: {
        maxValue: 0,
        totalActivity: 0,
        bounds: { x: 0, z: 0 }
      }
    });
  }
});

// Trail visualization page
app.get('/trails', (req, res) => {
  const filePath = path.join(__dirname, 'html', 'trails.html');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading trails.html:', err);
      res.status(500).send('Error loading visualization page');
      return;
    }
    res.send(data);
  });
});

// Simulate slider updates from some source
setInterval(() => {
  io.emit('slider-update', sliderValue);
}, 3000);

setInterval(() => {
  io.emit('grid-update', scaledPositions);
}, 3000);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Optionally send the current value on connect
  socket.emit('slider-update', sliderValue);

  socket.emit('grid-update', scaledPositions);

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
  const sliderNum = Number(value);
  sliderValue = parseFloat(sliderNum.toFixed(2));
  io.emit('slider-update', sliderValue);
  console.log(`Updated slider to: ${sliderValue}`);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
