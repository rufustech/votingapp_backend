const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Models = require('../models/Models');


exports.createCheckoutSession = async (req, res) => {
  const { modelId,name,  votes, successUrl, cancelUrl } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 50, // $0.50 per vote
            product_data: {
              name: `Votes for ${name}`,
              description: `Votes Qty: ${votes}, $0.50 each`,
            },
          },
          quantity: votes,
        },
      ],
      metadata: {
        modelId: req.body.modelId,
        votes: votes.toString(),
      },
      success_url: req.body.successUrl,
      cancel_url: req.body.cancelUrl,
    });
    

    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.webhookHandler = async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const modelId = session.metadata.modelId;
    const votesToAdd = parseInt(session.metadata?.votes || "0", 10);

    if (isNaN(votesToAdd) || votesToAdd <= 0) {
  console.warn(`⚠️ Invalid vote count: "${session.metadata?.votes}"`);
  return res.status(400).json({ message: "Invalid vote count" });
}

    try {
      await Models.findByIdAndUpdate(modelId, { $inc: { votes: votesToAdd } });
      console.log(`✅ Added ${votesToAdd} votes to model ${modelId}`);
    } catch (err) {
      console.error('❌ Database update error:', err.message);
    }
  }

  res.status(200).json({ received: true });
};


