const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
  roundId: String,
  result: Number,
  winningColor: String,
  startTime: Date,
  endTime: Date,
  bets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bet" }],
  profitLoss: Number
});

module.exports = mongoose.model("Round", roundSchema);
