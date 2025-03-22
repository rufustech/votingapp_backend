const mongoose = require('mongoose');

const pageantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Upcoming', 'ongoing', 'past'], 
    default: 'upcoming' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Pageant', pageantSchema);