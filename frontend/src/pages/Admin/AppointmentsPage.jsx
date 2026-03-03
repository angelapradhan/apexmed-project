import React, { useEffect, useState } from 'react';
import { Calendar, Plus, X, Stethoscope } from 'lucide-react';
import { getAllAppointmentsApi, addServiceApi } from '../../services/api'; 
import { toast } from 'react-hot-toast';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [formData, setFormData] = useState({
    doctorName: '', specialization: 'Orthopedic', price: '', doctorImage: '', availableTime: '9:00 AM'
  });

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen relative">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-800">System Appointments</h2>
          <p className="text-slate-400">Manage schedules and recommendations.</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg"
        >
          <Plus size={20} /> Add New Doctor
        </button>
      </div>


      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md p-8 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400"><X /></button>
            <h3 className="text-2xl font-black mb-6">Enter Doctor Details</h3>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              const res = await addServiceApi(formData);
              if(res.data.success) {
                toast.success("Doctor Added!");
                setIsModalOpen(false);
              }
            }} className="space-y-4">
              <input name="doctorName" placeholder="Name" onChange={(e) => setFormData({...formData, doctorName: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold" />
              <select name="specialization" onChange={(e) => setFormData({...formData, specialization: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold">
                <option value="Orthopedic">Orthopedic</option>
                <option value="Cardiologist">Cardiologist</option>
              </select>
              <input name="price" placeholder="Price (e.g. 36)" onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold" />
              <input name="doctorImage" placeholder="Image Link" onChange={(e) => setFormData({...formData, doctorImage: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold" />
              
              <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl">SAVE TO DATABASE</button>
            </form>
          </div>
        </div>
      )}

    
      {appointments.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
           <p className="text-slate-400 font-bold">No Appointments Scheduled. Try adding a doctor above!</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;