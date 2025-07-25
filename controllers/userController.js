const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const generateToken = require("../utils/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("User already exists");

  const user = await User.create({ name, email, password });
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      balance: user.balance,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).send("Invalid user data");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      balance: user.balance,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).send("Invalid email or password");
  }
});

module.exports = { registerUser, authUser };
