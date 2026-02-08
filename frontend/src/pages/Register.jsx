import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import backgroundImage from '../assets/background.png';
import { createUserApi } from "../services/api"; // Updated path
import { toast } from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States for input fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const data = { username, email, password };

    try {
      const res = await createUserApi(data);
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/login');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Registration failed!";
      toast.error(errorMsg);
    }
  };

  return (
    <div 
      className="h-screen w-full flex flex-col md:flex-row font-sans relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>

      {/* --- LEFT SIDE: Branding --- */}
      <div className="hidden md:flex md:w-1/2 items-center justify-start p-16 md:p-20 relative z-10">
        <div className="max-w-md md:ml-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1e293b] leading-tight mb-6 drop-shadow-sm tracking-tight">
            Join the Healthcare <br /> Revolution
          </h1>
          <p className="text-lg text-slate-800 leading-relaxed font-semibold opacity-90">
            Create your account today and take control of your health journey with ApexMed.
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE --- */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-[420px] bg-white/90 backdrop-blur-md rounded-[28px] p-8 shadow-xl border border-white/50">
          
          <div className="mb-5 text-center md:text-left">
            <h2 className="text-[28px] font-bold text-slate-900 mb-0.5">Sign Up</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Join ApexMed Today</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-slate-700 ml-1">Username</label>
              <input 
                type="text" 
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/80 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:border-blue-500 outline-none text-slate-700"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-bold text-slate-700 ml-1">Email</label>
              <input 
                type="email" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/80 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:border-blue-500 outline-none text-slate-700"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-bold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/80 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:border-blue-500 outline-none text-slate-700"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-bold text-slate-700 ml-1">Confirm Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Repeat Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/80 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:border-blue-500 outline-none text-slate-700"
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#1b63fb] text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mt-1 text-sm active:scale-[0.99]">
              Sign Up
            </button>
          </form>

          <p className="mt-5 text-center text-slate-600 text-xs font-bold">
            Already have an account? {' '}
            <button onClick={() => navigate('/login')} className="text-[#1b63fb] font-extrabold hover:underline">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;