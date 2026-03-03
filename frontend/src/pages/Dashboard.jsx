import React, { useEffect, useState } from 'react';
import {
  Heart, Calendar, Star, Users, Building2,
  Stethoscope, Activity, Bone, Microscope, Brain, Zap, Search,
  Clock, Video, User, MapPin, CalendarDays, Phone // Added Phone
} from 'lucide-react';
import { getAllServicesApi, getAllHospitalsApi } from '../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpec, setSelectedSpec] = useState('All');
  
  // search Query State
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const res = await getAllServicesApi();
        if (res.data && res.data.success) {
          setDoctors(res.data.services);
        }

        // Fetch Hospitals
        const hospRes = await getAllHospitalsApi();
        if (hospRes.data && hospRes.data.success) {
          setHospitals(hospRes.data.hospitals || []);
        }

      } catch (err) {
        toast.error("Failed to connect to server");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchMyBookings = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.email) {
        try {
          const response = await fetch(`http://localhost:3000/api/user-bookings/${user.email}`);
          const result = await response.json();
          if (result.success) {
            setUpcomingSchedules(result.data);
          }
        } catch (err) {
          console.error("Error fetching schedules:", err);
        }
      }
    };
    fetchMyBookings();
  }, []);


  const filteredDoctors = doctors.filter(doc => {
    const matchesSpec = selectedSpec === 'All' || doc.specialization.toLowerCase().includes(selectedSpec.toLowerCase());
    const matchesSearch = doc.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpec && matchesSearch;
  });

  const filteredHospitals = hospitals.filter(hosp => {
    const matchesSpec = selectedSpec === 'All' || (hosp.departments && hosp.departments.toLowerCase().includes(selectedSpec.toLowerCase()));
    const matchesSearch = hosp.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (hosp.departments && hosp.departments.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSpec && matchesSearch;
  });

  const doctorBookings = upcomingSchedules.filter(item => item.type === 'doctor');
  const hospitalBookings = upcomingSchedules.filter(item => item.type === 'hospital');

  if (loading) return <div className="p-10 text-center font-bold text-blue-600">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen p-4 md:p-1 bg-slate-50/50">
      <div className="max-w-[1450px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-9">

          {/* Top Header */}
          <div className="flex flex-row items-center justify-between gap-4 mb-8">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              
              {/* Search Input Field */}
              <input
                type="text"
                placeholder="Search doctors or hospitals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium text-slate-800 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-slate-50 shrink-0">
              <Calendar size={16} className="text-blue-500" />
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          {/* Categories Section */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Browse Categories
              </h2>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <button onClick={() => setSelectedSpec('All')} className={`flex-none flex flex-col items-center justify-center w-20 h-24 rounded-[24px] border transition-all duration-300 ${selectedSpec === 'All' ? 'bg-white border-blue-500 shadow-md ring-4 ring-blue-50' : 'bg-white border-transparent shadow-sm hover:border-slate-200'}`}>
                <div className={`p-2.5 rounded-xl mb-2 ${selectedSpec === 'All' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}><Users size={18} /></div>
                <span className={`text-[10px] font-black ${selectedSpec === 'All' ? 'text-blue-600' : 'text-slate-500'}`}>All</span>
              </button>
              {[
                { name: 'GP', icon: <Stethoscope size={18} /> },
                { name: 'Cardio', icon: <Activity size={18} /> },
                { name: 'Ortho', icon: <Bone size={18} /> },
                { name: 'Oncology', icon: <Microscope size={18} /> },
                { name: 'Dentist', icon: <Zap size={18} /> },
                { name: 'Neuro', icon: <Brain size={18} /> },
                { name: 'Pediatric', icon: <Heart size={18} /> },
                { name: 'Radio', icon: <Activity size={18} /> },
              ].map((spec) => (
                <button
                  key={spec.name}
                  onClick={() => setSelectedSpec(spec.name)}
                  className={`flex-none flex flex-col items-center justify-center w-20 h-24 rounded-[24px] border transition-all duration-300 ${selectedSpec === spec.name ? 'bg-white border-blue-500 shadow-md ring-4 ring-blue-50' : 'bg-white border-transparent shadow-sm hover:border-slate-200'}`}>
                  <div className={`p-2.5 rounded-xl mb-2 ${selectedSpec === spec.name ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                    {spec.icon}
                  </div>
                  <span className={`text-[10px] font-black tracking-tight ${selectedSpec === spec.name ? 'text-blue-600' : 'text-slate-500'}`}>{spec.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recommended Doctors */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Recommended Doctors</h2>
              <span className="text-blue-600 font-bold text-xs cursor-pointer">See All</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDoctors.length > 0 ? filteredDoctors.map((doc) => (
                <div
                  key={doc.id || doc._id}
                  onClick={() => navigate('/doctor-details', { state: { doctor: doc } })}
                  className="group rounded-[42px] cursor-pointer transition-all active:scale-95 w-full"
                >
                  <div className="bg-[#F0F7FF] rounded-[38px] p-6 h-[210px] flex flex-col justify-between relative overflow-hidden border border-white/50 shadow-sm">
                    <div className="z-20"><span className="bg-white text-slate-700 text-[10px] font-black px-4 py-1.5 rounded-full shadow-sm">Online</span></div>
                    <div className="flex-1 mt-3 z-10">
                      <p className="text-[12px] text-slate-400 font-bold mb-0.5">{doc.specialization}</p>
                      <h4 className="font-black text-slate-800 text-base mb-1 leading-tight truncate w-[60%]">{doc.doctorName}</h4>
                      <p className="text-blue-600 font-black text-lg mb-4">${doc.price} <span className="text-slate-400 text-xs font-bold">/session</span></p>
                      <div className="flex gap-2 w-[65%]">
                        <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-xl flex-1 shadow-sm border border-white"><div className="flex items-center gap-1"><Star size={10} className="text-orange-400 fill-orange-400" /><span className="text-[10px] font-black text-slate-800">{doc.rating || '4.8'}</span></div></div>
                        <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-xl flex-1 shadow-sm border border-white"><div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-[10px] font-black text-slate-800">MBBS</span></div></div>
                      </div>
                    </div>
                    <div className="absolute right-[-5px] bottom-0 w-32 h-44 z-0"><img src={`http://localhost:3000/uploads/${doc.doctorImage}`} alt={doc.doctorName} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" onError={(e) => e.target.src = "https://via.placeholder.com/300"} /></div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-10 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-bold">No doctors found.</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Recommended Hospitals</h2>
              <span className="text-blue-600 font-bold text-xs cursor-pointer">See All</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
              {filteredHospitals.length > 0 ? filteredHospitals.map((hosp) => (
                <div
                  key={hosp.id || hosp._id}
                  onClick={() => navigate('/hospital-details', { state: { hospital: hosp } })}
                  className="bg-white rounded-[35px] shadow-sm border border-slate-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden cursor-pointer"
                >
                    
                    <div className="relative h-40">
                      <img
                        src={`http://localhost:3000/uploads/${hosp.coverImage}`}
                        className="w-full h-full object-cover"
                        alt={hosp.hospitalName}
                        onError={(e) => e.target.src = "https://via.placeholder.com/600x200"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-white/70 backdrop-blur-sm text-slate-800 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                          {hosp.hospitalType || 'Hospital'}
                        </span>
                      </div>
                      
                      <div className="absolute -bottom-6 left-5 w-16 h-16 rounded-3xl overflow-hidden bg-white border-4 border-white shadow-xl">
                          <img
                            src={`http://localhost:3000/uploads/${hosp.hospitalLogo}`}
                            className="w-full h-full object-contain p-1"
                            alt={hosp.hospitalName}
                            onError={(e) => e.target.src = "https://via.placeholder.com/50"}
                          />
                      </div>
                    </div>

                    <div className="p-5 pt-8 text-left">

                        <h4 className="font-black text-slate-800 text-lg mb-1 truncate group-hover:text-blue-600 transition-colors">
                            {hosp.hospitalName || "Loading..."}
                        </h4>

                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                            <span className="text-[11px] font-bold text-slate-700 truncate">
                                {hosp.city 
                                  ? `${hosp.city}, ${hosp.province}`
                                  : "Location loading..."}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-600">
                            <Phone size={14} className="text-slate-400 flex-shrink-0" />
                            <span className="text-[11px] font-bold text-slate-700">
                                {hosp.phone || "No phone listed"}
                            </span>
                        </div>
                    </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-10 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-bold">No hospitals found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-100 rounded-[30px] p-5 shadow-sm sticky top-6">

            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-4">
              Upcoming Appointments <span className="text-blue-600">({doctorBookings.length})</span>
            </h3>
            <div className="space-y-4 mb-6">
              {doctorBookings.length > 0 ? doctorBookings.slice(0, 2).map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-50 p-3 rounded-[25px] shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <User size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-[11px] font-black text-slate-800 truncate">{item.doctorName}</h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase truncate">{item.type || 'Consultation'}</p>
                    </div>
                    {item.type === 'Online' && (
                      <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md"><Video size={14} /></button>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 bg-slate-50 rounded-xl p-2 px-3">
                    <div className="flex items-center gap-2"><Calendar size={11} className="text-blue-600" /><span className="text-[10px] font-bold text-slate-700">{item.date}</span></div>
                    <div className="flex items-center gap-2"><Clock size={11} className="text-blue-600" /><span className="text-[10px] font-bold text-slate-700">{item.time || 'N/A'}</span></div>
                  </div>
                </div>
              )) : (
                <p className="text-[10px] text-slate-400 font-bold text-center py-4 bg-slate-50 rounded-2xl">No doctor appointments.</p>
              )}
            </div>

            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-4 border-t border-slate-100 pt-6">
              Upcoming Hospital Bookings <span className="text-blue-600">({hospitalBookings.length})</span>
            </h3>
            <div className="space-y-4">
              {hospitalBookings.length > 0 ? hospitalBookings.slice(0, 2).map((item, idx) => (
                <div key={idx} className="bg-blue-50 border border-blue-100 p-3 rounded-[25px] shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
                      <Building2 size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-[11px] font-black text-slate-800 truncate">{item.hospitalName}</h4>
                      <p className="text-[9px] text-blue-600 font-bold uppercase truncate">{item.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-xl p-2 px-3 w-fit shadow-sm">
                    <CalendarDays size={11} className="text-blue-600" />
                    <span className="text-[10px] font-bold text-slate-700">{item.date}</span>
                  </div>
                </div>
              )) : (
                <p className="text-[10px] text-slate-400 font-bold text-center py-4 bg-slate-50 rounded-2xl">No hospital bookings.</p>
              )}
            </div>

            <button className="w-full text-center mt-8 py-2 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">View All Schedule</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;