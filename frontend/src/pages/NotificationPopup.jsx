import React from 'react';
import { X, MailCheck } from 'lucide-react';
import { markAllNotificationsAsReadApi } from '../services/api'; 

const NotificationPopup = ({ notifications, onClose, onRefresh }) => {

  const handleMarkAllRead = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = storedUser?.id || storedUser?._id;
      
      if (!userId) return;

      const res = await markAllNotificationsAsReadApi(userId);
      if (res.data.success) {
        alert("All notifications marked as read!");
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error("Error marking all read", err);
    }
  };

  return (
    <div className="absolute right-0 top-14 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center p-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-800">Notifications</h3>
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100">
          <X size={18} className="text-slate-500" />
        </button>
      </div>
      
      {notifications.length > 0 && (
        <button 
          onClick={handleMarkAllRead}
          className="flex items-center gap-2 w-full text-left p-3 text-sm text-blue-600 hover:bg-blue-50 font-semibold"
        >
          <MailCheck size={16} />
          Mark all as read
        </button>
      )}

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-center text-slate-500 py-6 text-sm">No new notifications</p>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className={`p-4 border-b border-slate-100 ${notif.isRead ? 'bg-white' : 'bg-blue-50/50'}`}>
              <p className="font-bold text-sm text-slate-800">{notif.title}</p>
              <p className="text-xs text-slate-600">{notif.message}</p>
              <p className="text-[10px] text-slate-400 mt-1">
                {new Date(notif.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;