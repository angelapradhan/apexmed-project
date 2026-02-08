import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginUserApi } from '../services/api';
import backgroundImage from '../assets/background.png';
import { toast } from 'react-hot-toast'; // Toast import garna nabirsinu

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(''); // Email state
  const [password, setPassword] = useState(''); // Password state
  const navigate = useNavigate();

  // Login Handle garne function
  const handleLogin = async (e) => {
    e.preventDefault();
    const data = { email, password };

    try {
      const res = await loginUserApi(data);
      if (res.data.success) {
        toast.success(res.data.message);

        // Token ra User data LocalStorage ma save garne
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        // Dashboard ma redirect garne
        //navigate('/dashboard');
        // --- HIGHLIGHT: Admin ra User ko Redirect Logic ---
        const userRole = res.data.user.role;
        if (userRole === 'admin') {
          navigate('/admin/dashboard'); // Admin ko lagi xuttai route
        } else {
          navigate('/dashboard'); // Normal user ko lagi
        }
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Login failed";
      toast.error(errorMsg);
    }
  };

  return (
    <div
      className="h-screen w-full flex flex-col md:flex-row font-sans relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-white/25 backdrop-blur-[2px]"></div>

      {/* --- LEFT SIDE: Branding --- */}
      <div className="hidden md:flex md:w-1/2 items-center justify-start p-16 md:p-20 relative z-10">
        <div className="max-w-md md:ml-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1e293b] leading-tight mb-6 drop-shadow-sm tracking-tight">
            Fast, Efficient <br /> and Productive
          </h1>
          <p className="text-lg text-slate-800 leading-relaxed font-semibold opacity-90">
            Manage your healthcare journey with ApexMed. Access trusted doctors,
            book appointments—all in one place.
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE --- */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-105 bg-white/90 backdrop-blur-md rounded-[28px] p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-white/50">

          <div className="mb-6 text-center md:text-left">
            <h2 className="text-[28px] font-bold text-slate-900 mb-0.5">Sign In</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Your Medical Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4"> {/* Form submit ma handleLogin connect gariyo */}
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-slate-700 ml-1">Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Email set garne
                className="w-full bg-white/80 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-300"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Password set garne
                  className="w-full bg-white/80 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex justify-end pr-1">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-[11px] font-bold text-[#1b63fb] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#1b63fb] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mt-2 text-sm active:scale-[0.99]">
              Sign In
            </button>

            <div className="relative flex items-center py-2">
              <div className="grow border-t border-slate-200"></div>
              <span className="shrink mx-4 text-slate-500 text-[9px] font-bold uppercase tracking-widest">Or login with</span>
              <div className="grow border-t border-slate-200"></div>
            </div>

            <button type="button" className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl text-[12px] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-4 w-4" alt="Google" />
              Sign in with Google
            </button>
          </form>

          <p className="mt-8 text-center text-slate-600 text-xs font-bold">
            Don't have an account? {' '}
            <button onClick={() => navigate('/register')} className="text-[#1b63fb] font-extrabold hover:underline">Sign Up</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;