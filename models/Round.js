const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema(
  {
    roundId: {
      type: String,
      required: true,
    },
    result: {
      type: String,
      enum: ["Red", "Green", "Violet", null],
      default: null,
    }
  },
  {
    timestamps: true // This adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Round", roundSchema);
