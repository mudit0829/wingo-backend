const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // ✅ Added CORS
require("dotenv").config();

const app = express();

app.use(cors()); // ✅ Enable CORS for frontend access
app.use(express.json());

app.use("/api/users", require("./routes/userRoutes"));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB connected");
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.error("MongoDB connection error:", err));
