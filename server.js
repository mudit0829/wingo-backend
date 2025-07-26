const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const betRoutes = require("./routes/betRoutes");
const resultRoutes = require("./routes/resultRoutes");
const walletRoutes = require("./routes/walletRoutes");

dotenv.config(); // ✅ Loads variables from .env

const app = express();

// ✅ Middleware
app.use(cors()); // Allow all origins for development
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/bet", betRoutes);
app.use("/api/result", resultRoutes);
app.use("/api/wallet", walletRoutes);

// ✅ Start MongoDB & Server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in environment variables.");
  process.exit(1); // Stop the app
}

mongoose
  .connect(MONGO_URI, {
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
