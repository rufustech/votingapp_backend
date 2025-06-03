const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');

router.post('/create-checkout-session', stripeController.createCheckoutSession);

// Stripe Webhook (must use raw parser)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeController.webhookHandler);

module.exports = router;
