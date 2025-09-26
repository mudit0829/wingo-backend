const mongoose = require('mongoose');

const rechargeLogSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const RechargeLog = mongoose.models.RechargeLog || mongoose.model('RechargeLog', rechargeLogSchema);

module.exports = RechargeLog;
