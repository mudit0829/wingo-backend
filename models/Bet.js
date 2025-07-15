const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
  username: String,
  color: String, // Red, Green, Violet
  amount: Number,
  roundId: String, // 🟢 This must match Round.roundId
  status: {
    type: String,
    enum: ["Win", "Lose", "Pending"],
    default: "Pending"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bet", betSchema);
