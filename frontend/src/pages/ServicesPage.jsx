import React, { useEffect, useState } from 'react';
import { MapPin, Building2, CalendarDays } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // --- NEW: Import useNavigate ---
// Import your api function here, assuming you have it in services/api
import { getAllHospitalsApi } from "../services/api"; 

const ServicesPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // --- NEW: Initialize navigate ---

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        // Fetching all hospitals from backend
        const res = await getAllHospitalsApi();
        if (res.data.success) {
          setHospitals(res.data.hospitals || []);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Failed to fetch hospitals");
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#fcfdff]">
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Loading Hospitals...</p>
    </div>
  );

  return (
    <div className="min-h-screen p-6 md:p-1 bg-[#F1F5F9]">
      <div className="max-w-[1450px] mx-auto">
        
        {/* Page Header */}
        <div className="mb-8 text-left mt-6">
          <h1 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Available Hospitals
          </h1>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight mt-1">
            Find the Best Care
          </h2>
        </div>

        {/* Hospitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
          {hospitals.length > 0 ? hospitals.map((hosp, idx) => (
            <div 
              key={idx} 
              // --- NEW: Navigation logic ---
              onClick={() => navigate(`/hospital/detail`, { state: { hospital: hosp } })}
              // ----------------------------
              className="group rounded-[42px] w-full cursor-pointer"
            >
              
              {/* Card Container - Based on your Appointment Card style */}
              <div className="bg-white rounded-[38px] p-6 h-[260px] flex flex-col relative overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-lg hover:border-blue-100">
                
                {/* Type Tag */}
                <div className="z-20 mb-3">
                  <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-4 py-1.5 rounded-full shadow-inner uppercase tracking-widest">
                    {hosp.hospitalType || 'Private'}
                  </span>
                </div>

                {/* Content Section */}
                <div className="z-10 flex flex-col h-full text-left">
                  <h4 className="font-black text-slate-800 text-lg mb-0.5 truncate w-[70%]">
                    {hosp.hospitalName}
                  </h4>
                  
                  {/* Location & Established */}
                  <div className="flex flex-col gap-1 mb-3">
                    <div className="flex items-center gap-1.5 text-slate-600 font-bold text-[10px]">
                      <MapPin size={12} className="text-blue-500" />
                      <span>{hosp.city}, {hosp.province}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px]">
                      <CalendarDays size={12} />
                      <span>Est: {hosp.establishedYear || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Badges/Features */}
                  <div className="flex gap-2 w-[80%] mb-4">
                    <div className="bg-slate-50 backdrop-blur-sm px-2 py-1 rounded-xl flex-1 shadow-sm border border-slate-100 flex items-center justify-center gap-1">
                      <Building2 size={10} className="text-blue-400" />
                      <span className="text-[9px] font-black text-slate-800 truncate">
                        {hosp.departments ? hosp.departments.split(',')[0] : 'General'}
                      </span>
                    </div>
                    <div className="bg-slate-50 backdrop-blur-sm px-2 py-1 rounded-xl flex-1 shadow-sm border border-slate-100 flex items-center justify-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${hosp.icuAvailable === 'Yes' ? 'bg-green-500' : 'bg-red-400'}`}></div>
                      <span className="text-[9px] font-black text-slate-800 uppercase">
                        {hosp.icuAvailable === 'Yes' ? 'ICU' : 'No ICU'}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="z-30 relative w-[40%] mt-auto mb-1">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-md transition-all active:scale-95">
                      View Detail
                    </button>
                  </div>
                </div>

                {/* Hospital Cover Image */}
                <div className="absolute right-0 bottom-0 w-[150px] h-[210px] z-0 pointer-events-none">
                  <img
                    src={`http://localhost:3000/uploads/${hosp.coverImage}`}
                    alt={hosp.hospitalName}
                    className="w-full h-full object-cover object-center rounded-br-[38px]"
                    onError={(e) => e.target.src = "https://via.placeholder.com/300x400?text=No+Photo"}
                  />
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-100 flex flex-col items-center">
              <h3 className="text-slate-400 font-bold text-sm uppercase tracking-widest">No Hospitals Available</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;