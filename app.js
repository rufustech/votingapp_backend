const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const uploadRoutes = require("./routes/uploadRoutes");
const pageantRoutes = require('./routes/pageantRoutes');
const modelRoutes = require('./routes/modelRoutes');
const stripeRoutes = require('./routes/stripeRoutes');

const app = express();


// Increase payload size limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware
app.use(cors());
app.use(express.json());





// Health check route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Routes
app.use('/api/pageants', pageantRoutes);
app.use("/api/upload", uploadRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/stripe', stripeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;
