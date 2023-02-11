'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/User');


// Routes
router.get('/', (req, res) => {
    res.send('OK');
});

router.post('/:userId/register-device', async (req, res) => {
    const user = new User({
        userId: req.params.userId,
        deviceId: req.body.deviceId
    });
    try {
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;