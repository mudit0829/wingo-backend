const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

async function seedUsers() {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany({});

  const users = [
    {
      username: "admin",
      password: await bcrypt.hash("admin123", 10),
      role: "admin"
    },
    {
      username: "user",
      password: await bcrypt.hash("user123", 10),
      role: "user"
    }
  ];

  await User.insertMany(users);
  console.log("✅ Hashed test users created");
  process.exit();
}

seedUsers().catch(err => {
  console.error("❌ Failed to seed users:", err);
  process.exit(1);
});
