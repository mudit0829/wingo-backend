const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  roundId: String,
  type: { type: String, enum: ["color", "number"] },
  value: String,
  amount: Number,
  serviceFee: Number,
  status: { type: String, enum: ["PENDING", "WIN", "LOSE"], default: "PENDING" },
  winnings: { type: Number, default: 0 }
});

module.exports = mongoose.model("Bet", betSchema);
