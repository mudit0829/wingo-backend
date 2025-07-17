const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const betRoutes = require("./routes/betRoutes");
const roundRoutes = require("./routes/roundRoutes");

const Round = require("./models/Round");
const Bet = require("./models/Bet");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const cronRoutes = require("./routes/cronRoutes");
app.use("/api/cron", cronRoutes);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bets", betRoutes);
app.use("/api/rounds", roundRoutes);

// Admin: Generate result for latest round
app.post("/api/admin/generate-result", async (req, res) => {
  try {
    const lastRound = await Round.findOne().sort({ startTime: -1 });

    if (!lastRound || lastRound.result) {
      return res.json({ message: "No pending round to generate result for." });
    }

    // Generate random result: Red / Green / Violet
    const resultOptions = ["Red", "Green", "Violet"];
    const result = resultOptions[Math.floor(Math.random() * resultOptions.length)];

    lastRound.result = result;
    await lastRound.save();

    // Update matching bets
    const bets = await Bet.find({ roundId: lastRound._id });
    for (const bet of bets) {
      bet.status = bet.color === result ? "Win" : "Lose";
      bet.resultColor = result;
      await bet.save();
    }

    res.json({ message: `Result '${result}' generated and applied.` });
  } catch (error) {
    console.error("Error generating result:", error);
    res.status(500).json({ message: "Server error during result generation." });
  }
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
