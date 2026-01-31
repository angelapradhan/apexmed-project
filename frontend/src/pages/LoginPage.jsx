import React, { useState } from 'react';
import { Activity, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const LoginPage = ({ onSwitch }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#f0f7ff] flex items-center justify-center p-6 font-sans">
      <div className="max-w-112.5 w-full bg-white rounded-[40px] shadow-2xl shadow-blue-100 overflow-hidden border border-white">
        
        <div className="p-10 md:p-12">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-300 -rotate-3 transition-transform hover:rotate-0 cursor-pointer">
              <Activity className="text-white" size={28} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">ApexMed</h2>
            <p className="text-slate-500 mt-2 text-center text-sm leading-relaxed font-medium">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Password</label>
                <a href="#" className="text-[11px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider">Forgot?</a>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all text-slate-800 placeholder:text-slate-400"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-8 group">
              Sign In
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-10 text-center text-slate-500 text-sm font-medium">
            Don't have an account? {' '}
            <button 
              onClick={() => onSwitch('register')} 
              className="text-blue-600 font-bold hover:underline decoration-2 underline-offset-4"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;