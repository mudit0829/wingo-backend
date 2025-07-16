const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// ✅ Create default admin and user
router.get("/create-default-users", async (req, res) => {
  try {
    const adminExists = await User.findOne({ username: "admin" });
    if (!adminExists) {
      await User.create({
        username: "admin",
        password: await bcrypt.hash("admin123", 10),
        role: "admin"
      });
    }

    const userExists = await User.findOne({ username: "user" });
    if (!userExists) {
      await User.create({
        username: "user",
        password: await bcrypt.hash("user123", 10),
        role: "user"
      });
    }

    res.send("✅ Default users created or already exist");
  } catch (err) {
    console.error("Error creating users:", err);
    res.status(500).send("❌ Error creating default users");
  }
});

// ✅ Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, username: user.username, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
