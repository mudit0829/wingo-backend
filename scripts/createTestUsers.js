const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

async function createTestUsers() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await User.insertMany([
    { username: "admin", password: "admin123", role: "admin" },
    { username: "user", password: "user123", role: "user" }
  ]);
  await mongoose.disconnect();
}

module.exports = createTestUsers;
