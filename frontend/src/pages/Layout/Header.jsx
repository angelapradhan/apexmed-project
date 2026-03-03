import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react'; 
import NotificationPopup from '../NotificationPopup';
import { getNotificationsApi } from '../../services/api';

const Header = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const notificationsEnabled = localStorage.getItem('notificationsEnabled') !== 'false';
  
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?.id || storedUser?._id;
  const username = storedUser?.username || storedUser?.name || "User";

  // Notifications fetch function
  const fetchNotifications = async () => {
    try {
      if (!userId || !notificationsEnabled) {
        setNotifications([]);
        return;
      }
      
      const res = await getNotificationsApi(userId);
      
      if (res.status === 200) {
        const notificationsData = res.data.notifications || res.data.data || res.data;
        setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
      }
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  // Notifications fetch interval 
  useEffect(() => {

    if (userId && notificationsEnabled) {
      fetchNotifications();
      const interval = setInterval(() => {
        fetchNotifications();
      }, 5000); 
      
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [userId, notificationsEnabled]); 


  const unreadCount = Array.isArray(notifications) 
    ? notifications.filter(n => !n.isRead).length 
    : 0;

  return (
    <header className="flex justify-between items-center mb-8 w-full relative">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome back, <span className="text-blue-600">{username}!</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setIsPopupOpen(!isPopupOpen)}
            className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 text-slate-500 hover:text-blue-600 transition-colors relative"
          >
            <Bell size={20} />
            
            
            {notificationsEnabled && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          {/* Notification Popup Component */}
          {isPopupOpen && (
            <NotificationPopup 
              notifications={notifications} 
              onClose={() => setIsPopupOpen(false)}
              onRefresh={fetchNotifications}
            />
          )}
        </div>
        
        <img 
          src={storedUser?.profilePicture 
            ? `http://localhost:3000${storedUser.profilePicture}` 
            : `https://ui-avatars.com/api/?name=${username}&background=1b63fb&color=fff`} 
          className="w-10 h-10 rounded-xl border-2 border-white shadow-sm object-cover" 
          alt="Profile"
        />
      </div>
    </header>
  );
};

export default Header;