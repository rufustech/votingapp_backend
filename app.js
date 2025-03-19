const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const pageantRoutes = require('./routes/pageantRoutes');
const modelRoutes = require('./routes/modelRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Routes
app.use('/api/pageants', pageantRoutes);
app.use('/api/models', modelRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;
