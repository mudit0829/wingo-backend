const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  balance: { type: Number, default: 0 },
  winHistory: [{ roundId: String, amountWon: Number }],
});
module.exports = mongoose.model('User', userSchema);
