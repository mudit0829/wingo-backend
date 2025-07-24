const mongoose = require("mongoose");

const RoundSchema = new mongoose.Schema({
  roundId: { type: Number, required: true, unique: true },
  result: { type: String, enum: ["0","1","2","3","4","5","6","7","8","9"], default: null },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Round", RoundSchema);
