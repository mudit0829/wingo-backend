const express = require("express");
const mongoose = require("mongoose");
const betRoutes = require("./routes/betRoutes");
const cronRoutes = require("./routes/cronRoutes");
const resetRoute = require("./routes/resetRoute");
const { startLoop } = require("./utils/roundManager");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/wingo", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    startLoop(); // start the automatic round cycle
  });

app.use(betRoutes);
app.use(cronRoutes);
app.use(resetRoute);

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
