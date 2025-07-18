// models/Round.js
const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
  roundId: { type: String, required: true },
  result: { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Round", roundSchema);
