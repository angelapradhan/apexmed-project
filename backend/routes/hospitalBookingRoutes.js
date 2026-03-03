const express = require('express');
const router = express.Router();
const HospitalBooking = require('../models/hospitalBooking');

router.post('/hospital-bookings', async (req, res) => {
    try {
        const newBooking = await HospitalBooking.create(req.body);
        res.status(201).json({ success: true, data: newBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;