const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const betRoutes = require("./routes/betRoutes");
const resultRoutes = require("./routes/resultRoutes");

dotenv.config();

const app = express();

// ✅ CORS FIX HERE
app.use(cors({
  origin: '*', // You can also restrict to specific frontend domain if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

// Routes
app.use("/api", authRoutes);
app.use("/api", betRoutes);
app.use("/api", resultRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'wingo'
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("DB connection error:", err));
