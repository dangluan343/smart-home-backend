// deviceId
// keyFeed
// roomId
// userId

const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Activity = require("../models/Activity");
const Room = require("../models/Room");
const User = require("../models/User");

// GET api/activities
router.get("", (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.body.userId);
    // const activities = await Activity.find({ userId });

    Activity.find({ userId })
      .populate("userId")
      .exec(function (err, result) {
        if (err) return res.status(400).json({ success: false, err: err });

        res.status(200).json({ success: true, result });
      });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// GET api/activities/DevicesInRoomByUser
router.post("/DevicesInRoomByUser", (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.body.userId);
    Activity.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $group: {
          _id: "$roomId",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "rooms",
          localField: "_id",
          foreignField: "_id",
          as: "room",
        },
      },
    ]).exec(function (err, result) {
      if (err)
        return res.status(400).json({ success: false, err: err.message });
      res.status(200).json({ success: true, data: result });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// GET api/activities/DevicesInRoomByUser
router.post("/DevicesByUser", (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.body.userId);
    Activity.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $group: {
          _id: "$deviceId",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "devices",
          localField: "_id",
          foreignField: "_id",
          as: "device",
        },
      },
    ]).exec(function (err, result) {
      if (err)
        return res.status(400).json({ success: false, err: err.message });
      res.status(200).json({ success: true, data: result });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// GET api/activities/DeviceByRoom
router.get("/DeviceByRoom/:userId/:room", (req, res) => {
  const room = req.params.room;
  // console.log(room);
  try {
    Room.findOne({ name: room }).exec(function (err, result) {
      if (err)
        return res.status(400).json({ success: false, err: err.message });
      const userId = new mongoose.Types.ObjectId(req.params.userId);
      Activity.aggregate([
        {
          $match: {
            userId: userId,
            roomId: result._id,
          },
        },
        {
          $lookup: {
            from: "devices",
            localField: "deviceId",
            foreignField: "_id",
            as: "device",
          },
        },
      ])
        // .project("keyFeed deviceId -_id")
        .exec(function (err, result) {
          if (err)
            return res.status(400).json({ success: false, err: err.message });
          res.status(200).json({ success: true, data: result });
        });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST api/activities
router.post("", (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.body.userId);
  const deviceId = new mongoose.Types.ObjectId(req.body.deviceId);
  const roomId = new mongoose.Types.ObjectId(req.body.roomId);

  const { keyFeed } = req.body;
  if (!keyFeed || !userId || !roomId) {
    return res.status(400).json({
      success: false,
      message: "keyfeed, user and room are required",
    });
  }

  try {
    const newActivity = new Activity({
      deviceId,
      keyFeed,
      roomId,
      userId,
    });

    newActivity.save();
    res.status(200).json({
      success: true,
      message: "created new activity",
      activity: newActivity,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST api/activities
router.get("/countAllDevice/:username", (req, res) => {
  const username = req.params.username;
  if (!username) {
    return res.status(400).json({
      success: false,
      message: "user is required",
    });
  }

  try {
    User.findOne({ username: username }).exec((error, result) => {
      if (error)
        return res
          .status(400)
          .json({ success: false, message: "User not found" });
      Activity.aggregate([
        {
          $match: {
            userId: result._id,
          },
        },
      ])
        .count("keyFeed")
        .exec(function (err, activity) {
          console.log(activity);
          return res
            .status(200)
            .json({ success: true, data: activity[0].keyFeed });
        });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// PUT api/activities
router.post("/:keyFeed", async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.body.userId);
  const deviceId = new mongoose.Types.ObjectId(req.body.deviceId);
  const roomId = new mongoose.Types.ObjectId(req.body.roomId);
  const onValue = req.body.onValue;
  const offValue = req.body.offValue;

  const keyFeed = req.params.keyFeed;
  if (!keyFeed || !userId || !roomId) {
    return res.status(400).json({
      success: false,
      message: "keyfeed, user and room are required",
    });
  }

  try {
    let updatedActivityInfo = {
      deviceId,
      keyFeed,
      onValue,
      offValue,
      roomId,
      userId,
    };

    updatedActivity = await Activity.findOneAndUpdate(
      {
        keyFeed: keyFeed,
      },
      updatedActivityInfo
    );
    res.json({ success: true, message: "Activity updated", updatedActivity });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// PUT api/activities
router.put("/:keyFeed", async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.body.userId);
  const deviceId = new mongoose.Types.ObjectId(req.body.deviceId);
  const roomId = new mongoose.Types.ObjectId(req.body.roomId);
  const onValue = req.body.onValue;
  const offValue = req.body.offValue;

  const keyFeed = req.params.keyFeed;
  if (!keyFeed || !userId || !roomId) {
    return res.status(400).json({
      success: false,
      message: "keyfeed, user and room are required",
    });
  }

  try {
    let updatedActivityInfo = {
      deviceId,
      keyFeed,
      onValue,
      offValue,
      roomId,
      userId,
    };

    updatedActivity = await Activity.findOneAndUpdate(
      {
        keyFeed: keyFeed,
      },
      updatedActivityInfo
    );
    res.json({ success: true, message: "Activity updated", updatedActivity });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// DELETE api/activities
router.delete("/:keyFeed", async (req, res) => {
  try {
    const keyFeed = req.params.keyFeed;

    const deletedActivity = await Activity.findOneAndDelete({
      keyFeed: keyFeed,
    });

    if (!deletedActivity)
      return res.status(401).json({
        success: false,
        message: "Activity not found",
      });

    res.json({ success: true, deleteActivity: deletedActivity });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
