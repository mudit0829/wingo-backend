const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bets", require("./routes/betRoutes"));
app.use("/api/rounds", require("./routes/roundRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () => console.log("🚀 Server started"));
    require("./roundManager")();
  })
  .catch(err => console.error("❌ MongoDB error:", err));
