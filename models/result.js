const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    round: Number,
    number: Number,
    color: String,
});

module.exports = mongoose.model("Result", resultSchema);