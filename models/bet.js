// models/bet.js
const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  email: { type: String, required: true },
  gameType: { // ✅ NEW field to know which game mode this bet is for
    type: String, 
    required: true,
    enum: ['WIN30', 'WIN1', 'WIN3', 'WIN5']
  },
  roundId: { type: String, required: true },
  colorBet: { type: String, enum: ['Red', 'Green', 'Violet', null], default: null },
  numberBet: { type: Number, min: 0, max: 9, default: null },
  bigSmallBet: { type: String, enum: ['Big', 'Small', null], default: null },
  amount: { type: Number, required: true },
  contractAmount: { type: Number, required: true },
  netAmount: { type: Number },
  win: { type: Boolean, default: null },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bet', betSchema);
