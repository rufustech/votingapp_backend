const express = require('express');
const cors = require('cors');
require('dotenv').config();


const stripeController = require('./controllers/stripeController');

const app = express();

// ✅ Stripe webhook must be defined BEFORE express.json()
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeController.webhookHandler);


// ✅ Parse JSON for all other routes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const uploadRoutes = require('./routes/uploadRoutes');
const pageantRoutes = require('./routes/pageantRoutes');
const modelRoutes = require('./routes/modelRoutes');
const stripeRoutes = require('./routes/stripeRoutes');

// ✅ CORS
app.use(cors({
  origin: ['http://localhost:3000', 'https://votingapp-backend-mohg.onrender.com'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));


// ✅ Routes (after JSON parser)
app.use('/api/upload', uploadRoutes);
app.use('/api/pageants', pageantRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/stripe', stripeRoutes); // only /create-checkout-session lives here

// ✅ Health check
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;