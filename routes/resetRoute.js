const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const router = express.Router();

// Create test users when this route is called
router.get("/reset-test-users", async (req, res) => {
  try {
    const users = [
      {
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
        wallet: 1000,
      },
      {
        email: "test2@example.com",
        password: "123456",
        role: "user",
        wallet: 500,
      },
    ];

    for (const user of users) {
      const existing = await User.findOne({ email: user.email });
      if (!existing) {
        const hashed = await bcrypt.hash(user.password, 10);
        await User.create({ ...user, password: hashed });
        console.log(`Created: ${user.email}`);
      }
    }

    res.json({ message: "Test users created or already exist" });
  } catch (err) {
    console.error("Reset error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
