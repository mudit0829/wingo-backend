const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Clear existing users
    await User.deleteMany({});

    // Create new admin and user
    const adminPassword = await bcrypt.hash("admin123", 10);
    const userPassword = await bcrypt.hash("user123", 10);

    const users = [
      { username: "admin", password: adminPassword, role: "admin" },
      { username: "user", password: userPassword, role: "user" },
    ];

    await User.insertMany(users);
    console.log("✅ Admin and User created with hashed passwords.");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
