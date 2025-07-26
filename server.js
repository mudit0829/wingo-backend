const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// ✅ Route imports
const authRoutes = require("./routes/authRoutes");
const betRoutes = require("./routes/betRoutes");
const resultRoutes = require("./routes/resultRoutes");
const walletRoutes = require("./routes/walletRoutes");

dotenv.config();

const app = express();

// ✅ CORS (Enable all origins for now)
app.use(cors());

// ✅ Middleware
app.use(express.json());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/bet", betRoutes);
app.use("/api/result", resultRoutes);
app.use("/api/wallet", walletRoutes);

// ✅ Default route (optional)
app.get("/", (req, res) => {
  res.send("🎯 WinGo backend is live");
});

// ✅ MongoDB + Server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI || process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
