const mongoose = require('mongoose');

const voteTransactionSchema = new mongoose.Schema({
  modelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Model', required: true },
  votes: { type: Number, required: true },
  amount: { type: Number, required: true }, // in USD
  stripePaymentIntentId: { type: String, required: true },
  customerEmail: { type: String },
  paidAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('VoteTransaction', voteTransactionSchema);
