import React from 'react';
import { Activity, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

const Register = ({ onSwitch }) => {
  return (
    <div className="min-h-screen bg-[#f0f7ff] flex items-center justify-center p-6">
      <div className="max-w-125 w-full bg-white rounded-[40px] shadow-2xl shadow-blue-100 overflow-hidden border border-white">
        <div className="p-10 md:p-12">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200 -rotate-3">
              <Activity className="text-white" size={28} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
            <p className="text-slate-500 mt-2 text-center text-sm">Join ApexMed for better healthcare experience.</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" size={18} />
                <input type="text" placeholder="Angela Pradhan" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all outline-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" size={18} />
                <input type="email" placeholder="angelapradhan@gmail.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all outline-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" size={18} />
                <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all outline-none" />
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
              <input type="checkbox" className="mt-1 rounded border-slate-300 text-blue-600" />
              <p className="text-xs text-slate-500 leading-snug">
                I agree to the <span className="text-blue-600 font-bold">Terms</span> and <span className="text-blue-600 font-bold">Privacy Policy</span>.
              </p>
            </div>

            <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2">
              Get Started <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm">
            Already a member? {' '}
            <button onClick={() => onSwitch('login')} className="text-blue-600 font-bold hover:underline">Login</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;