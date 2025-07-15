const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
  roundId: String,
  startTime: Date,
  endTime: Date,
  result: { type: String, default: null } // "Red", "Green", or "Violet"
});

module.exports = mongoose.model("Round", roundSchema);
