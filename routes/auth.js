const express = require("express");
require("dotenv").config();

const router = express.Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { name, username, password, gmail, ada } = req.body; //
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "missing username or password" });
  }

  try {
    const user = await User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "username already in use" });
    }

    const newUser = new User({ name, username, password, gmail });
    await newUser.save();

    res.json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (err) {
    console.log({ error: err });
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Route: POST api/auth/login
// Desc: login user
// Access: public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ success: false, message: "incorrect username" });
    }
    const passwordValid = user.password === password ? true : false;
    if (!passwordValid) {
      return res.json({ success: false, message: "incorrect password" });
    }

    res.json({
      success: true,
      message: "User logged in successfully",
      user: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Desc: login user
// Access: public
router.post("/login/:username", async (req, res) => {
  const username = req.params.username;
  const { password, adaUsername, adaPassword } = req.body;

  try {
    let updatedUserInfo = {
      username,
      password,
      adaUsername,
      adaPassword,
    };
    const updatedUser = await User.findOneAndUpdate(
      { username },
      updatedUserInfo
    );

    res.json({
      success: true,
      message: "User updated in successfully",
      updatedUser: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
