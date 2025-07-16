const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

dotenv.config();

async function seedUsers() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({}); // Clear all users (optional)

  const users = [
    { username: "admin", password: await bcrypt.hash("admin123", 10), role: "admin" },
    { username: "user", password: await bcrypt.hash("user123", 10), role: "user" },
  ];

  await User.insertMany(users);
  console.log("Users created successfully!");
  process.exit();
}

seedUsers();
