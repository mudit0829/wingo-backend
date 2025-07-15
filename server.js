const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

app.use(express.json());

// 🔽 TEST ROUTE
app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});

app.use("/api/users", require("./routes/userRoutes"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
