const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  // Use String because your round IDs are custom like "R-20250811-133530"
  roundId: {
    type: String,
    required: true
  },
  colorBet: {
    type: String,
    enum: ['Red', 'Green', 'Violet', null],
    default: null
  },
  numberBet: {
    type: Number,
    min: 0,
    max: 9,
    default: null
  },
  amount: {                 // original bet placed
    type: Number,
    required: true
  },
  contractAmount: {         // amount minus fee (2)
    type: Number,
    required: true
  },
  netAmount: {              // profit (+) or loss (-) after result
    type: Number
  },
  win: {
    type: Boolean,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bet', betSchema);
