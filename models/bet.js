const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  user: {                                         // <- reference to the User
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: { type: String, required: true },        // store email for easy search
  roundId: {                                      // <- ref to Round
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Round',
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
  amount: {                 // bet placed
    type: Number,
    required: true
  },
  contractAmount: {         // bet minus fee (amount - 2)
    type: Number,
    required: true
  },
  netAmount: {               // final net result after settlement
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
