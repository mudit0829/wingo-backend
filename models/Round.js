const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  roundId: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  result: {
    type: String,
    enum: ['RED', 'GREEN', 'VIOLET'], // ✅ Fixed: Added VIOLET
    default: null,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Round', roundSchema);
