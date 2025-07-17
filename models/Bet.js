const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
  username: { type: String, required: true },
  amount: { type: Number, required: true },
  color: { type: String, required: true },
  roundId: { type: mongoose.Schema.Types.ObjectId, ref: "Round" },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" }, // "Win", "Lose", "Pending"
  resultColor: { type: String, default: "" }     // Result of the round
});

module.exports = mongoose.model("Bet", betSchema);
