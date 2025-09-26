const mongoose = require('mongoose');

const redeemLogSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const RedeemLog = mongoose.models.RedeemLog || mongoose.model('RedeemLog', redeemLogSchema);

module.exports = RedeemLog;
