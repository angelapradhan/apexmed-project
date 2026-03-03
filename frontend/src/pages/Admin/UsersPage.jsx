import React, { useEffect, useState } from 'react';
import { Search, Trash2, Calendar, X, UserRound } from 'lucide-react';
import { getAllUsersApi, deleteUserApi, createAppointmentApi } from '../../services/api';
import { toast } from 'react-hot-toast';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [appointmentData, setAppointmentData] = useState({
    doctorName: '',
    specialization: '',
    date: '',
    time: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsersApi();
      if (res.data.success) {
        const patientUsers = res.data.users.filter(u => u.role === 'user');
        setUsers(patientUsers);
      }
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...appointmentData, userId: selectedUser.id };
      const res = await createAppointmentApi(dataToSend);
      if (res.data.success) {
        toast.success(`Appointment set for ${selectedUser.username}`);
        setIsModalOpen(false);
        setAppointmentData({ doctorName: '', specialization: '', date: '', time: '' });
      }
    } catch (err) {
      toast.error("Failed to schedule appointment");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this user permanently?")) {
      try {
        const res = await deleteUserApi(id);
        if (res.data.success) {
          toast.success("User deleted successfully");
          fetchUsers();
        }
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="p-4 min-h-screen bg-[#F1F5F9]">

      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Management</h2>
          <p className="text-sm font-bold text-slate-800 leading-tight">Schedule appointments & manage accounts.</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search patients..." 
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none w-64 text-xs shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden p-3">
        <table className="w-full text-left">
          <thead className="border-b border-slate-50">
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">Patient</th>
              <th className="px-6 py-4">Email Address</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {users
              .filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <UserRound size={18} />
                      </div>
                      <span className="font-bold text-slate-700 text-xs">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-500 text-xs font-medium">{user.email}</td>
                  <td className="px-6 py-5 text-center">

                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-wider">Active</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center items-center gap-2">
                      <button 
                        onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="Schedule Appointment"
                      >
                        <Calendar size={16} />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (

        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative border border-slate-200 overflow-hidden flex flex-col text-left">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-tight">
                Schedule Appointment
              </h3>
              <button onClick={() => setIsModalOpen(false)}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-3">
              <p className="text-xs text-slate-500 font-bold -mb-1">For: <span className='text-slate-800'>{selectedUser?.username}</span></p>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Doctor Name</label>
                <input required type="text" placeholder="Dr. Name" className="w-full border border-slate-200 rounded-xl py-1.5 px-3 text-xs bg-slate-50/30 outline-none" 
                  onChange={(e) => setAppointmentData({...appointmentData, doctorName: e.target.value})} />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Specialization</label>
                <input required type="text" placeholder="e.g. Surgeon" className="w-full border border-slate-200 rounded-xl py-1.5 px-3 text-xs bg-slate-50/30 outline-none" 
                  onChange={(e) => setAppointmentData({...appointmentData, specialization: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Date</label>
                  <input required type="date" className="w-full border border-slate-200 rounded-xl py-1.5 px-3 text-xs bg-slate-50/30 outline-none text-slate-500" 
                    onChange={(e) => setAppointmentData({...appointmentData, date: e.target.value})} />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Time</label>
                  <input required type="time" className="w-full border border-slate-200 rounded-xl py-1.5 px-3 text-xs bg-slate-50/30 outline-none text-slate-500" 
                    onChange={(e) => setAppointmentData({...appointmentData, time: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-[10px] font-bold text-slate-400 uppercase">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-xl text-[10px] font-bold shadow-lg uppercase tracking-wider active:scale-95 transition-all">
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;