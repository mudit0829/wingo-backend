const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wallet: { type: Number, default: 1000 },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  salaryEarned: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);
