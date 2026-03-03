import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import myLogo from '../../assets/white-logo.png'; 
import { 
  LayoutDashboard, Calendar, Briefcase, Users, 
  MessageSquare, Heart, Bell, BarChart3, Settings, LogOut 
} from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { name: 'Appointments', icon: <Calendar size={20} />, path: '/admin/appointments' },
    { name: 'Services', icon: <Briefcase size={20} />, path: '/admin/services' },
    { name: 'Users', icon: <Users size={20} />, path: '/admin/users' },
    { name: 'Reviews', icon: <MessageSquare size={20} />, path: '/admin/reviews' }
  ];

  return (

    <nav className="hidden md:flex flex-col items-start py-6 bg-white border-r border-slate-100 h-[calc(100vh-2rem)] fixed left-4 top-4 transition-all duration-300 ease-in-out w-20 hover:w-64 group overflow-hidden z-50 rounded-[32px] shadow-sm">
      
      {/* Logo Section */}
      <div className="flex items-center w-full mb-10 px-4"> 
        <div className="flex items-center justify-center bg-blue-600 w-11 h-11 rounded-2xl shadow-lg shadow-blue-100 shrink-0 overflow-hidden">
          <img src={myLogo} alt="Logo" className="w-full h-full object-contain p-2" />
        </div>
        <span className="font-black text-lg text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ml-4">
          ApexMed <span className="text-blue-600">Admin</span>
        </span>
      </div>
      
      {/* Menu Links */}
      <div className="flex flex-col gap-2 w-full flex-1 px-3">
        {menuItems.map((item) => (
          <NavLink 
            key={item.name}
            to={item.path}
            className={({ isActive }) => `flex items-center w-full cursor-pointer group/item no-underline transition-all rounded-2xl ${
              isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            <div className="p-3.5 rounded-2xl shrink-0 flex items-center justify-center">
              {item.icon}
            </div>
            <span className="font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ml-2">
              {item.name}
            </span>
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div className="w-full px-3 pb-2">
        <button onClick={handleLogout} className="flex items-center w-full text-red-400 hover:bg-red-50 hover:text-red-500 p-3.5 rounded-2xl transition-all">
          <LogOut size={20} className="shrink-0" />
          <span className="font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-3">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default AdminSidebar;