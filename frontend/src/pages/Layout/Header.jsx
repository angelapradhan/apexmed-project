import React from 'react';
import { Search, Bell } from 'lucide-react';

const Header = ({ username }) => {
  return (
    <header className="flex justify-between items-center mb-8 w-full">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome back, <span className="text-blue-600">{username}!</span>
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-white/80 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm w-48 md:w-64"
          />
        </div>
        <button className="bg-white p-2.5 rounded-xl shadow-sm border border-white text-slate-500">
          <Bell size={20} />
        </button>
        <img 
          src="https://ui-avatars.com/api/?name=Angela+Pradhan&background=1b63fb&color=fff" 
          className="w-10 h-10 rounded-xl border-2 border-white shadow-sm" 
          alt="Profile"
        />
      </div>
    </header>
  );
};

export default Header;