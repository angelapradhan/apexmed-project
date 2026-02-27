import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toggleFavoriteApi, checkFavoriteStatusApi } from '../services/api';
import {
  ArrowLeft, Star, Calendar, Users, GraduationCap,
  Award, Phone, Mail, User, X, Heart
} from 'lucide-react';

const DoctorDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { doctor } = location.state || {};

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointmentType, setAppointmentType] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentUser, setCurrentUser] = useState({ name: '', email: '' });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setCurrentUser({
        name: storedUser.name || storedUser.username || "User Name",
        email: storedUser.email || "User Email"
      });
    }
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      // Postgres ma dherai jaso 'id' hunchha, '_id' MongoDB ma hunchha
      const userId = storedUser?.id || storedUser?._id;
      const doctorId = doctor?.id || doctor?._id;

      if (userId && doctorId) {
        try {
          const res = await checkFavoriteStatusApi({ userId, doctorId });
          if (res.data.success) {
            setIsFavorite(res.data.isFavorite);
          }
        } catch (err) {
          console.log("Error checking status", err);
        }
      }
    };
    fetchStatus();
  }, [doctor]);

  // --- UPDATE 1: API Base URL for Images ---
  const API_BASE_URL = 'http://localhost:3000'; 

  // --- UPDATE 2: Smart Back Button ---
  const handleBack = () => {
    // Current path check garne
    if (location.pathname.startsWith('/admin')) {
      navigate('/admin/appointments');
    } else {
      navigate('/appointments');
    }
  };

  // 2. Click garda toggle garne
  const toggleFavorite = async () => {
    console.log("Button clicked!");
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) return alert("Please login first!");

    const payload = {
      userId: storedUser.id || storedUser._id,
      doctorId: doctor.id || doctor._id
    };
    console.log("My Payload:", payload); // Payload ma IDs chhan ki null?

    try {
      const res = await toggleFavoriteApi(payload);

      if (res.data.success) {
        setIsFavorite(res.data.isFavorite);

        // Backend ko response anusar message dekhaune
        if (res.data.isFavorite) {
          alert("✨ Added to Favourites!");
        } else {
          alert("Removed from Favourites.");
        }
      }
    } catch (err) {
      console.error("Toggle Error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = storedUser?.id || storedUser?._id;
      const doctorId = doctor?.id || doctor?._id;

      if (userId && doctorId) {
        try {
          // Hami euta naya API call garchhau status check garna
          const res = await checkFavoriteStatusApi({ userId, doctorId });
          if (res.data.success) {
            setIsFavorite(res.data.isFavorite); // Database ma chha bhane red heart bascha
          }
        } catch (err) {
          console.log("Error checking favorite status:", err);
        }
      }
    };

    checkFavoriteStatus();
  }, [doctor]); // Doctor change huda feri check garchha

  if (!doctor) return (
    <div className="h-screen flex items-center justify-center p-10 text-center font-black text-slate-400">
      Doctor data not found. Please go back to the list.
    </div>
  );

  const handleBookNow = () => {
    if (!selectedDate || !selectedTime || !appointmentType) {
      alert("Please select a Date, Time, and Appointment Type first!");
      return;
    }
    setIsModalOpen(true);
  };

  const handleFinalBooking = async (e) => {
    e.preventDefault();
    if (!phoneNumber) return alert("Phone number is required!");

    const finalBookingPayload = {
      doctorId: doctor.id || doctor._id,
      doctorName: doctor.doctorName,
      doctorImage: doctor.doctorImage,
      patientName: currentUser.name,
      patientEmail: currentUser.email,
      patientPhone: phoneNumber,
      date: selectedDate,
      time: selectedTime,
      type: appointmentType,
      fee: doctor.price
    };

    try {
      const response = await fetch('http://localhost:3000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalBookingPayload),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Your Appointment has been booked successfully!");
        setPhoneNumber('');
        setIsModalOpen(false);
        navigate('/dashboard');
      } else {
        alert("Error: " + (data.message || "Something went wrong"));
      }
    } catch (error) {
      console.error("Database connection error:", error);
      alert("Could not connect to the server.");
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 pt-4 pb-20 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        {/* Updated back button */}
        <button onClick={handleBack} className="...">
          <ArrowLeft size={18} className="text-slate-600" />
        </button>
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Doctor Profile Detail</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: Compact Profile & Side-by-Side Info */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 text-left">

          {/* Profile Card */}
          <div className="bg-white rounded-[30px] p-5 shadow-sm border border-slate-50 relative overflow-hidden">
            <button
              onClick={toggleFavorite}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-xl bg-white/90 backdrop-blur-md shadow-sm border border-slate-100 transition-all active:scale-90"
            >
              <Heart
                size={18}
                className={isFavorite ? "fill-red-500 text-red-500" : "text-slate-300"}
              />
            </button>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-[26px] overflow-hidden mb-3 bg-blue-50 border-4 border-white shadow-sm">
                <img
                  src={`http://localhost:3000/uploads/${doctor.doctorImage}`}
                  className="w-full h-full object-cover"
                  alt={doctor.doctorName}
                  onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                />
              </div>
              <div className="text-center mb-3">
                <h3 className="text-lg font-black text-slate-800 tracking-tight leading-tight">{doctor.doctorName}</h3>
                <p className="text-blue-500 font-bold text-[9px] uppercase tracking-[0.15em] mt-1">{doctor.specialization}</p>
              </div>

              <div className="w-full bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
                <p className="text-[10px] text-slate-500 leading-relaxed text-center font-bold italic">
                  {doctor.bio ? `"${doctor.bio}"` : `"${doctor.doctorName} is an expert in ${doctor.specialization}."`}
                </p>
              </div>
            </div>
          </div>

          {/* Official Info: Width badhako, Length (Height) ghatako */}
          <div className="bg-white rounded-[25px] p-6 shadow-sm border border-slate-50">
            <h3 className="text-[11px] font-black text-slate-800 mb-5 uppercase tracking-widest border-b border-slate-50 pb-2">Official Info</h3>
            <div className="space-y-3.5">
              <InfoRow label="Gender" value={doctor.gender} icon={<User size={13} />} />
              <InfoRow label="Qualification" value={doctor.qualification} icon={<GraduationCap size={13} />} />
              <InfoRow label="Experience" value={doctor.experience} icon={<Calendar size={13} />} />
              <InfoRow label="Medical License" value={doctor.medicalLicense} icon={<Award size={13} />} />
              <InfoRow label="Contact" value={doctor.contact} icon={<Phone size={13} />} />
              <InfoRow label="Email" value={doctor.email} icon={<Mail size={13} />} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Booking & Selection */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <StatBox label="Experience" value={doctor.experience || "N/A"} icon={<Calendar size={16} />} />
            <StatBox label="Patients" value={doctor.patients || "200+"} icon={<Users size={16} />} />
            <StatBox label="Rating" value={doctor.rating || "4.8"} icon={<Star size={16} />} />
          </div>

          <div className="bg-white rounded-[40px] p-8 lg:p-10 shadow-sm border border-slate-50 space-y-10 text-left">
            <div className="space-y-4">
              <h3 className="text-md font-black text-slate-800 tracking-tight">Select Date</h3>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {['18 WED', '19 THU', '20 FRI', '21 SAT', '22 SUN'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedDate(item)}
                    className={`flex-none w-16 h-20 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${selectedDate === item ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-50 text-slate-400'}`}
                  >
                    <span className="text-lg font-black">{item.split(' ')[0]}</span>
                    <span className="text-[8px] font-bold mt-0.5">{item.split(' ')[1]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-black text-slate-800 tracking-tight">Select Time</h3>
              <div className="flex flex-wrap gap-3">
                {['09:40', '11:00', '12:30', '15:00', '17:00'].map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-6 py-3 rounded-2xl border-2 font-bold text-[13px] transition-all ${selectedTime === time ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-black text-slate-800 tracking-tight">Type</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Online', 'In-Person'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setAppointmentType(type)}
                    className={`py-4 rounded-2xl border-2 font-black text-[11px] uppercase tracking-widest transition-all ${appointmentType === type ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
              <div>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Consultation Fee</p>
                <h2 className="text-3xl font-black text-slate-800">${doctor.price}</h2>
              </div>
              <button onClick={handleBookNow} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[35px] p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 transition-colors">
              <X size={20} />
            </button>
            <h3 className="text-xl font-black text-slate-800 mb-6">Confirm Booking</h3>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase">Slot</p>
                  <p className="text-slate-800 font-bold text-xs">{selectedDate}, {selectedTime}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase">Mode</p>
                  <p className="text-blue-600 font-bold text-xs">{appointmentType}</p>
                </div>
              </div>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 opacity-80">
                  <User size={16} className="text-slate-400" />
                  <span className="font-bold text-slate-600 text-sm">{currentUser.name}</span>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 opacity-80">
                  <Mail size={16} className="text-slate-400" />
                  <span className="font-bold text-slate-600 text-sm">{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-3 bg-white border-2 border-blue-500/30 p-4 rounded-2xl shadow-sm focus-within:border-blue-500 transition-all">
                  <Phone size={16} className="text-blue-500" />
                  <input
                    type="tel"
                    placeholder="Your Phone Number"
                    className="w-full outline-none font-bold text-slate-700 text-sm"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase hover:bg-slate-200">
                  Cancel
                </button>
                <button onClick={handleFinalBooking} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg hover:bg-blue-700 transition-all">
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Yeta hami flex-row use garera value lai side ma rakhtauchhau
const InfoRow = ({ label, value, icon }) => (
  <div className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
    <div className="flex items-center gap-2.5">
      <div className="p-1.5 bg-blue-50 rounded-lg text-blue-500">
        {icon}
      </div>
      <span className="font-bold text-slate-400 text-[9px] uppercase tracking-wider">{label}</span>
    </div>
    <span className="text-slate-800 font-black text-[11px] tracking-tight">
      {value || "N/A"}
    </span>
  </div>
);

const StatBox = ({ label, value, icon }) => (
  <div className="bg-white p-5 rounded-[25px] border border-slate-50 shadow-sm flex flex-col items-center gap-1 hover:shadow-md transition-shadow">
    <div className="text-blue-500 bg-blue-50 p-2 rounded-xl mb-1">{icon}</div>
    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{label}</p>
    <p className="text-md font-black text-slate-800 tracking-tight">{value}</p>
  </div>
);

export default DoctorDetailPage;