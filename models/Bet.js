const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
  username: { type: String, required: true },
  color: { type: String, required: true },
  roundTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bet", betSchema);
