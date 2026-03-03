import React, { useEffect, useState } from 'react';
import { Star, Calendar, Clock, Trash2, MapPin, Building2, User } from 'lucide-react'; 
import { toast } from 'react-hot-toast';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBookings = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email) {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/user-bookings/${user.email}`);
        const result = await response.json();
        if (result.success) {
          setAppointments(result.data);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleDelete = async (appointmentId, type) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      const endpoint = type === 'hospital' ? 'hospital-bookings' : 'appointments';
      
      const response = await fetch(`http://localhost:3000/api/${endpoint}/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Appointment deleted successfully!");
        fetchMyBookings();
      } else {
        toast.error(result.message || "Failed to delete");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Server error while deleting");
    }
  };

  const doctorAppointments = appointments.filter(app => app.type !== 'hospital');
  const hospitalAppointments = appointments.filter(app => app.type === 'hospital');

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#fcfdff]">
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen p-6 md:p-2 bg-slate-50/50">
      <div className="max-w-[1450px] mx-auto">

        <div className="mb-12 text-left">

          <h1 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            My Appointments
          </h1>
          <br></br>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Your Doctor Bookings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-3">
            {doctorAppointments.length > 0 ? doctorAppointments.map((item, idx) => (
              <div key={idx} className="bg-[#F0F7FF] rounded-[38px] p-6 h-[210px] flex flex-col relative overflow-hidden border border-white/50 shadow-sm transition-all hover:shadow-md">
                <div className="z-20 mb-3 flex justify-between items-center">
                    <span className="bg-white text-slate-700 text-[10px] font-black px-4 py-1.5 rounded-full shadow-sm uppercase tracking-widest">Doctor</span>
                    <button onClick={() => handleDelete(item.id || item._id, item.type)} className="p-2 rounded-full bg-white text-red-500 hover:bg-red-50 transition-all"><Trash2 size={16} /></button>
                </div>
                <h4 className="font-black text-slate-800 text-base mb-1 truncate w-[70%]">{item.doctorName}</h4>
                <div className="flex flex-col gap-0.5 mb-3">
                    <div className="flex items-center gap-1.5 text-slate-600 font-bold text-[10px]"><Calendar size={12} /><span>{item.date}</span></div>
                    <div className="flex items-center gap-1.5 text-slate-600 font-bold text-[10px]"><Clock size={12} /><span>{item.time || 'N/A'}</span></div>
                </div>
                <div className="flex gap-2 z-30 relative w-[75%] mt-auto mb-1">
                    <button className="flex-1 bg-white hover:bg-slate-50 text-slate-800 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-slate-100 transition-all active:scale-95">Reschedule</button>
                </div>
                <div className="absolute right-[-10px] bottom-0 w-[135px] h-[170px] z-0 pointer-events-none">
                    <img src={`http://localhost:3000/uploads/${item.doctorImage || 'default_hosp.jpg'}`} className="w-full h-full object-cover object-top rounded-br-[38px]" onError={(e) => e.target.src = "https://via.placeholder.com/300x400?text=No+Photo"}/>
                </div>
              </div>
            )) : (
              <p className="text-slate-400 text-sm font-medium col-span-full bg-white p-6 rounded-2xl border border-slate-100">No doctor appointments found.</p>
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 my-12"></div>

        <div className="mb-8 text-left">

          <h1 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            My Bookings
          </h1>
          <br></br>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Your Hospital Bookings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-3">
            {hospitalAppointments.length > 0 ? hospitalAppointments.map((item, idx) => (

              <div key={idx} className="bg-white rounded-[38px] p-6 h-[210px] flex flex-col relative overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-md">
                

                <div className="z-20 mb-3 flex justify-between items-center">
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-4 py-1.5 rounded-full shadow-sm uppercase tracking-widest">
                        {item.department || 'Hospital'}
                    </span>
                    <button 
                        onClick={() => handleDelete(item.id || item._id, item.type)}
                        className="p-2 rounded-full bg-slate-100 text-red-500 hover:bg-red-50 transition-all"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                {/* Content */}
                <div className="z-10 flex flex-col h-full text-left">
                    <h4 className="font-black text-slate-800 text-base mb-1 truncate w-[70%]">
                        {item.hospitalName}
                    </h4>
                    
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <User size={12} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-700">Patient: {item.patientName || 'N/A'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 mb-4">
                        <Calendar size={12} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-700">{item.date}</span>
                    </div>

                    {/* Stats Boxes */}
                    <div className="flex gap-3 mb-4 mt-auto">
                        <div className="bg-slate-50 px-4 py-2 rounded-full shadow-inner border border-slate-100 flex-1 flex items-center justify-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-[11px] font-black text-slate-800">${item.fee || 'N/A'}</span>
                        </div>
                        <div className="bg-slate-50 px-4 py-2 rounded-full shadow-inner border border-slate-100 flex-1 flex items-center justify-center gap-2">
                            <Clock size={12} className="text-blue-500" />
                            <span className="text-[11px] font-black text-slate-800">{item.time || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="absolute right-0 top-0 w-[140px] h-full z-0 pointer-events-none opacity-5">
                    <Building2 size={120} className="text-slate-800 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )) : (
              <p className="text-slate-400 text-sm font-medium col-span-full bg-white p-6 rounded-2xl border border-slate-100">No hospital appointments found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;