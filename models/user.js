const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wallet: { type: Number, default: 1000 }  // ✅ Changed from 'balance' to 'wallet'
});

module.exports = mongoose.model('User', userSchema);
