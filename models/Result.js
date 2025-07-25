const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  roundId: {
    type: String, // ✅ Must be string, since we store it as string
    required: true,
  },
  resultNumber: {
    type: Number,
    required: true,
  },
  resultColor: {
    type: String,
    enum: ['RED', 'GREEN', 'VIOLET'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
