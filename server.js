const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/authRoutes");
const betRoutes = require("./routes/betRoutes");
const resultRoutes = require("./routes/resultRoutes");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api", authRoutes);
app.use("/api/bets", betRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/wallet", require("./routes/walletRoutes"));

mongoose.connect("mongodb+srv://mekasutechnology:Wingo123%21@cluster0.x1btj4f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});
