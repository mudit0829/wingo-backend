const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.get("/reset", async (req, res) => {
  try {
    // Delete all existing users
    await User.deleteMany({});

    // Create admin and user accounts
    const adminPass = await bcrypt.hash("admin123", 10);
    const userPass = await bcrypt.hash("user123", 10);

    await User.create([
      { username: "admin", password: adminPass, role: "admin" },
      { username: "user", password: userPass, role: "user" },
    ]);

    res.json({ message: "✅ Admin and user accounts reset successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resetting users." });
  }
});

module.exports = router;
