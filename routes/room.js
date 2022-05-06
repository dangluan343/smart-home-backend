const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Room = require("../models/Room");

// @route POST api/devices
// @desc Create device
// @access Private
router.post("", async (req, res) => {
  const { name } = req.body;

  try {
    const newRoom = new Room({
      name,
    });
    console.log(1);

    newRoom.save();
    res.status(200).json({
      success: true,
      message: "created new room",
      room: newRoom,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
