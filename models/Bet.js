const mongoose = require("mongoose");

const BetSchema = new mongoose.Schema({
  username: { type: String, required: true },
  amount: { type: Number, required: true },
  betType: { type: String, enum: ["COLOR", "NUMBER"], required: true },
  choice: { type: String, required: true }, // e.g., "RED", "5"
  roundId: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bet", BetSchema);
