import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Bell } from 'lucide-react'; 
import AdminSidebar from './AdminSidebar';
import AdminNotificationPopup from './AdminNotificationPopup'; 
import { getAdminNotificationsApi } from '../../services/api'; 

const AdminLayout = () => {
  const user = JSON.parse(localStorage.getItem('user')) || { username: 'Admin' };

  const [showPopup, setShowPopup] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // API call fetch 
  const fetchNotifications = async () => {
    try {
      const res = await getAdminNotificationsApi();
      if (res.data.success) {

        setNotifications(res.data.notifications.filter(n => !n.isRead));
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const togglePopup = () => {
    fetchNotifications(); 
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex bg-[#f8fafc] min-h-screen p-4 gap-4 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col gap-4 ml-24 transition-all duration-300">
        <header className="h-20 bg-white/70 backdrop-blur-md rounded-[28px] border border-white/50 shadow-sm flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold text-slate-800">ApexMed Control Center</h1>

          <div className="flex items-center gap-4">
            
            <div className="relative"> 
              <button
                onClick={togglePopup}
                className="p-3 bg-white rounded-2xl text-slate-600 hover:bg-blue-50 transition-colors shadow-inner"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showPopup && (
                <div className="absolute right-0 top-16 z-50">
                  <AdminNotificationPopup
                    notifications={notifications}
                    onClose={() => setShowPopup(false)}
                    onRefresh={fetchNotifications} 
                  />
                </div>
              )}
            </div>
            
            {/* User Info & Profile */}
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-700">{user.username}</p>
              <p className="text-[10px] text-green-500 font-bold flex items-center justify-end gap-1">
                <span className="w-1 h-1 bg-green-500 rounded-full"></span> Online
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-100 border-2 border-white">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 bg-white/40 backdrop-blur-md rounded-[32px] border border-white/50 shadow-sm p-8 overflow-y-auto max-h-[calc(100vh-140px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;