const express = require('express');
const { initiatePayment, pollPaymentStatus } = require('../controllers//paynowController');

const router = express.Router();

router.post('/initiate', initiatePayment);
router.get('/poll/:ref', pollPaymentStatus);

module.exports = router;

