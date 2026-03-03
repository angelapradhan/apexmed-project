const Appointment = require("../models/appointment");
const HospitalBooking = require('../models/hospitalBooking');

// Create doctor appointment
const createAppointment = async (req, res) => {
    try {
        const { userId, doctorName, specialization, date, time } = req.body;
        const newAppointment = await Appointment.create({
            userId, doctorName, specialization, date, time
        });
        res.status(201).json({ success: true, message: "Appointment Scheduled!", appointment: newAppointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all bookings 
const getAllAppointments = async (req, res) => {
    try {
        const doctorBookings = await Appointment.findAll();
        const hospitalBookings = await HospitalBooking.findAll();

        // Format hospital data to match
        const formattedHospitalBookings = hospitalBookings.map(booking => ({
            id: booking.id, 
            patientName: booking.patientName,
            doctorName: booking.hospitalName, 
            specialization: 'Hospital Booking', 
            date: booking.date,
            time: booking.time || 'N/A',
            status: booking.status || 'Pending',
            type: 'hospital' 
        }));

        // Merge and sort by date
        const allAppointments = [
            ...doctorBookings.map(b => ({ ...b.toJSON(), type: 'doctor' })), 
            ...formattedHospitalBookings
        ];

        allAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json({ 
            success: true, 
            appointments: allAppointments,
            count: allAppointments.length 
        });
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get appointments 
const getUserAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({ where: { userId: req.user.id } });
        res.status(200).json({ success: true, appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update status by type
const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, type } = req.body;

        if (type === 'hospital') {
            await HospitalBooking.update({ status: status }, { where: { id: id } });
        } else {
            await Appointment.update({ status: status }, { where: { id: id } });
        }

        res.status(200).json({ success: true, message: "Status updated successfully" });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { 
    createAppointment, 
    getUserAppointments, 
    getAllAppointments,
    updateAppointmentStatus
};