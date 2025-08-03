// round.js
const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  roundId: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  resultNumber: { type: Number, default: null },
  resultColor: { type: String, default: null },
  bets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bet' }],
  profitLoss: { type: Number, default: 0 },
});

module.exports = mongoose.model('Round', roundSchema);
