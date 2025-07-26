const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  round: String,
  type: String, // "color" or "number"
  value: String, // "RED", "GREEN", or "0"–"9"
  amount: Number,
}, { timestamps: true });

module.exports = mongoose.model("Bet", betSchema);
