const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});

try {
  app.use("/api/users", require("./routes/userRoutes"));
  console.log("✅ User routes loaded");
} catch (err) {
  console.error("❌ Failed to load user routes", err);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));