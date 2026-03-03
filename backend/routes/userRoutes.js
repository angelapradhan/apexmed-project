const router = require("express").Router();
const multer = require('multer');
const path = require('path');
const authGuard = require("../helpers/authguard"); 
const isAdmin = require("../helpers/isAdmin"); 

// Controllers Import
const { getUserAppointments } = require('../controllers/appointmentController');
const { getAllServices } = require('../controllers/serviceController');
const { 
    addUser, 
    loginUser, 
    forgotPassword, 
    verifyOTP, 
    resetPassword,
    toggleFavorite,
    getMyFavorites,
    checkFavoriteStatus,
    uploadProfilePicture,
    updateProfile,
    changePassword
} = require('../controllers/userController');

// multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `user-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// public routes
router.post("/register", addUser);
router.post("/login", loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP); 
router.post('/reset-password', resetPassword);



// Profile Management
router.post('/upload-profile-picture', authGuard, upload.single('profilePicture'), uploadProfilePicture);
router.put('/update-profile', authGuard, updateProfile);
router.put('/change-password', authGuard, changePassword); 

// Favorites
router.post('/toggle-favorite', authGuard, toggleFavorite);
router.get('/get-my-favorites', authGuard, getMyFavorites);
router.post('/check-favorite-status', authGuard, checkFavoriteStatus);

// Appointments & Services
router.get("/get-my-appointments", authGuard, getUserAppointments);
router.get("/get-services", authGuard, getAllServices);

module.exports = router;

