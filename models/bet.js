const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  user: { type: String, required: true },
  round: { type: String, required: true },
  type: { type: String, required: true }, // 'color' or 'number'
  value: { type: String, required: true }, // e.g. 'red', 'green', '5'
  amount: { type: Number, required: true },
  effectiveAmount: { type: Number },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('bet', betSchema);
