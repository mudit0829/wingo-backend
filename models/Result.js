const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  roundNumber: {
    type: Number,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    enum: ["RED", "GREEN", "VIOLET"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Result", resultSchema);
