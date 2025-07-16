// routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    res.json({
      message: "Login successful",
      username: user.username,
      role: user.role
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
