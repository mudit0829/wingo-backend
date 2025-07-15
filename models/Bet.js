const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
  username: String,
  color: String, // Red, Green, Violet
  amount: Number,
  roundId: String, // 🆕 To associate bet with a game round
  createdAt: { type: Date, default: Date.now } // 🆕 Optional timestamp
});

module.exports = mongoose.model("Bet", betSchema);
