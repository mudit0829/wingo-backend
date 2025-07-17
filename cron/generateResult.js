const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Round = require("../models/Round");
const Bet = require("../models/Bet");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected for result generation");
  generateResult();
}).catch(err => console.error("MongoDB Error:", err));

async function generateResult() {
  try {
    // Step 1: Generate a new random result
    const options = ["Red", "Green", "Violet"];
    const result = options[Math.floor(Math.random() * options.length)];

    // Step 2: Update the last created round (the pending one)
    const pendingRound = await Round.findOne({ result: null }).sort({ createdAt: -1 });

    if (!pendingRound) {
      console.log("No pending round found. Creating one.");
      const newRound = new Round({});
      await newRound.save();
      return process.exit();
    }

    pendingRound.result = result;
    await pendingRound.save();
    console.log(`Result '${result}' saved to round ${pendingRound._id}`);

    // Step 3: Calculate outcome for bets
    const bets = await Bet.find({ roundId: pendingRound._id });

    for (const bet of bets) {
      bet.status = (bet.color === result) ? "Win" : "Lose";
      bet.profit = (bet.color === result) ? bet.amount * 2 : -bet.amount;
      await bet.save();
    }

    // Step 4: Create new next round
    const nextRound = new Round({});
    await nextRound.save();
    console.log(`New round ${nextRound._id} created.`);

    process.exit();
  } catch (err) {
    console.error("Error generating result:", err);
    process.exit(1);
  }
}
