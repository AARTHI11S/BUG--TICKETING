const express = require('express');
const User = require('../models/User'); // Make sure the path to your User model is correct
const router = express.Router();

// @route   GET /api/users/developers
// @desc    Get all developers
// @access  Private (Assuming you have some kind of auth middleware)
router.get('/developers', async (req, res) => {
    try {
        const developers = await User.find({ role: 'developer' });
        res.json(developers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// @route   GET /api/users/admins
// @desc    Get all admins
// @access  Private (Assuming you have some kind of auth middleware)
router.get('/admins', async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' });
        res.json(admins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
