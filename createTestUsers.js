const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "testuser", password: "user123", role: "user" }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await User.insertMany(users);
  console.log("Test users created");
  mongoose.disconnect();
}

seed();