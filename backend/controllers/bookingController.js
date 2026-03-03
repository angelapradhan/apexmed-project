const HospitalBooking = require('../models/hospitalBooking');
const Hospital = require('../models/hospital'); 
const DoctorBooking = require('../models/appointment');
const Notification = require('../models/notification');

// Get all bookings
const getUserBookings = async (req, res) => {
  try {
    const { email } = req.params;

    // Fetch hospital data 
    const hospitalBookings = await HospitalBooking.findAll({ 
      where: { patientEmail: email },
      include: [{
        model: Hospital,
        as: 'hospitalDetails' 
      }]
    });

    const doctorBookings = await DoctorBooking.findAll({ where: { patientEmail: email } });

    // Merge hospital and doctor data
    const combinedBookings = [
      ...hospitalBookings.map(b => ({ 
        ...b.toJSON(), 
        type: 'hospital',
        coverImage: b.hospitalDetails?.coverImage,
        hospitalLogo: b.hospitalDetails?.hospitalLogo
      })),
      ...doctorBookings.map(b => ({ ...b.toJSON(), type: 'doctor' }))
    ];

    // Sort by date
    combinedBookings.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({ success: true, data: combinedBookings });
  } catch (error) {
    console.error("Fetch Bookings Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// delete
const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.query; 

        let booking;
        if (type === 'hospital') {
            booking = await HospitalBooking.findByPk(id);
        } else {
            booking = await DoctorBooking.findByPk(id);
        }

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        await booking.destroy();

        // Send notification to admin
        try {
            await Notification.create({
                userId: 'ADMIN',
                title: 'Booking Cancelled',
                message: `A ${type} booking was cancelled by user.`,
                type: 'booking'
            });
        } catch (notifErr) {
            console.error("Notification creation failed:", notifErr);
        }

        res.status(200).json({ success: true, message: "Booking deleted successfully" });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get total count of all bookings
const getBookingCount = async (req, res) => {
    try {
        const hospitalCount = await HospitalBooking.count();
        const doctorCount = await DoctorBooking.count();

        res.status(200).json({
            success: true,
            totalCount: hospitalCount + doctorCount
        });
    } catch (error) {
        console.error("Error fetching booking count:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching count"
        });
    }
};

module.exports = {
    getUserBookings,
    deleteBooking,
    getBookingCount
};