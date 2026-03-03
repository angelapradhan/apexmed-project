const Notification = require('../models/notification');

const createNotification = async (req, res) => {
    try {
        const { userId, title, message, type } = req.body;

        if (!userId || !title || !message) {
            return res.status(400).json({ 
                success: false, 
                message: "Required fields (userId, title, message) are missing!" 
            });
        }

        const newNotification = await Notification.create({
            userId,
            title,
            message,
            type: type || "info", 
            isRead: false 
        });

        res.status(201).json({ 
            success: true, 
            message: "Notification Created Successfully!", 
            notification: newNotification 
        });

    } catch (error) {
        console.error("Create Notification Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Database Error: " + error.message 
        });
    }
};

// user ko notifications
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID missing!" });
    }

    const notifications = await Notification.findAll({ 
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Get Notifications Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// admin ko notifications 
const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({ 
      where: { type: 'admin' }, 
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Get Admin Notifications Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID missing!" });
    }

    const [updatedCount] = await Notification.update(
      { isRead: true },
      { where: { userId, isRead: false } }
    );
    
    res.status(200).json({ 
        success: true, 
        message: `Marked ${updatedCount} notifications as read.` 
    });
  } catch (error) {
    console.error("Mark All As Read Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createNotification, getUserNotifications, getAdminNotifications, markAllAsRead };