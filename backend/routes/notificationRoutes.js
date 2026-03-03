const express = require('express');
const router = express.Router();
const { 
    createNotification, 
    getUserNotifications, 
    getAdminNotifications, 
    markAllAsRead 
} = require('../controllers/notificationController');

// Routes
router.post('/', createNotification);
router.get('/admin/all', getAdminNotifications); 
router.get('/:userId', getUserNotifications); 
router.put('/mark-all-read/:userId', markAllAsRead);

module.exports = router;