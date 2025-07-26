const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  round: String, // round ID or number
  type: String, // "color" or "number"
  value: String, // "RED", "GREEN", "VIOLET" or a number like "5"
  amount: Number,
}, { timestamps: true });

module.exports = mongoose.model("Bet", betSchema);
