const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.get("/api/health", (req, res) => res.send("pong"));

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
