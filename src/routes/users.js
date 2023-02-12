"use strict";
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Routes
router.get("/:userId", async (req, res) => {
  const isActive = req.query.isActive;
  if (isActive === "true") {
    const activeDevices = await User.find({
      userId: req.params.userId,
      isActive: true,
    });
    res.status(200).json(activeDevices);
  } else if (isActive === "false") {
    const inactiveDevices = await User.find({
      userId: req.params.userId,
      isActive: false,
    });
    res.status(200).json(inactiveDevices);
  } else {
    const allUsers = await User.find({ userId: req.params.userId });
    res.status(200).json(allUsers);
  }
});

router.post("/:userId/register-device", async (req, res) => {
  const countActiveDevices = await User.countDocuments({
    userId: req.params.userId,
    isActive: true,
  });
  if (countActiveDevices >= 3) {
    res.status(400).json({ message: "Maximum number of devices reached" });
  } else {
    const filter = { userId: req.params.userId, deviceId: req.body.deviceId };
    const update = { isActive: true };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    User.findOneAndUpdate(filter, update, options, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  }
});

router.post("/:userId/unregister-device", async (req, res) => {
  const filter = { userId: req.params.userId, deviceId: req.body.deviceId };
  const update = { isActive: false };
  const options = { upsert: false, new: true, setDefaultsOnInsert: true };
  User.findOneAndUpdate(filter, update, options, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      if (result === null) {
        res.status(404).json({ message: "Device not found" });
      } else {
        res.status(200).json(result);
      }
    }
  });
});

router.post("/:userId/unregister-all-devices", async (req, res) => {
  const filter = { userId: req.params.userId };
  const update = { isActive: false };
  const options = { upsert: false, new: true, setDefaultsOnInsert: true };
  User.updateMany(filter, update, options, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      if (result === null) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.status(200).json(result);
      }
    }
  });
});

router.get("/:userId/:deviceId", async (req, res) => {
  const userDevice = await User.findOne({
    userId: req.params.userId,
    deviceId: req.params.deviceId,
  });
  if (userDevice === null) {
    res.status(404).json({ message: "Device not found" });
  } else {
    res.status(200).json(userDevice);
  }
});

module.exports = router;
