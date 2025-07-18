const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  roundId: {
    type: String,
    required: true,
    unique: true
  },
  result: {
    type: String,
    enum: ['Red', 'Green', 'Violet', null],
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Round', roundSchema);
