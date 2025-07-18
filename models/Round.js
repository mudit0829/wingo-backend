const mongoose = require('mongoose');

const RoundSchema = new mongoose.Schema({
  roundId: { type: String, default: () => Date.now().toString() },
  result: { type: String, default: null },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Round', RoundSchema);
