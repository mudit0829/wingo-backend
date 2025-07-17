const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const betRoutes = require("./routes/betRoutes");
const roundRoutes = require("./routes/roundRoutes");
const cronRoutes = require("./routes/cronRoutes"); // <-- Include cronRoutes

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/bets", betRoutes);
app.use("/api/rounds", roundRoutes);
app.use("/api/cron", cronRoutes); // <-- Mount route for generating results

app.get("/", (req, res) => {
  res.send("WinGo backend is running");
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
