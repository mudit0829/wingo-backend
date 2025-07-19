const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  roundId: {
    type: Number,
    required: true,
    unique: true,
  },
  result: {
    type: String,
    enum: ['Red', 'Green', 'Violet', null],
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Round', roundSchema);
