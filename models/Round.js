const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  roundId: Number,
  timestamp: Date,
  result: {
    type: String,
    enum: ['RED', 'GREEN', 'VIOLET'], // ✅ Add VIOLET here
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Round', roundSchema);
