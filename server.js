const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const betRoutes = require("./routes/betRoutes");
const resultRoutes = require("./routes/resultRoutes");
const walletRoutes = require("./routes/walletRoutes");

dotenv.config();

const app = express();

// ✅ Enable CORS for all domains (safe for public testing)
app.use(cors());

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/bet", betRoutes);
app.use("/api/result", resultRoutes);
app.use("/api/wallet", walletRoutes);

// ✅ MongoDB + Server Start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL, {
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
