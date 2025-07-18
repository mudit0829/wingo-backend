// fixTimestamps.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Round = require("./models/Round");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log("Connected to MongoDB. Fixing timestamps...");

  const rounds = await Round.find({ timestamp: { $in: [null, undefined] } });

  for (let round of rounds) {
    round.timestamp = new Date(); // Or set manually
    await round.save();
    console.log(`Fixed round ${round.roundId}`);
  }

  console.log("✅ All null timestamps fixed.");
  process.exit();
}).catch(err => {
  console.error("MongoDB connection failed:", err);
});
