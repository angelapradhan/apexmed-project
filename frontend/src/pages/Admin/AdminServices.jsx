import React, { useEffect, useState } from 'react';
import { Plus, X, Trash2, Upload, MapPin, Phone } from 'lucide-react'; 
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Api, { addHospitalApi, getAllHospitalsApi, deleteHospitalApi } from "../../services/api";

const AdminServices = () => {
  const [hospitals, setHospitals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHospitalId, setEditingHospitalId] = useState(null);

  const navigate = useNavigate();

  const provinces = [
    "Koshi Province", "Madesh Province", "Bagmati Province",
    "Gandaki Province", "Lumbini Province", "Karnali Province", "Sudurpashchim Province"
  ];

  // Form States
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalType, setHospitalType] = useState('Private');
  const [establishedYear, setEstablishedYear] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState(provinces[2]);
  const [phone, setPhone] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [departments, setDepartments] = useState(['']);
  const [feeRange, setFeeRange] = useState('');
  const [emergency247, setEmergency247] = useState('Yes');
  const [icuAvailable, setIcuAvailable] = useState('Yes');
  const [hospitalLogo, setHospitalLogo] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const fetchHospitals = async () => {
    try {
      const res = await getAllHospitalsApi();
      if (res.data.success) setHospitals(res.data.hospitals || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchHospitals(); }, []);

  const handleAddHospital = async (e) => {
    e.preventDefault();
    if (!editingHospitalId && (!hospitalLogo || !coverImage)) return toast.error("Media required!");

    const data = new FormData();
    data.append('hospitalName', hospitalName);
    data.append('hospitalType', hospitalType);
    data.append('establishedYear', establishedYear);
    data.append('address', address);
    data.append('city', city);
    data.append('province', province);
    data.append('phone', phone);
    data.append('emergencyPhone', emergencyPhone);
    data.append('email', email);
    data.append('website', website);

    const deptString = departments.filter(d => d.trim() !== '').join(',');
    data.append('departments', deptString);

    data.append('feeRange', feeRange);
    data.append('emergency247', emergency247);
    data.append('icuAvailable', icuAvailable);

    if (hospitalLogo) data.append('hospitalLogo', hospitalLogo);
    if (coverImage) data.append('coverImage', coverImage);

    try {
      let res;
      if (editingHospitalId) {

        toast.error("Update API function not implemented in this example");
        return;
      } else {
        res = await addHospitalApi(data);
      }

      if (res.data.success) {
        toast.success(editingHospitalId ? "Hospital Updated!" : "Hospital Added!");
        setIsModalOpen(false);
        resetForm();
        fetchHospitals();
      }
    } catch (err) { toast.error("Error saving"); console.error(err); }
  };

  const resetForm = () => {
    setEditingHospitalId(null);
    setHospitalName(''); setHospitalType('Private'); setEstablishedYear('');
    setAddress(''); setCity(''); setProvince(provinces[2]); setPhone('');
    setEmergencyPhone(''); setEmail(''); setWebsite('');
    setDepartments(['']);
    setFeeRange(''); setEmergency247('Yes'); setIcuAvailable('Yes');
    setHospitalLogo(null); setCoverImage(null);
  };

  // Dynamic Input Functions
  const handleAddDepartmentField = () => { setDepartments([...departments, '']); };
  const handleRemoveDepartmentField = (index) => { setDepartments(departments.filter((_, i) => i !== index)); };
  const handleDepartmentChange = (index, value) => {
    const newDepartments = [...departments];
    newDepartments[index] = value;
    setDepartments(newDepartments);
  };

  // dlete
  const handleDeleteHospital = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Delete hospital?")) {
      try {
        const res = await deleteHospitalApi(id); 
        if (res.data.success) { 
            toast.success("Deleted"); 
            fetchHospitals(); 
        }
      } catch (err) { 
        console.error(err); 
        toast.error("Failed"); 
      }
    }
  };


  const handleEditClick = (hosp, e) => {
    e.stopPropagation();
    setEditingHospitalId(hosp.id);
    setHospitalName(hosp.hospitalName);
    setHospitalType(hosp.hospitalType);
    setEstablishedYear(hosp.establishedYear);
    setAddress(hosp.address);
    setCity(hosp.city);
    setProvince(hosp.province);
    setPhone(hosp.phone);
    setEmergencyPhone(hosp.emergencyPhone);
    setEmail(hosp.email);
    setWebsite(hosp.website);
    if (hosp.departments) setDepartments(hosp.departments.split(','));
    else setDepartments(['']);
    setFeeRange(hosp.feeRange);
    setEmergency247(hosp.emergency247);
    setIcuAvailable(hosp.icuAvailable);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 min-h-screen bg-[#F1F5F9]">
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Hospital Administration</h2>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95"
        >
          <Plus size={14} /> Add Hospital
        </button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {hospitals.map((hosp) => (
          <div
            key={hosp.id}
            onClick={() => navigate(`/admin/hospital-details`, { state: { hospital: hosp } })}
            className="bg-white rounded-[35px] shadow-sm border border-slate-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden cursor-pointer"
          >
            
            {/* cover image */}
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


              <div className="absolute top-3 right-3 z-10">
                  <button 
                      onClick={(e) => handleDeleteHospital(hosp.id, e)}
                      className="p-2 rounded-full bg-white/70 backdrop-blur-sm text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                      <Trash2 size={16} />
                  </button>
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
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative border border-slate-200 overflow-hidden max-h-[95vh] flex flex-col text-left">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-tight">
                {editingHospitalId ? "Edit Hospital" : "Hospital Registration"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleAddHospital} className="p-6 space-y-4 overflow-y-auto">

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1.5 flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Hospital Name</label>
                  <input required className="w-full border border-slate-200 rounded-xl py-1.5 px-3 text-xs bg-slate-50/30 outline-none" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Type</label>
                  <select className="w-full border border-slate-200 rounded-xl py-1.5 px-3 text-xs font-bold" value={hospitalType} onChange={(e) => setHospitalType(e.target.value)}>
                    <option value="Private">Private</option><option value="Government">Government</option><option value="Clinic">Clinic</option><option value="Multispeciality">Multispeciality</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Est. Year</label>
                  <input required className="w-full border border-slate-200 rounded-xl py-1.5 px-3 text-xs bg-slate-50/30" value={establishedYear} onChange={(e) => setEstablishedYear(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 border-t pt-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Province</label>
                  <select className="w-full border border-slate-200 rounded-xl py-1.5 px-3 text-xs font-bold" value={province} onChange={(e) => setProvince(e.target.value)}>
                    {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">City</label>
                  <input required className="border border-slate-200 rounded-xl py-1.5 px-3 text-xs bg-slate-50/30" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Full Address</label>
                  <input required className="border border-slate-200 rounded-xl py-1.5 px-3 text-xs bg-slate-50/30" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 border-t pt-4">
                <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Phone</label>
                  <input required className="border border-slate-200 rounded-xl py-1.5 px-3 text-xs bg-slate-50/30" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Emergency No.</label>
                  <input required className="border border-slate-200 rounded-xl py-1.5 px-3 text-xs bg-slate-50/30" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Official Email</label>
                  <input required type="email" className="border border-slate-200 rounded-xl py-1.5 px-3 text-xs bg-slate-50/30" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Website</label>
                  <input className="border border-slate-200 rounded-xl py-1.5 px-3 text-xs bg-slate-50/30" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Departments</label>
                    <button type="button" onClick={handleAddDepartmentField} className="flex items-center gap-1 text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
                      <Plus size={10} /> Add
                    </button>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                    {departments.map((dept, index) => (
                      <div key={index} className="flex gap-2">
                        <input required className="flex-1 border border-slate-200 rounded-xl py-1.5 px-3 text-xs bg-slate-50/30" placeholder="e.g. Cardiology" value={dept} onChange={(e) => handleDepartmentChange(index, e.target.value)} />
                        {departments.length > 1 && (
                          <button type="button" onClick={() => handleRemoveDepartmentField(index)} className="text-red-400 hover:text-red-600">
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Fee Range</label>
                    <input required className="border border-slate-200 rounded-xl py-1.5 px-3 text-xs bg-slate-50/30" value={feeRange} onChange={(e) => setFeeRange(e.target.value)} placeholder="500-1500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Emergency (24/7)</label>
                      <select className="border border-slate-200 rounded-xl py-1 px-2 text-xs font-bold" value={emergency247} onChange={(e) => setEmergency247(e.target.value)}>
                        <option value="Yes">Yes</option><option value="No">No</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1"><label className="text-[9px] font-bold text-slate-400 uppercase">ICU Available</label>
                      <select className="border border-slate-200 rounded-xl py-1 px-2 text-xs font-bold" value={icuAvailable} onChange={(e) => setIcuAvailable(e.target.value)}>
                        <option value="Yes">Yes</option><option value="No">No</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 border-t pt-4">
                <label className="cursor-pointer flex items-center justify-between border border-dashed border-slate-200 rounded-xl p-3 hover:bg-blue-50 transition-colors">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">{hospitalLogo ? "Logo Selected ✅" : "Upload Logo"}</span>
                  <Upload size={14} className="text-slate-400" />
                  <input type="file" className="hidden" onChange={(e) => setHospitalLogo(e.target.files[0])} />
                </label>
                <label className="cursor-pointer flex items-center justify-between border border-dashed border-slate-200 rounded-xl p-3 hover:bg-blue-50 transition-colors">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">{coverImage ? "Cover Selected ✅" : "Upload Cover"}</span>
                  <Upload size={14} className="text-slate-400" />
                  <input type="file" className="hidden" onChange={(e) => setCoverImage(e.target.files[0])} />
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-[10px] font-bold text-slate-400 uppercase">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-xl text-[10px] font-bold shadow-lg uppercase tracking-wider active:scale-95 transition-all">
                  {editingHospitalId ? "Update Hospital" : "Save Hospital"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;