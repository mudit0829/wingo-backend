const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Round = require("../models/Round");
const Bet = require("../models/Bet");

// Main logic separated into a function
async function generateResult() {
  try {
    const options = ["Red", "Green", "Violet"];
    const result = options[Math.floor(Math.random() * options.length)];

    // Find last pending round
    let pendingRound = await Round.findOne({ result: null }).sort({ createdAt: -1 });

    if (!pendingRound) {
      console.log("No pending round found. Creating one.");
      pendingRound = new Round({});
      await pendingRound.save();
      return { message: "New round created, no previous round to resolve." };
    }

    pendingRound.result = result;
    await pendingRound.save();
    console.log(`✅ Result '${result}' saved to round ${pendingRound._id}`);

    const bets = await Bet.find({ roundId: pendingRound._id });

    for (const bet of bets) {
      bet.status = (bet.color === result) ? "Win" : "Lose";
      bet.profit = (bet.color === result) ? bet.amount * 2 : -bet.amount;
      await bet.save();
    }

    const nextRound = new Round({});
    await nextRound.save();
    console.log(`🔁 New round ${nextRound._id} created.`);

    return { result, roundId: pendingRound._id };
  } catch (err) {
    console.error("❌ Error in generateResult:", err);
    throw err;
  }
}

// Allow both CLI and API usage
if (require.main === module) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(async () => {
    console.log("MongoDB connected for CLI");
    await generateResult();
    process.exit();
  }).catch(err => {
    console.error("MongoDB Error:", err);
    process.exit(1);
  });
}

module.exports = { generateResult };
