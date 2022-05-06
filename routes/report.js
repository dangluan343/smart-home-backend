const express = require("express");

const router = express.Router();

const Device = require("../models/Device");
const User = require("../models/User");
const Report = require("../models/Report");

// @route GET api/devices
// @desc Get devices
// @access Private
router.get("/", async (req, res) => {
  try {
    const devices = await Device.find({
      username: req.body.username,
      keyFeed: req.body.keyFeed,
    });
    res.status(200).json({ success: true, devices });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/devices
// @desc Create device
// @access Private
router.post("", async (req, res) => {
  const { keyFeed, id, deviceType, status, value, room, username } = req.body;
  if (!keyFeed || !id || !username) {
    return res.status(400).json({
      success: false,
      message: "keyfeed, id and username are required",
    });
  }

  try {
    const user = User.find({ username });
    user.exec(function (err, curUser) {
      const newDevice = new Device({
        keyFeed,
        id,
        deviceType,
        status,
        value,
        room,
        username: curUser[0].username,
      });
      newDevice.save();
      res.status(200).json({
        success: true,
        message: "created new device",
        device: newDevice,
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route PUT api/devices
// @desc Update device
// @access Private
router.put("/:keyFeed", async (req, res) => {
  const { keyFeed, id, deviceType, status, value, room, username } = req.body;
  if (!keyFeed || !id || !username) {
    return res.status(400).json({
      success: false,
      message: "keyfeed, id and username are required",
    });
  }
  try {
    let updatedDeviceInfo = {
      keyFeed,
      id,
      deviceType,
      status,
      value,
      room,
      username,
    };

    updatedDevice = await Device.findOneAndUpdate(
      {
        keyFeed: keyFeed,
        username: username,
      },
      updatedDeviceInfo
    );
    res.json({ success: true, message: "device updated", updatedDevice });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route DELETE api/devices
// @desc Delete device
// @access Private

router.delete("/:keyFeed", async (req, res) => {
  try {
    console.log(req.body);
    const deletedDevice = await Device.findOneAndDelete({
      keyFeed: req.body.keyFeed,
      username: req.body.username,
    });

    // User not authorised or post not found
    if (!deletedDevice)
      return res.status(401).json({
        success: false,
        message: "Device not found",
      });

    res.json({ success: true, post: deletedDevice });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
