import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { config } from './env.js';
import roomsRouter from './routes/rooms.js';
import filesRouter from './routes/files.js';

const app = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api', roomsRouter);
app.use('/api', filesRouter);

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
