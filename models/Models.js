// models/Models.js
const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  images: [{ type: String, required: true }],
  votes: { 
    type: Number, 
    default: 0,
    min: 0
  },
 pageantId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Pageant',
  required: true
},
pageantSlug: {
  type: String
}

}, { 
  timestamps: true,
  strict: true
});

module.exports = mongoose.model('Model', modelSchema);
