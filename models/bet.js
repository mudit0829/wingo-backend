const mongoose = require("mongoose");

const betSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    round: { type: mongoose.Schema.Types.ObjectId, ref: "Round", required: true },
    type: { type: String, enum: ["color", "number"], required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true }, // can be string or number
    amount: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bet", betSchema);
