import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, ShieldCheck } from 'lucide-react';
import backgroundImage from '../assets/background.png';
import { forgotPasswordApi, verifyOtpApi, resetPasswordApi } from '../services/api';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const clearErrors = () => setErrors({});

  // send Email
  const handleSendCode = async (e) => {
    e.preventDefault();
    clearErrors();


    if (!email) {
      return setErrors({ email: "Please enter your email address" });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return setErrors({ email: "Email is badly formatted" });
    }
    
    try {
      const res = await forgotPasswordApi({ email });
      if (res.data.success) {
        toast.success(res.data.message || "OTP sent to your email!");
        setStep(2);
      } else {
        setErrors({ email: res.data.message });
      }
    } catch (error) {
      setErrors({ email: error.response?.data?.message || "Failed to send code." });
    }
  };

  // verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    clearErrors();
    try {
      const res = await verifyOtpApi({ email, otp });
      if (res.data.success) {
        toast.success(res.data.message);
        setStep(3);
      }
    } catch (error) {

      setErrors({ otp: error.response?.data?.message || "Invalid or expired OTP" });
    }
  };

  // reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    clearErrors();

    if (password !== confirmPassword) {
      return setErrors({ confirmPassword: "New passwords do not match" });
    }
    if (password.length < 8) {
      return setErrors({ password: "Password must be at least 8 characters long" });
    }

    try {
      const res = await resetPasswordApi({ email, password });
      if (res.data.success) {
        toast.success("Password reset successful! Please log in.");
        navigate('/login');
      }
    } catch (error) {
      setErrors({ server: error.response?.data?.message || "Reset failed." });
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center font-sans relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}>

      <div className="absolute inset-0 bg-white/25 backdrop-blur-[2px]"></div>

      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-[28px] p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-white/50 relative z-10 mx-4">
        
        <button onClick={() => step === 1 ? navigate('/login') : setStep(step - 1)}
          className="absolute top-8 left-8 text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft size={20} />
        </button>

        <div className="mb-8 text-center mt-4">
          <h2 className="text-[26px] font-bold text-slate-900 mb-1">
            {step === 1 && "Forgot Password?"}
            {step === 2 && "Enter OTP"}
            {step === 3 && "Reset Password"}
          </h2>
          <p className="text-slate-500 text-xs font-semibold px-6">
            {step === 1 && "Enter your email to receive a 6-digit verification code."}
            {step === 2 && `We've sent a code to ${email}`}
            {step === 3 && "Create a strong new password for your account."}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full bg-white/80 border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email}</p>}
            </div>

            <button type="submit" className="w-full bg-[#1b63fb] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
              Send Code
            </button>
          </form>
        )}

        {/* otp */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="space-y-1.5 text-center">
              <label className="text-[12px] font-bold text-slate-700">Verification Code</label>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="0 0 0 0 0 0"

                className={`w-full bg-white/80 border ${errors.otp ? 'border-red-500' : 'border-slate-200'} rounded-xl py-4 text-center text-2xl font-bold tracking-[10px] focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all`}
              />

              {errors.otp && <p className="text-red-500 text-xs ml-1">{errors.otp}</p>}
            </div>
            <button type="submit" className="w-full bg-[#1b63fb] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
              Verify Code
            </button>
            <p className="text-center text-[11px] font-bold text-slate-400">
              Didn't get a code? <button type="button" className="text-[#1b63fb]" onClick={handleSendCode}>Resend</button>
            </p>
          </form>
        )}

        {/* reset */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-slate-700 ml-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className={`w-full bg-white/80 border ${errors.password ? 'border-red-500' : 'border-slate-200'} rounded-xl py-3 pl-11 pr-12 text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all`} 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs ml-1">{errors.password}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-slate-700 ml-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className={`w-full bg-white/80 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200'} rounded-xl py-3 pl-11 pr-12 text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all`} 
                />

                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* error */}
              {errors.confirmPassword && <p className="text-red-500 text-xs ml-1">{errors.confirmPassword}</p>}
            </div>

            {errors.server && <p className="text-red-500 text-xs text-center">{errors.server}</p>}
            <button type="submit" className="w-full bg-[#1b63fb] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;