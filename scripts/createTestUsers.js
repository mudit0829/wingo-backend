const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await User.deleteMany({});
  await User.insertMany([
    { username: "admin", password: "admin123", role: "admin" },
    { username: "user", password: "user123", role: "user" }
  ]);
  console.log("✅ Test users created");
  process.exit();
}).catch(err => console.error(err));