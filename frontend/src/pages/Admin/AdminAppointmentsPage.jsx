import React, { useEffect, useState } from 'react';
import { Plus, X, Trash2, Upload, Star, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllServicesApi, addServiceApi, deleteServiceApi, createNotificationApi } from '../../services/api';
import { toast } from 'react-hot-toast';

const AdminAppointmentsPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [price, setPrice] = useState('');
  const [doctorImage, setDoctorImage] = useState(null);
  const [rating, setRating] = useState('4.8');
  const [patients, setPatients] = useState('1500+');
  const [gender, setGender] = useState('Male');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [medicalLicense, setMedicalLicense] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  const fetchServices = async () => {
    try {
      const res = await getAllServicesApi();
      if (res.data.success) setServices(res.data.services || []);
    } catch (err) {
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!doctorImage) return toast.error("Please choose a photo first!");

    const data = new FormData();
    data.append('doctorName', doctorName);
    data.append('specialization', specialization);
    data.append('price', price);
    data.append('doctorImage', doctorImage);
    data.append('rating', rating);
    data.append('patients', patients);
    data.append('experience', experience);
    data.append('gender', gender);
    data.append('qualification', qualification);
    data.append('medicalLicense', medicalLicense);
    data.append('contact', contact);
    data.append('email', email);
    data.append('bio', bio);

    try {
      const res = await addServiceApi(data);
      if (res.data.success) {
        toast.success("Doctor Registered Successfully!");
        
        await createNotificationApi({
          userId: 'ADMIN', 
          title: "New Doctor Added",
          message: `Dr. ${doctorName} has been successfully added to the system.`,
          type: 'admin' 
        });
        
        setIsModalOpen(false);
        resetForm();
        fetchServices();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving doctor");
    }
  };
  
  const handleDelete = async (id, e) => {
    e.stopPropagation(); 
    if (window.confirm("Delete this doctor?")) {
      try {
        const res = await deleteServiceApi(id);
        if (res.data.success) {
          toast.success("Doctor deleted");
          fetchServices();
        }
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  const resetForm = () => {
    setDoctorName(''); setPrice(''); setDoctorImage(null);
    setExperience(''); setBio(''); setSpecialization('');
    setMedicalLicense(''); setContact(''); setEmail(''); setQualification('');
    setRating('4.8'); setPatients('1500+'); setGender('Male');
  };

  return (
    <div className="p-4 min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 px-2">
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Doctor Management</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-95">
          <Plus size={16} /> Add Doctor
        </button>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 text-left">
        {services.map((doc) => (
          <div 
            key={doc.id || doc._id} 
            onClick={() => navigate('/admin/doctor-details', { state: { doctor: doc } })} 
            className="relative group cursor-pointer transition-transform active:scale-[0.98]"
          >
            <button 
              onClick={(e) => handleDelete(doc.id || doc._id, e)} 
              className="absolute top-4 left-4 z-30 bg-white/90 text-red-500 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-red-50"
            >
              <Trash2 size={14} />
            </button>

            <div className="bg-[#F0F7FF] rounded-[32px] p-6 h-[200px] flex flex-col justify-between relative overflow-hidden border border-white/50 shadow-sm transition-all hover:shadow-md">
              <div className="z-10">
                <p className="text-[11px] text-slate-400 font-bold italic uppercase">{doc.specialization}</p>
                <h4 className="font-black text-slate-800 text-lg leading-tight">{doc.doctorName}</h4>
                <p className="text-blue-600 font-black text-md mt-1">${doc.price} <span className="text-slate-400 text-[10px]">/session</span></p>
              </div>

              <div className="flex gap-2 z-10 w-[65%]">
                <div className="bg-white/80 p-2 rounded-xl flex-1 border border-white shadow-sm">
                  <div className="flex items-center gap-1">
                    <Star size={10} className="text-orange-400 fill-orange-400"/>
                    <span className="text-[10px] font-bold text-slate-700">{doc.rating || '4.8'}</span>
                  </div>
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Rating</p>
                </div>
                <div className="bg-white/80 p-2 rounded-xl flex-1 border border-white shadow-sm">
                  <div className="flex items-center gap-1 text-blue-500">
                    <Briefcase size={10}/>
                    <span className="text-[10px] font-bold text-slate-700">{doc.experience || '8+ Yrs'}</span>
                  </div>
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Exp.</p>
                </div>
              </div>

              <div className="absolute right-[-10px] bottom-0 w-32 h-44 z-0">
                <img 
                  // base URL added for image 
                  src={`http://localhost:3000/uploads/${doc.doctorImage}`} 
                  className="w-full h-full object-cover object-top" 
                  alt="doc" 
                  onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* INFO MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-sm font-black text-slate-700 uppercase tracking-tight">Register New Doctor</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-all">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddService} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Full Name</label>
                  <input required className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-sm outline-none focus:border-blue-400 bg-slate-50/30" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="Dr. John Doe" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Speciality</label>
                  <input required className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-sm outline-none focus:border-blue-400 bg-slate-50/30" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="Cardiologist" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Rating (e.g. 4.8)</label>
                  <input required className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-sm outline-none focus:border-blue-400 bg-slate-50/30" value={rating} onChange={(e) => setRating(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Total Patients</label>
                  <input required className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-sm outline-none focus:border-blue-400 bg-slate-50/30" value={patients} onChange={(e) => setPatients(e.target.value)} />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Gender</label>
                  <select className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-sm outline-none focus:border-blue-400 bg-slate-50/30 font-bold" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Medical License</label>
                  <input required className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-sm outline-none focus:border-blue-400 bg-slate-50/30" value={medicalLicense} onChange={(e) => setMedicalLicense(e.target.value)} placeholder="MC-2088" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Experience (Yrs)</label>
                  <input required className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-sm outline-none focus:border-blue-400 bg-slate-50/30" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="10+ Years" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Qualification</label>
                  <input required className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-sm outline-none focus:border-blue-400 bg-slate-50/30" value={qualification} onChange={(e) => setQualification(e.target.value)} placeholder="MBBS, MD" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Contact No.</label>
                  <input required className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-sm outline-none focus:border-blue-400 bg-slate-50/30" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+977..." />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Email Address</label>
                  <input required type="email" className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-sm outline-none focus:border-blue-400 bg-slate-50/30" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="doc@apex.com" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">About (Bio)</label>
                <textarea className="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm outline-none focus:border-blue-400 bg-slate-50/30 min-h-[60px] resize-none" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Brief introduction..." />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Fee ($)</label>
                    <input required type="number" className="w-16 border-b border-slate-300 text-sm font-black text-blue-600 outline-none" value={price} onChange={(e) => setPrice(e.target.value)} />
                  </div>
                  <div className="relative">
                    <input required type="file" id="compactFile" className="hidden" onChange={(e) => setDoctorImage(e.target.files[0])} />
                    <label htmlFor="compactFile" className="cursor-pointer flex items-center gap-2 bg-slate-100 hover:bg-slate-200 py-1.5 px-3 rounded-lg transition-all">
                      <Upload size={14} className="text-slate-500"/>
                      <span className="text-[10px] font-bold text-slate-600 uppercase">{doctorImage ? "Selected" : "Photo"}</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-[11px] font-bold text-slate-400">Cancel</button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-[11px] font-bold shadow-md active:scale-95 transition-all uppercase tracking-wider">
                    Save Doctor
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointmentsPage;