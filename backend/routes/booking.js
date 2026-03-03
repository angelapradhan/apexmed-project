const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');
const HospitalBooking = require('../models/hospitalBooking');
const Hospital = require('../models/hospitalBooking');

// get all user booking
router.get('/user-bookings/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const hospitalBookings = await HospitalBooking.findAll({ where: { patientEmail: email } });
        const doctorBookings = await Appointment.findAll({ where: { patientEmail: email } });

        const combinedBookings = [
            ...hospitalBookings.map(b => ({ ...b.toJSON(), type: 'hospital' })),
            ...doctorBookings.map(b => ({ ...b.toJSON(), type: 'doctor' }))
        ];

        combinedBookings.sort((a, b) => new Date(a.date) - new Date(b.date));
        res.status(200).json({ success: true, data: combinedBookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// create booking
router.post('/bookings', async (req, res) => {
    try {
        const bookingData = req.body;
        let newBooking;
        
        if (bookingData.doctorName) {
            newBooking = new Appointment(bookingData);
        } else if (bookingData.hospitalName) {
            
            const hospital = await Hospital.findByPk(bookingData.hospitalId);
            
            bookingData.coverImage = hospital ? hospital.coverImage : 'default_hosp.jpg';
            
            newBooking = new HospitalBooking(bookingData);
        } else {
            return res.status(400).json({ success: false, message: "Invalid booking data" });
        }
        
        await newBooking.save();
        res.status(201).json({ success: true, message: "Booked successfully", data: newBooking });
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// delete
router.delete('/appointments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Appointment.destroy({ where: { id: id } });
        
        if (deleted) {
            res.status(200).json({ success: true, message: "Appointment deleted" });
        } else {
            res.status(404).json({ success: false, message: "Appointment not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.patch('/update-status/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, type } = req.body; 

        let updated;
        if (type === 'hospital') {
            [updated] = await HospitalBooking.update(
                { status: status }, 
                { where: { id: id } }
            );
        } else {

            [updated] = await Appointment.update(
                { status: status }, 
                { where: { id: id } }
            );
        }

        if (updated === 0) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.status(200).json({ success: true, message: "Status updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// delete
router.delete('/hospital-bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await HospitalBooking.destroy({ where: { id: id } });
        
        if (deleted) {
            res.status(200).json({ success: true, message: "Hospital booking deleted" });
        } else {
            res.status(404).json({ success: false, message: "Booking not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;