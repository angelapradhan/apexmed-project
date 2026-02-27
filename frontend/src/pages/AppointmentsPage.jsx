import React, { useEffect, useState } from 'react';
import { Star, Calendar, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchMyBookings();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#fcfdff]">
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen p-6 md:p-1 ">
      <div className="max-w-[1450px] mx-auto">
        
        {/* Page Header - Styled exactly like Dashboard Categories */}
        <div className="mb-8 text-left">
          <h1 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            My Appointments
          </h1>
        </div>

        {/* Appointments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
          {appointments.length > 0 ? appointments.map((item, idx) => (
            <div key={idx} className="group rounded-[42px] w-full">
              
              {/* Card Container - Fixed Height & Overflow */}
              <div className="bg-[#F0F7FF] rounded-[38px] p-6 h-[260px] flex flex-col relative overflow-hidden border border-white/50 shadow-sm transition-all hover:shadow-md">
                
                {/* Status Tag */}
                <div className="z-20 mb-3">
                  <span className="bg-white text-blue-600 text-[9px] font-black px-4 py-1.5 rounded-full shadow-sm uppercase tracking-widest">
                    {item.type || 'Online'}
                  </span>
                </div>

                {/* Content Section */}
                <div className="z-10 flex flex-col h-full text-left">
                  <h4 className="font-black text-slate-800 text-lg mb-0.5 truncate w-[60%]">
                    {item.doctorName}
                  </h4>
                  
                  {/* Date & Time */}
                  <div className="flex flex-col gap-0.5 mb-3">
                    <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[10px]">
                      <Calendar size={11} />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[10px]">
                      <Clock size={11} />
                      <span>{item.time}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-2 w-[60%] mb-4">
                    <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-xl flex-1 shadow-sm border border-white flex items-center justify-center gap-1">
                      <Star size={9} className="text-orange-400 fill-orange-400" />
                      <span className="text-[9px] font-black text-slate-800">4.8</span>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-xl flex-1 shadow-sm border border-white flex items-center justify-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <span className="text-[9px] font-black text-slate-800 uppercase">MBBS</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 z-30 relative w-[75%] mt-auto mb-1">
                    <button className="flex-1 bg-white hover:bg-slate-50 text-slate-800 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-sm border border-slate-100 transition-all active:scale-95">
                      Reschedule
                    </button>
                    <button className="flex-1 bg-[#FFF1F1] hover:bg-red-100 text-[#FF5B5B] py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95">
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Doctor Image - Border overlap fix */}
                <div className="absolute right-0 bottom-0 w-[135px] h-[210px] z-0 pointer-events-none">
                  <img
                    src={`http://localhost:3000/uploads/${item.doctorImage}`}
                    alt={item.doctorName}
                    className="w-full h-full object-cover object-top rounded-br-[38px]"
                    onError={(e) => e.target.src = "https://via.placeholder.com/300x400?text=No+Photo"}
                  />
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-100 flex flex-col items-center">
              <h3 className="text-slate-400 font-bold text-sm uppercase tracking-widest">No Appointments Found</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;