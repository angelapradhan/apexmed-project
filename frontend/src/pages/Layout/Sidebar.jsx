import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Heart, 
  Star, 
  Settings, 
  LogOut 
} from 'lucide-react';
import myLogo from '../../assets/white-logo.png';

const Sidebar = () => {
  return (
    <nav className="hidden md:flex flex-col items-start py-6 bg-white/80 backdrop-blur-md rounded-[28px] shadow-sm border border-white h-[calc(100vh-2rem)] sticky top-4 transition-all duration-300 ease-in-out w-16 hover:w-60 group overflow-hidden z-50">
      
      {/* Logo Section */}
      <div className="flex items-center w-full mb-10 px-3"> 
        <div className="flex items-center justify-center bg-blue-600 w-10 h-10 rounded-xl shadow-md shadow-blue-100 shrink-0 overflow-hidden">
          <img 
            src={myLogo} 
            alt="Logo" 
            className="w-full h-full object-contain p-1.5" 
          />
        </div>
        <span className="font-bold text-lg text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ml-3">
          ApexMed
        </span>
      </div>
      
      {/* Sidebar Links */}
      <div className="flex flex-col gap-4 w-full flex-1 px-2.5">
        <SidebarItem to="/dashboard" icon={<Home size={20} />} label="Home Page" />
        <SidebarItem to="/appointments" icon={<Calendar size={20} />} label="My Appointments" />
        <SidebarItem to="/favourites" icon={<Heart size={20} />} label="Favourites" />
        <SidebarItem to="/reviews" icon={<Star size={20} />} label="Reviews" />
        <SidebarItem to="/settings" icon={<Settings size={20} />} label="Settings" />
      </div>

      {/* Logout Section */}
      <div className="w-full px-2.5 pb-2">
        <SidebarItem to="/login" icon={<LogOut size={20} />} label="Logout" isLogout={true} />
      </div>
    </nav>
  );
};

const SidebarItem = ({ icon, label, to, isLogout = false }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => `flex items-center w-full cursor-pointer group/item no-underline transition-colors`}
  >
    {({ isActive }) => (
      <>

        <div className={`p-2.5 rounded-xl transition-all duration-300 shrink-0 ${
          isActive 
            ? 'bg-blue-600 text-white shadow-md' 
            : isLogout 
              ? 'text-red-400 hover:bg-red-50 hover:text-red-500' 
              : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'
        }`}>
          {icon}
        </div>

        <span className={`font-bold text-xs transition-opacity duration-300 whitespace-nowrap opacity-0 group-hover:opacity-100 ml-3 ${
          isActive 
            ? 'text-blue-600' 
            : isLogout 
              ? 'text-red-500' 
              : 'text-slate-500 group-hover/item:text-blue-600'
        }`}>
          {label}
        </span>
      </>
    )}
  </NavLink>
);

export default Sidebar;