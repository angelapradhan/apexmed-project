const Appointment = require("../models/appointment");
const HospitalBooking = require('../models/hospitalBooking');

// 1. Admin logic: Appointment create garne
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

// const getAllAppointments = async (req, res) => {
//     try {
//         const appointments = await Appointment.findAll(); 
//         res.status(200).json({ success: true, appointments });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };
// 🌟 FIX 2: Updated to fetch both Doctor and Hospital bookings 🌟
const getAllAppointments = async (req, res) => {
    try {
        // 1. Fetch ALL Doctor Bookings
        const doctorBookings = await Appointment.findAll();

        // 2. Fetch ALL Hospital Bookings
        const hospitalBookings = await HospitalBooking.findAll();

        // 3. Map hospital bookings to match the doctor booking structure
        const formattedHospitalBookings = hospitalBookings.map(booking => ({
            id: booking.id, 
            patientName: booking.patientName,
            // 🌟 Map necessary fields 🌟
            doctorName: booking.hospitalName, 
            specialization: 'Hospital Booking', 
            date: booking.date,
            time: booking.time || 'N/A',
            status: booking.status || 'Pending',
            type: 'hospital' // 🌟 Add type for identification 🌟
        }));

        // 4. Merge them
        // 🌟 FIX: Add .toJSON() if needed 🌟
        const allAppointments = [
            ...doctorBookings.map(b => ({ ...b.toJSON(), type: 'doctor' })), 
            ...formattedHospitalBookings
        ];

        // 5. Sort by date
        allAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json({ 
            success: true, 
            appointments: allAppointments,
            count: allAppointments.length // 🌟 Total count includes both 🌟
        });
    } catch (error) {
        // 🌟 FIX: Check console for exact error 🌟
        console.error("Error fetching appointments:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. User logic: Aafno matra appointment herne
const getUserAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({ where: { userId: req.user.id } });
        res.status(200).json({ success: true, appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createAppointment, getUserAppointments , getAllAppointments};