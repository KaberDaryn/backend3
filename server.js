require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const parkingLotsRouter = require('./routes/parkingLots');
const reservationsRouter = require('./routes/reservations');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Static files (simple interface)
app.use(express.static(path.join(__dirname, 'public')));

// Small health check
app.get('/api', (req, res) => {
  res.json({ message: 'API is working ✅' });
});

// Routes
app.use('/api/parking-lots', parkingLotsRouter);
app.use('/api/reservations', reservationsRouter);

// 404 for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler (beginner style)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

// DB connect + start server
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing. Create a .env file (see .env.example)');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`✅ Server running: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
