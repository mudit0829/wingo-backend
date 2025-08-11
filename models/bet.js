const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  email: { type: String, required: true },
  roundId: { type: String, required: true }, // custom string ID like "R-YYYYMMDD-HHMMSS"
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
  amount: { type: Number, required: true },
  contractAmount: { type: Number, required: true }, // amount - fee (2)
  netAmount: { type: Number },
  win: { type: Boolean, default: null },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bet', betSchema);
