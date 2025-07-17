const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const betRoutes = require("./routes/betRoutes");
const roundRoutes = require("./routes/roundRoutes");
const resetRoute = require("./routes/resetRoute"); // ✅ Add this line

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bets", betRoutes);
app.use("/api/rounds", roundRoutes);
app.use("/api/reset", resetRoute); // ✅ Register reset route

// Root route
app.get("/", (req, res) => {
  res.send("🌐 WinGo backend is running.");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
