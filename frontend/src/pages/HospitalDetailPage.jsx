import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { postHospitalBookingApi, createNotificationApi, toggleFavoriteApi, checkFavoriteStatusApi } from '../services/api'; // 🌟 Import checkFavoriteStatusApi
import {
  ArrowLeft, Phone, Mail, MapPin, Building2,
  CalendarDays, DollarSign, HeartPulse, Clock4,
  Globe, LayoutGrid, CheckCircle, CalendarCheck,
  Heart, Hash 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const HospitalDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  

  const hospital = location.state?.hospital;

  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentUser, setCurrentUser] = useState({ name: '', email: '', id: '' });
  const [isFavorite, setIsFavorite] = useState(false);

  const isAdminView = location.pathname.startsWith('/admin');

  const hospitalId = hospital?.id || hospital?._id;

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setCurrentUser({
        id: storedUser.id || storedUser._id,
        name: storedUser.name || storedUser.username || "User Name",
        email: storedUser.email || "Email",
      });
    }
  }, []); 


  useEffect(() => {
    const fetchStatus = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = storedUser?.id || storedUser?._id;

      if (userId && hospitalId && !isAdminView) {
        try {
          const res = await checkFavoriteStatusApi({
            userId,
            hospitalId,
            type: 'hospital'
          });
          if (res.data.success) {
            setIsFavorite(res.data.isFavorite);
          }
        } catch (err) {
          console.log("Error checking status", err);
        }
      }
    };
    fetchStatus();
  }, [hospitalId, isAdminView]);


  const handleBack = () => {
    if (isAdminView) {
      navigate('/admin/services'); 
    } else {
      navigate('/dashboard'); 
    }
  };

  const handleToggleFavorite = async () => {
    if (!currentUser.id) {
      toast.error("Please login to add favorites!");
      return;
    }
    if (!hospitalId) return;

    try {
      const payload = {
        userId: currentUser.id,
        hospitalId: hospitalId,
        type: 'hospital'
      };
      
      const response = await toggleFavoriteApi(payload);

      if (response.data.success) {
        setIsFavorite(response.data.isFavorite);
        toast.success(response.data.isFavorite ? "Added to favorites!" : "Removed from favorites");
      }
    } catch (err) {
      console.error("Favorite Error:", err);
      toast.error("Failed to update favorites");
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDept || !selectedDate) {
      toast.error("Please select a department and date!");
      return;
    }
    if (!hospitalId || !currentUser.id) {
        toast.error("Invalid hospital data or not logged in!");
        return;
    }

    const bookingPayload = {
      hospitalId: hospitalId,
      hospitalName: hospital.hospitalName,
      doctorImage: hospital.coverImage, 
      patientName: currentUser.name,
      patientEmail: currentUser.email,
      department: selectedDept,
      date: selectedDate,
      fee: hospital.feeRange || 'N/A',
      time: '10:00 AM', 
      type: 'hospital' 
    };

    try {
      const response = await postHospitalBookingApi(bookingPayload);
      
      if (response.status === 201 || response.data.success) {
        toast.success("Hospital appointment booked successfully!");
        
        try {
          await createNotificationApi({
            userId: currentUser.id,
            title: "Hospital Booking Confirmed",
            message: `Your booking at ${hospital.hospitalName} (${selectedDept}) on ${selectedDate} is confirmed.`,
            type: 'booking'
          });
        } catch (notifErr) {
          console.error("Notification API failed:", notifErr);
        }

        navigate('/dashboard'); 
      }
    } catch (error) {
      console.error("Booking error:", error);
      const errorMessage = error.response?.data?.message || "Failed to book appointment.";
      toast.error(errorMessage);
    }
  };

  if (!hospital) {
    return (
        <div className="h-screen flex flex-col items-center justify-center p-10 font-black text-slate-400 text-center">
            <Building2 size={60} className="mb-4 text-slate-300" />
            <h2 className="text-2xl text-slate-600">Hospital Data Not Found</h2>
            <p className="text-sm mt-2">Please go back and select a hospital from the list.</p>
            <button onClick={handleBack} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold">
                Back
            </button>
        </div>
    );
  }

  return (
    <div className="w-full max-w-[1550px] mx-auto px-6 lg:px-10 pt-4 pb-20 animate-in fade-in duration-500 min-h-screen">

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
            <button onClick={handleBack} className="p-2.5 bg-white hover:bg-slate-50 rounded-2xl shadow-sm border border-slate-100 transition-all active:scale-95">
            <ArrowLeft size={18} className="text-slate-600" />
            </button>
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Hospital Profile Detail
            </h2>
        </div>

        {!isAdminView && (
            <button 
                onClick={handleToggleFavorite}
                className={`p-3 rounded-2xl transition-all ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-white text-slate-400 hover:text-red-500'}`}
            >
                <Heart size={20} className={isFavorite ? 'fill-red-500' : ''} />
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 text-left">

          <div className="bg-white rounded-[40px] shadow-sm border border-slate-50 relative overflow-hidden h-[380px]">
            <div className="absolute inset-0 z-0">
              <img
                src={`http://localhost:3000/uploads/${hospital.coverImage}`}
                className="w-full h-full object-cover"
                alt="cover"
                onError={(e) => e.target.src = "https://via.placeholder.com/800x400"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 p-8 z-10 w-full">
              <div className="flex items-end gap-5">
                <div className="w-24 h-24 rounded-[28px] overflow-hidden bg-white border-4 border-white shadow-2xl flex-shrink-0">
                  <img
                    src={`http://localhost:3000/uploads/${hospital.hospitalLogo}`}
                    className="w-full h-full object-contain p-1"
                    alt={hospital.hospitalName}
                    onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                  />
                </div>
                <div>
                  <p className="text-blue-300 font-bold text-[9px] uppercase tracking-[0.15em]">{hospital.hospitalType}</p>
                  <h3 className="text-2xl font-black text-white tracking-tight leading-tight">{hospital.hospitalName}</h3>
                  
                    <div className="flex items-center gap-1.5 mt-1 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full w-fit">
                        <Hash size={10} className="text-white/70" />
                        <span className="text-[9px] font-bold text-white/90 tracking-wider">
                            ID: {hospitalId}
                        </span>
                    </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-5 text-white/90 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 w-fit">
                <MapPin size={14} className="text-blue-300" />
                <p className="text-[11px] font-bold">
                  {hospital.address}, {hospital.city}, {hospital.province}
                </p>
              </div>
            </div>
          </div>

          {/* Official Info */}
          <div className="bg-white rounded-[30px] p-7 shadow-sm border border-slate-50">
            <h3 className="text-[11px] font-black text-slate-800 mb-6 uppercase tracking-widest border-b border-slate-50 pb-3">Official Info</h3>
            <div className="space-y-4">
              <InfoRow label="Established" value={hospital.establishedYear} icon={<CalendarDays size={13} />} />
              <InfoRow label="Phone" value={hospital.phone} icon={<Phone size={13} />} />
              <InfoRow label="Emergency" value={hospital.emergencyPhone} icon={<HeartPulse size={13} />} />
              <InfoRow label="Email" value={hospital.email} icon={<Mail size={13} />} />
              <InfoRow label="Website" value={hospital.website} icon={<Globe size={13} />} />
            </div>
          </div>
        </div>


        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <StatBox label="Consultation" value={hospital.feeRange} icon={<DollarSign size={16} />} />
            <StatBox label="ICU Status" value={hospital.icuAvailable === 'Yes' ? 'Available' : 'N/A'} icon={<HeartPulse size={16} />} />
            <StatBox label="Service" value={hospital.emergency247 === 'Yes' ? '24/7' : 'Limited'} icon={<Clock4 size={16} />} />
          </div>


          {isAdminView ? (
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-50 text-center">
              <Building2 size={40} className="mx-auto text-blue-500 mb-4" />
              <h3 className="text-lg font-black text-slate-800">Admin View</h3>
              <p className="text-slate-500 font-bold text-sm mt-2">Hospital details management panel.</p>
            </div>
          ) : (
            <div className="bg-white rounded-[40px] p-8 lg:p-10 shadow-sm border border-slate-50 text-left">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                  <LayoutGrid size={22} />
                </div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Select Department & Date</h3>
              </div>
              <div className="bg-slate-50/50 rounded-[30px] p-8 border border-slate-100">
                <div className="mb-8">
                  {hospital.departments ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {hospital.departments.split(',').map((dept, index) => {
                        const deptName = dept.trim();
                        const isSelected = selectedDept === deptName;
                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedDept(isSelected ? null : deptName)}
                            className={`group relative flex flex-col items-center justify-center gap-3 p-5 rounded-3xl border-2 transition-all duration-300
                                      ${isSelected
                                ? 'bg-white border-blue-500 shadow-xl shadow-blue-500/10'
                                : 'bg-white/50 border-transparent hover:border-slate-200 shadow-sm'}`}
                          >
                            {isSelected && (
                              <div className="absolute top-3 right-3 text-blue-600">
                                <CheckCircle size={18} fill="white" />
                              </div>
                            )}
                            <div className={`p-3 rounded-2xl ${isSelected ? 'bg-blue-50' : 'bg-slate-100'}`}>
                              <Building2 size={20} className={isSelected ? 'text-blue-600' : 'text-slate-400'} />
                            </div>
                            <span className={`text-[11px] font-black uppercase tracking-tight ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
                              {deptName}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-slate-400 font-bold text-sm">No departments listed.</p>
                  )}
                </div>
                <div className="border-t border-slate-200/60 pt-8">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Choose Appointment Date</label>
                  <div className="relative max-w-sm">
                    <CalendarDays className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white border border-slate-200 focus:border-blue-500 outline-none text-slate-800 font-black text-sm transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between gap-6 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest">Emergency Help</p>
                    <h2 className="text-xl font-black text-slate-800 tracking-tighter">{hospital.emergencyPhone || hospital.phone}</h2>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a href={`tel:${hospital.phone}`} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">
                    Quick Call
                  </a>
                  <button
                    onClick={handleBookAppointment}
                    className="flex items-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-105"
                  >
                    <CalendarCheck size={16} />
                    Confirm Appointment
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, icon }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-slate-50 group-hover:bg-blue-50 rounded-xl text-slate-400 group-hover:text-blue-500 transition-colors">
        {icon}
      </div>
      <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">{label}</span>
    </div>
    <span className="text-slate-700 font-black text-[12px] tracking-tight">{value || "N/A"}</span>
  </div>
);

const StatBox = ({ label, value, icon }) => (
  <div className="bg-white p-6 rounded-[30px] border border-slate-50 shadow-sm flex flex-col items-center gap-2 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
    <div className="text-blue-600 bg-blue-50 p-3 rounded-2xl mb-1">{icon}</div>
    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{label}</p>
    <p className="text-sm font-black text-slate-800 tracking-tight">{value || "N/A"} </p>
  </div>
);

export default HospitalDetailPage;