const mongoose = require('mongoose');

const pageantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pageantId: { type: Number, required: true, unique: true },
  pageantSlug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Upcoming', 'ongoing', 'past'],
    default: 'Upcoming'
  }
}, { timestamps: true });

module.exports = mongoose.model('Pageant', pageantSchema);
