import React, { useState } from 'react';
import { User, Moon, Bell, Trash2, Camera, ShieldCheck, Mail, Lock } from 'lucide-react';

const SettingsPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-6">
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Settings</h3>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT SIDE: Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-sm rounded-[24px] p-6 border border-white shadow-sm text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <img 
                src="https://ui-avatars.com/api/?name=Angela+Pradhan&background=1b63fb&color=fff" 
                className="w-full h-full rounded-full object-cover border-4 border-slate-50 shadow-sm" 
                alt="Profile"
              />
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white shadow-md hover:bg-blue-700 transition-all">
                <Camera size={12} />
              </button>
            </div>
            <h4 className="text-sm font-bold text-slate-800">Angela Pradhan</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tight">ID: #10022334</p>
          </div>
        </div>

        {/* RIGHT SIDE: Forms & Preferences */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* Section 1: Personal Details */}
          <div className="bg-white/80 backdrop-blur-sm rounded-[24px] p-6 border border-white shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 mb-5 flex items-center gap-2 uppercase tracking-tight">
              <User size={14} className="text-blue-600" /> Personal Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup label="User Name" value="_moonartz" />
              <InputGroup label="Email Address" value="angela@mail.com" />
              <InputGroup label="New Password" type="password" placeholder="••••••••" />
              <InputGroup label="Confirm Password" type="password" placeholder="••••••••" />
              
              <div className="md:col-span-2 flex justify-end mt-2">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-xl text-[11px] font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
                  Update Profile
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Preferences */}
          <div className="bg-white/80 backdrop-blur-sm rounded-[24px] p-6 border border-white shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 mb-5 flex items-center gap-2 uppercase tracking-tight">
              <ShieldCheck size={14} className="text-blue-600" /> Preferences
            </h4>

            <div className="space-y-3">
              <ToggleRow 
                icon={<Moon size={14} />} 
                title="Dark Mode" 
                desc="Toggle light or dark theme"
                active={isDarkMode}
                onToggle={() => setIsDarkMode(!isDarkMode)}
              />
              <ToggleRow 
                icon={<Bell size={14} />} 
                title="Notifications" 
                desc="Alerts for appointments"
                active={notifications}
                onToggle={() => setNotifications(!notifications)}
              />
              
              {/* Deactivate Account */}
              <div className="flex items-center justify-between p-3 bg-red-50/30 rounded-xl border border-red-50 mt-4 group cursor-pointer hover:bg-red-50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100/50 text-red-500 rounded-lg">
                    <Trash2 size={14} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-red-600">Delete Account</p>
                    <p className="text-[9px] text-red-400 uppercase font-bold tracking-tighter">Remove all data permanently</p>
                  </div>
                </div>
                <button className="text-red-300 group-hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* --- REUSABLE SUB-COMPONENTS --- */

const InputGroup = ({ label, type = "text", value, placeholder, disabled = false }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">{label}</label>
    <input 
      type={type}
      defaultValue={value}
      placeholder={placeholder}
      disabled={disabled}
      className={`bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-2 text-[11px] text-slate-700 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all ${disabled ? 'opacity-50' : 'hover:border-blue-100'}`}
    />
  </div>
);

