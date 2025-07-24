const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  roundId: String,
  startTime: Date,
  endTime: Date,
  result: Number,
  winningColor: String,
  bets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bet' }],
  profitLoss: Number,
});
module.exports = mongoose.model('Round', roundSchema);
