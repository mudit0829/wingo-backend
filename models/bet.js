const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
    userId: String,
    round: Number,
    betType: String,
    value: String,
    amount: Number,
});

module.exports = mongoose.model("Bet", betSchema);