// models/Bet.js
const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
  username: String,
  color: String,
  amount: Number,
  roundId: String,
  status: { type: String, default: "Pending" }, // Won / Lost / Pending
  resultColor: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Bet", betSchema);
