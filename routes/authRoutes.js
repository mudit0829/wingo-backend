const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials (user not found)" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials (wrong password)" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      username: user.username,
      role: user.role,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// GET /api/auth/create-default-users
router.get("/create-default-users", async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ username: "admin" });
    const existingUser = await User.findOne({ username: "user" });

    if (!existingAdmin) {
      const hashedAdmin = await bcrypt.hash("admin123", 10);
      await new User({ username: "admin", password: hashedAdmin, role: "admin" }).save();
    }

    if (!existingUser) {
      const hashedUser = await bcrypt.hash("user123", 10);
      await new User({ username: "user", password: hashedUser, role: "user" }).save();
    }

    res.send("✅ Default users created or already exist");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error creating default users");
  }
});

module.exports = router;
