const Notification = require('../models/notification');

// --- Notification Create Garne Function ---
const createNotification = async (req, res) => {
    try {
        // Debugging ko lagi terminal ma herne
        console.log("Notification Request Received:", req.body);

        const { userId, title, message, type } = req.body;

        // Validation - main kura haru xutnu bhayena
        if (!userId || !title || !message) {
            return res.status(400).json({ 
                success: false, 
                message: "Required fields (userId, title, message) are missing!" 
            });
        }

        // Database ma save garne
        const newNotification = await Notification.create({
            userId,
            title,
            message,
            type: type || "info", // Default type 'info' rakheko
            isRead: false // By default unread hunchha
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

// --- User ko notifications lina ---
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if userId exists
    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID missing!" });
    }

    // Sabai data tanne (ani naya notifications mathi aaosh bhanera DESC order)
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

// --- Sabai Notifications Read garne ---
const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if userId exists
    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID missing!" });
    }

    // Sabai unread notifications lai read banaune
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


module.exports = { createNotification, getUserNotifications, markAllAsRead };