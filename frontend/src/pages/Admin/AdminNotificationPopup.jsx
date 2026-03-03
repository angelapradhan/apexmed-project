import React from 'react';
import { X, BellRing } from 'lucide-react';
import { markAllNotificationsAsReadApi } from '../../services/api'; 
import { toast } from 'react-hot-toast'; 

const AdminNotificationPopup = ({ notifications, onClose, onRefresh }) => {

  const handleMarkAllRead = async () => {
    try {
      const res = await markAllNotificationsAsReadApi('ADMIN');
      
      if (res.data.success) {
        toast.success("All admin notifications marked as read!");
        if (onRefresh) onRefresh(); 
      }
    } catch (err) {
      console.error("Error marking all read", err);
      toast.error("Failed to mark all as read");
    }
  };

  return (
    <div className="absolute right-0 top-16 w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <BellRing size={18} className='text-blue-600'/>
            Admin Notifications
        </h3>
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-200">
          <X size={18} className="text-slate-500" />
        </button>
      </div>
      
      {notifications.length > 0 && (
        <button 
          onClick={handleMarkAllRead}
          className="flex items-center gap-2 w-full text-left p-3 text-sm text-blue-600 hover:bg-blue-50 font-semibold border-b border-slate-100"
        >
          Mark all as read
        </button>
      )}

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-center text-slate-500 py-10 text-sm">No new admin notifications</p>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className={`p-4 border-b border-slate-100 ${notif.isRead ? 'bg-white' : 'bg-blue-50/50'}`}>
              <div className="flex justify-between items-start">
                  <p className="font-bold text-sm text-slate-900">{notif.title}</p>
                  {!notif.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></span>}
              </div>
              <p className="text-xs text-slate-700 mt-1">{notif.message}</p>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">
                {new Date(notif.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminNotificationPopup;