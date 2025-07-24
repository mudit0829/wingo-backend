const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  roundId: {
    type: Number,
    required: true,
    unique: true,
  },
  resultNumber: {
    type: Number,
    required: true,
  },
  resultColor: {
    type: String,
    required: true,
    enum: ['RED', 'GREEN', 'VIOLET'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Result', resultSchema);
