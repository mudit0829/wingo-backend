const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/bets", require("./routes/betRoutes"));
app.use("/api/rounds", require("./routes/roundRoutes"));
app.use("/api/auth", require("./routes/authRoutes")); // optional if login split out

// MongoDB connection and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // ✅ Start round scheduler ONCE after DB is ready
    const runRoundScheduler = require("./roundManager");
    runRoundScheduler();
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
  });
