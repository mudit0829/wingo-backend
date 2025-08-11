const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  email: { type: String, required: true }, // email identifies the user
  roundId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Round',
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
  amount: {                 // Original bet placed
    type: Number,
    required: true
  },
  contractAmount: {         // amount minus 2 fee
    type: Number,
    required: true
  },
  netAmount: {              // Final profit/loss after settlement
    type: Number
  },
  win: {
    type: Boolean,
    default: null            // null = pending, true = win, false = loss
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bet', betSchema);
