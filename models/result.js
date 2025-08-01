// models/result.js
const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  roundId: String,
  number: Number,
  color: String,
  timestamp: Date
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
