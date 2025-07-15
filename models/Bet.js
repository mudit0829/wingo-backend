const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
  username: String,
  color: String, // Red / Green / Violet
  amount: Number,
  roundId: String,
  roundTime: Date,
  status: { type: String, default: "Pending" }, // Won / Lost / Pending
  resultColor: String
}, { timestamps: true });

module.exports = mongoose.model("Bet", betSchema);
