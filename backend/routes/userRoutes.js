const router = require("express").Router();
const { getUserAppointments } = require('../controllers/appointmentController'); // Path check garnus
const { getAllServices } = require('../controllers/serviceController');

// function import
const { 
    addUser, 
    loginUser, 
    forgotPassword, 
    verifyOTP, 
    resetPassword 
} = require('../controllers/userController');

const authGuard = require("../helpers/authguard");
const isAdmin = require("../helpers/isAdmin");

router.post("/register", addUser);
router.post("/login", loginUser);

router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP); 
router.post('/reset-password', resetPassword);

//appointment 
router.get("/get-my-appointments", authGuard, getUserAppointments);

// user sees doctors list
router.get("/get-services", authGuard, getAllServices);

module.exports = router;