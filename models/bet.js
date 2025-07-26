const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  round: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Round',
    required: true,
  },
  color: {
    type: String,
    enum: ['RED', 'GREEN', 'VIOLET'],
  },
  number: {
    type: Number,
    min: 0,
    max: 9,
  },
  amount: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Bet', betSchema);
