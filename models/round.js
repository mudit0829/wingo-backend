// models/round.js
const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  gameType: { 
    type: String, 
    required: true, 
    enum: ['WIN30', 'WIN1', 'WIN3', 'WIN5'] // ✅ supported game variants
  },
  roundId: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  resultNumber: { type: Number, default: null },
  resultColor: { type: String, default: null },
  bets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bet' }],
  profitLoss: { type: Number, default: 0 },
});

module.exports = mongoose.model('Round', roundSchema);
