const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.get("/reset", async (req, res) => {
  try {
    // Clear all existing users
    await User.deleteMany({});

    // Create default admin and user accounts
    const hashedAdminPass = await bcrypt.hash("admin123", 10);
    const hashedUserPass = await bcrypt.hash("user123", 10);

    await User.create([
      { username: "admin", password: hashedAdminPass, role: "admin" },
      { username: "user", password: hashedUserPass, role: "user" },
    ]);

    res.json({ message: "✅ Admin and user accounts reset successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resetting users." });
  }
});

module.exports = router;
