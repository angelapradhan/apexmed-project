import React, { useEffect, useState } from 'react';
import { Users, Building2, UserRound, CalendarCheck } from 'lucide-react';
import { getUserCountApi, getAllAppointmentsApi, getAllServicesApi, getAllHospitalsApi, updateAppointmentStatusApi } from '../../services/api';

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [doctorCount, setDoctorCount] = useState(0);
  const [hospitalCount, setHospitalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Data fetch garne function 
  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, appRes, docRes, hospRes] = await Promise.all([
        getUserCountApi(),
        getAllAppointmentsApi(),
        getAllServicesApi(),
        getAllHospitalsApi()
      ]);

      if (statsRes.data.success) setUserCount(statsRes.data.count);
      if (appRes.data.success) setAppointments(appRes.data.appointments);
      if (docRes.data.success) setDoctorCount(docRes.data.services.length);
      if (hospRes.data.success) setHospitalCount(hospRes.data.hospitals.length);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Status 
  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
        const response = await updateAppointmentStatusApi(appointmentId, { status: newStatus });
        if (response.data.success) {
            fetchData();
            alert(`Status updated to ${newStatus}`);
        }
    } catch (error) {
        console.error("Error updating status:", error);
        alert("Failed to update status");
    }
  };

  return (
    <div className="p-4 min-h-screen bg-[#F1F5F9] relative z-0">
        <header className="mb-6 flex justify-between items-center px-2">
          <div>
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Admin Overview</h2>
            <p className="text-sm font-bold text-slate-800 leading-tight">Welcome back, Super Admin!</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard title="Total Users" count={loading ? "..." : userCount.toLocaleString()} icon={<Users className="text-blue-600" />} />
          <StatCard title="Total Hospitals" count={loading ? "..." : hospitalCount.toLocaleString()} icon={<Building2 className="text-purple-600" />} />
          <StatCard title="Total Doctors" count={loading ? "..." : doctorCount.toLocaleString()} icon={<UserRound className="text-emerald-600" />} />
          <StatCard title="Total Appointments" count={loading ? "..." : appointments.length.toLocaleString()} icon={<CalendarCheck className="text-orange-600" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3 bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-black text-slate-800 mb-5 pl-2">Recent Appointments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    <th className="px-6 pb-4">Patient</th>
                    <th className="px-6 pb-4">Target Name</th>
                    <th className="px-6 pb-4">Specialization</th>
                    <th className="px-6 pb-4">Date/Time</th>
                    <th className="px-6 pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-4 text-xs text-slate-500">Loading...</td></tr>
                  ) : appointments.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-4 text-xs text-slate-500">No appointments found.</td></tr>
                  ) : (
                    appointments.map(app => (
                        <TableRow 
                            key={app.id}
                            appointmentId={app.id} 
                            name={app.patientName} 
                            targetName={app.targetName || app.doctorName}
                            specialization={app.specialization || app.targetType || 'Doctor'}
                            date={`${app.date}, ${app.time}`}
                            status={app.status || 'Pending'} 
                            color={getStatusColor(app.status)}
                            onStatusChange={handleStatusChange} 
                        />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </div>
  );
};

const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
        case 'confirmed': return 'text-green-600 bg-green-50';
        case 'cancelled': return 'text-red-600 bg-red-50';
        default: return 'text-orange-600 bg-orange-50'; 
    }
}

const StatCard = ({ title, count, icon }) => (
  <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">{icon}</div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
    <h3 className="text-2xl font-black text-slate-800">{count}</h3>
  </div>
);

// TableRow 
const TableRow = ({ appointmentId, name, targetName, specialization, date, status, color, onStatusChange }) => (
  <tr className="border-b border-slate-50 group hover:bg-slate-50/50 transition-all">
    <td className="px-6 py-4 font-bold text-slate-700 text-xs">{name}</td>
    <td className="px-6 py-4 text-xs font-bold text-slate-500">{targetName}</td>
    <td className="px-6 py-4 text-xs font-bold text-blue-600 uppercase tracking-wider">{specialization}</td>
    <td className="px-6 py-4 text-slate-500 text-xs">{date}</td>
    <td className="px-6 py-4">
      
      {/* Dropdown to change status */}
      <select 
        value={status}
        onChange={(e) => onStatusChange(appointmentId, e.target.value)}
        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${color} border-none focus:ring-0 cursor-pointer`}
      >
        <option value="Pending" className="text-slate-700 bg-white">Pending</option>
        <option value="Confirmed" className="text-slate-700 bg-white">Confirmed</option>
        <option value="Cancelled" className="text-slate-700 bg-white">Cancelled</option>
      </select>
    </td>
  </tr>
);

export default AdminDashboard;