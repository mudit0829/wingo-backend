// scripts/fixTimestampsAndRoundIds.js

const mongoose = require("mongoose");
require("dotenv").config();
const Round = require("../models/Round");

const MONGO_URI = process.env.MONGO_URI;

async function fixRounds() {
  await mongoose.connect(MONGO_URI);

  const rounds = await Round.find().sort({ timestamp: 1 }); // Oldest to latest

  for (let i = 0; i < rounds.length; i++) {
    const round = rounds[i];
    const newTimestamp = new Date(2025, 6, 18, 17, 0, 0); // 6 = July (0-based index)
    newTimestamp.setSeconds(newTimestamp.getSeconds() + i * 30); // add 30s for each round

    round.timestamp = newTimestamp;
    round.roundId = `R${(i + 1).toString().padStart(4, "0")}`;
    await round.save();
  }

  console.log("✅ Rounds updated with timestamps and roundIds.");
  mongoose.disconnect();
}

fixRounds();
