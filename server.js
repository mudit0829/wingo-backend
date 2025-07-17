const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const betRoutes = require("./routes/betRoutes");
const roundRoutes = require("./routes/roundRoutes");
const cronRoutes = require("./routes/cronRoutes"); // <-- Moved here, after app init

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bets", betRoutes);
app.use("/api/rounds", roundRoutes);
app.use("/api/cron", cronRoutes); // <-- Moved here, now it's safe

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB connected");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
