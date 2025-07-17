const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
  result: {
    type: String,
    enum: ["Red", "Green", "Violet"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Format timestamp as DD/MM/YYYY HH:MM:SS when sending JSON
roundSchema.set("toJSON", {
  transform: (doc, ret) => {
    const date = new Date(ret.timestamp);
    const pad = (n) => (n < 10 ? "0" + n : n);
    ret.timestamp = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    return ret;
  },
});

module.exports = mongoose.model("Round", roundSchema);
