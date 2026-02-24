import React, { useEffect, useState } from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { getMyAppointmentsApi , getAllServicesApi} from '../services/api'; // API import
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]); //doctors ko lagi 
  const [loading, setLoading] = useState(true);

  // Database bata data tanne function
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Dubai API parallel ma call garne
        const [aptRes, docRes] = await Promise.all([
          getMyAppointmentsApi(),
          getAllServicesApi() 
        ]);

        console.log("Doctors Response:", docRes.data);

        if (aptRes.data.success) {
          setAppointments(aptRes.data.appointments);
        }
        
        if (docRes.data.success) {
          setDoctors(docRes.data.services); // Admin le thapeko services yaha bascha
        }
      } catch (err) {
        console.error("API Error:", err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT COLUMN: Real Dynamic Treatment Cards */}
      <div className="lg:col-span-1 space-y-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Your treatment</h3>

        {loading ? (
          <p className="text-xs text-slate-400">Loading your treatments...</p>
        ) : appointments.length > 0 ? (
          appointments.map((apt) => (
            <TreatmentCard
              key={apt.id}
              doctor={apt.doctorName}
              spec={apt.specialization}
              date={apt.date}
              time={apt.time}
              // Database image chaina bhane default UI-Avatar use garne
              img={`https://ui-avatars.com/api/?name=${apt.doctorName}&background=random`}
            />
          ))
        ) : (
          <div className="p-6 bg-white/50 rounded-[28px] border border-dashed border-slate-200 text-center">
             <p className="text-xs text-slate-400 font-bold">No appointments scheduled by Admin yet.</p>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Choose Doctor & Schedule */}
      <div className="lg:col-span-2 space-y-8">
        <section>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Choose a doctor</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* 2. Dynamic Doctors List yaha aauchha */}
            {doctors.length > 0 ? (
              doctors.map((doc) => (
                <DoctorTinyCard 
                  key={doc.id} 
                  name={doc.doctorName} 
                  spec={doc.specialization} 
                />
              ))
            ) : (
              <p className="text-xs text-slate-400 col-span-4 py-4">No doctors added in services yet.</p>
            )}
          </div>
        </section>

        {/* Schedule Section */}
        <section className="bg-white/60 backdrop-blur-md rounded-[32px] p-8 border border-white shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Schedule again</h3>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white transition-all">{"<"}</button>
              <button className="p-2 rounded-lg bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white transition-all">{">"}</button>
            </div>
          </div>

          {/* Simple Calendar Strip */}
          <div className="grid grid-cols-7 gap-2 mb-8 text-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className={`p-3 rounded-2xl ${i === 3 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500'}`}>
                <div className="text-[10px] uppercase font-bold opacity-70">{day}</div>
                <div className="text-lg font-bold">{5 + i}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-3">
            {['08:00 am', '08:30 am', '09:00 am', '09:30 am', '10:00 am', '10:30 am'].map((time) => (
              <button key={time} className="py-2 border border-slate-100 rounded-xl text-xs font-semibold text-slate-600 hover:border-blue-500 hover:text-blue-500 transition-all">
                {time}
              </button>
            ))}
          </div>

          <button className="w-full mt-8 bg-blue-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all">
            Book Appointment
          </button>
        </section>
      </div>
    </div>

  );
};

// --- SUB-COMPONENTS ---

const SidebarIcon = ({ icon, active = false }) => (
  <div className={`p-3 rounded-2xl cursor-pointer transition-all ${active ? 'bg-blue-50 text-blue-600 shadow-sm' : 'hover:bg-slate-50'}`}>
    {icon}
  </div>
);

const TreatmentCard = ({ doctor, spec, date, time, img, color = "bg-blue-50" }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-[28px] p-6 shadow-sm border border-white flex flex-col gap-4">
    <div className="flex items-center gap-4">
      <img src={img} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt={doctor} />
      <div>
        <h4 className="font-bold text-slate-800 text-sm">{doctor}</h4>
        <p className="text-[11px] text-slate-400 font-medium">{spec}</p>
      </div>
    </div>
    <div className="flex gap-2">
      <div className="flex-1 bg-slate-50 p-3 rounded-2xl">
        <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">Date</div>
        <div className="text-xs font-bold text-slate-700">{date}</div>
      </div>
      <div className="flex-1 bg-slate-50 p-3 rounded-2xl">
        <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">Time</div>
        <div className="text-xs font-bold text-slate-700">{time}</div>
      </div>
    </div>
    <div className="flex gap-2">
      <button className="flex-1 bg-blue-600 text-white text-[11px] font-bold py-2.5 rounded-xl">Appointment</button>
      <button className="p-2.5 bg-orange-50 text-orange-400 rounded-xl"><Phone size={16} /></button>
      <button className="p-2.5 bg-blue-50 text-blue-400 rounded-xl"><MessageSquare size={16} /></button>
    </div>
  </div>
);



export default Dashboard;