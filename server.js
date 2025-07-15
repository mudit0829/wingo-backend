const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { startGameLoop } = require("./gameLoop");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bets", require("./routes/betRoutes"));

// Default route
app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      startGameLoop(); // Starts the 30s round generator
    });
  })
  .catch(err => console.error("❌ DB Connection Error:", err));
