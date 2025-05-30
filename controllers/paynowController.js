// controllers/paynowController.js
const mockPayments = [];

const initiatePayment = (req, res) => {
  const { modelId, amount, userEmail } = req.body;

  const mockRef = 'MOCK-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  const pollUrl = `/api/paynow/poll/${mockRef}`;
  const redirectUrl = `https://mockpaynow.co.zw/pay/${mockRef}`; // Simulated

  mockPayments.push({
    reference: mockRef,
    modelId,
    amount,
    userEmail,
    status: 'pending'
  });

  res.json({ redirectUrl, pollUrl, reference: mockRef });
};

const pollPaymentStatus = (req, res) => {
  const { ref } = req.params;
  const payment = mockPayments.find(p => p.reference === ref);

  if (!payment) return res.status(404).json({ error: 'Transaction not found' });

  // Simulate payment being completed
  payment.status = 'paid';

  res.json({
    paid: true,
    modelId: payment.modelId,
    amount: payment.amount,
    votes: payment.amount * 2,
    message: 'Payment successful'
  });
};

module.exports = { initiatePayment, pollPaymentStatus };
