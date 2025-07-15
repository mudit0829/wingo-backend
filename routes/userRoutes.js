const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ✅ Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
});

// ✅ Register new user
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, role });
  await user.save();

  res.json({ message: "User registered successfully" });
});

// ✅ Login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  res.json({ message: "Login successful", role: user.role });
});

// 🧪 Optional: One-time route to create test users
router.get("/create-test-users", async (req, res) => {
  try {
    await User.deleteMany({});
    await User.insertMany([
      { username: "admin", password: await bcrypt.hash("admin123", 10), role: "admin" },
      { username: "user", password: await bcrypt.hash("user123", 10), role: "user" }
    ]);
    res.send("✅ Test users created");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error creating users");
  }
});

module.exports = router;
