const router = require("express").Router();
const { getAllUsers, deleteUser, getUserCount } = require('../controllers/userController');
const { createAppointment, getAllAppointments, updateAppointmentStatus} = require('../controllers/appointmentController');
const { addService, getAllServices } = require('../controllers/serviceController');
const authGuard = require("../helpers/authguard");
const isAdmin = require("../helpers/isAdmin");


router.use(authGuard);
router.use(isAdmin);

//appointment ko
router.post("/create-appointment", authGuard, isAdmin, createAppointment);
router.get("/get-all-appointments", authGuard, isAdmin, getAllAppointments);

// Routes
router.get("/get-user-count", authGuard, getUserCount);
router.get("/get-all-users", getAllUsers);
router.delete("/delete-user/:id", deleteUser);

router.post("/add-service", authGuard, isAdmin, addService);
router.get("/get-services", authGuard, getAllServices); 


router.patch("/appointments/:id/status", updateAppointmentStatus);

module.exports = router;