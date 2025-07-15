const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { startGameLoop } = require("./gameLoop");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bets", require("./routes/betRoutes"));
app.use("/api/rounds", require("./routes/roundRoutes")); // ✅ NEW

// Default route for health check
app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});

// Connect to MongoDB and start the game loop
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      startGameLoop(); // 🟢 Starts the 30-second round cycle
    });
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));
