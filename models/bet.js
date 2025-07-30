const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  roundId: {
    type: String,
    required: true
  },
  colorBet: {
    type: String,
    enum: ['Red', 'Green', 'Violet', null],
    default: null
  },
  numberBet: {
    type: Number,
    min: 0,
    max: 9,
    default: null
  },
  amount: {
    type: Number,
    required: true
  },
  netAmount: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bet', betSchema);
