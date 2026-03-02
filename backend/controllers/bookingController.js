const HospitalBooking = require('../models/hospitalBooking');
const Hospital = require('../models/hospital');
const DoctorBooking = require('../models/appointment'); // Assuming this is your doctor booking model

exports.getUserBookings = async (req, res) => {
  try {
    const { email } = req.params;

    // Fetch both types of bookings
    // Yadi timle HospitalBooking model update gareko chau bhane, 
    // Sequelize le coverImage automatically fetch garchha.
    const hospitalBookings = await HospitalBooking.findAll({ where: { patientEmail: email } });
    const doctorBookings = await DoctorBooking.findAll({ where: { patientEmail: email } });

    // Combine them and add a 'type' field to distinguish them
    const combinedBookings = [
      ...hospitalBookings.map(b => ({ ...b.toJSON(), type: 'hospital' })),
      ...doctorBookings.map(b => ({ ...b.toJSON(), type: 'doctor' }))
    ];

    // Sort by date
    combinedBookings.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({ success: true, data: combinedBookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};