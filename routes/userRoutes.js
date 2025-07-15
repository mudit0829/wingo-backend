const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ✅ Get all users (for testing)
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// ✅ Create test users (manual trigger if needed)
router.get("/create-test-users", async (req, res) => {
  try {
    const hashedAdmin = await bcrypt.hash("admin", 10);
    const hashedUser = await bcrypt.hash("user", 10);

    await User.deleteMany(); // Clear old users

    await User.create([
      { username: "admin", password: hashedAdmin, role: "admin" },
      { username: "user", password: hashedUser, role: "user" }
    ]);

    res.send("✅ Test users created with correct passwords.");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Failed to create test users.");
  }
});

// ✅ Reset and rehash users (use this if login keeps failing)
router.get("/reset-passwords", async (req, res) => {
  try {
    const hashedAdmin = await bcrypt.hash("admin", 10);
    const hashedUser = await bcrypt.hash("user", 10);

    await User.deleteMany();

    await User.create([
      { username: "admin", password: hashedAdmin, role: "admin" },
      { username: "user", password: hashedUser, role: "user" }
    ]);

    res.send("✅ Users reset with correct hashed passwords.");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Failed to reset users.");
  }
});

module.exports = router;
