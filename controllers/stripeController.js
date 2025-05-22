const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
stripe.apiVersion = '2025-04-30';

const { incrementModelVotes } = require('../utils/voting');

// Create Checkout Session
exports.createCheckoutSession = async (req, res) => {
  const { modelId, name, votes, amount, cancelUrl } = req.body;

  console.log('🟡 Creating checkout session with:', { modelId, name, votes, amount });

  if (!modelId || !name || !votes || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

try {
  // ✅ Create Stripe product
  const product = await stripe.products.create({
    name: `Votes for ${name}`,
  });

  // ✅ Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    locale: 'en',
    metadata: {
      modelId,
      votes: votes.toString(),
    },
    payment_intent_data: {
      metadata: {
        modelId,
        votes: votes.toString(),
      },
    },
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(amount * 100),
          product: product.id, // ✅ This now works
        },
        quantity: 1,
      },
    ],
    // success_url: `http://localhost:3000/ranking?payment_success=true&modelId=${modelId}&votes=${votes}`,
    // cancel_url: cancelUrl || 'http://localhost:3000/vote-cancel',
      success_url: `https://votes.co.zw/ranking?payment_success=true&modelId=${modelId}&votes=${votes}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || 'https://votes.co.zw/vote-cancel',

  });

  
    console.log('✅ Session created with metadata:', session.metadata);
    console.log('✅ Payment Intent Data:', session.payment_intent_data);
    console.log('✅ Product created:', product.id);

  
    res.status(200).json({ 
      id: session.id,
      url: session.url 
    });
  // res.status(200).json({ url: session.url }); // ✅ return the checkout URL


} catch (error) {
  console.error('❌ Error creating checkout session:', error.message);
  res.status(500).json({ error: error.message });
}
}


// Webhook Handler
exports.webhookHandler = async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log("📨 Stripe Event Type:", event.type);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  const paymentIntentId = session.payment_intent;

  if (!paymentIntentId) {
    console.warn("⚠️ No payment_intent found in session");
     return res.status(400).json({ error: "No payment intent found" });
   
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const metadata = paymentIntent.metadata;

    const modelId = metadata.modelId;
    const votesToAdd = parseInt(metadata.votes || "0", 10);

    if (!modelId || isNaN(votesToAdd) || votesToAdd <= 0) {
      console.warn("⚠️ Invalid or missing modelId/votes in PaymentIntent metadata");
      return;
    }

    const updatedModel = await Model.findByIdAndUpdate(
      modelId,
      { $inc: { votes: votesToAdd } },
      { new: true }
    );

    if (!updatedModel) {
      console.error(`❌ Model not found: ${modelId}`);
    } else {
      console.log(`✅ Added ${votesToAdd} votes to model "${updatedModel.name}"`);
    }
  } catch (err) {
    console.error("❌ Failed to retrieve PaymentIntent or update model:", err.message);
  }
}


  res.status(200).json({ received: true });
};

