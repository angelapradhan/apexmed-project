import React, { useState, useRef, useEffect } from 'react';
import { User, Bell, Trash2, Camera, ShieldCheck, Mail, Lock, X, Eye, EyeOff } from 'lucide-react'; 
import { uploadProfilePictureApi, updateProfileApi, changePasswordApi } from '../services/api';
import { toast } from 'react-hot-toast';

const SettingsPage = () => {

  const [notifications, setNotifications] = useState(
    localStorage.getItem('notificationsEnabled') !== 'false' 
  );

  // state
  const [profilePreview, setProfilePreview] = useState("https://ui-avatars.com/api/?name=User&background=1b63fb&color=fff&size=128");
  const [fullName, setFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("...");
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Success");

  // Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Visibility Toggles 
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password Error Message
  const [passwordError, setPasswordError] = useState("");

  const fileInputRef = useRef(null);


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFullName(user.name || user.username || "User");
      setUserEmail(user.email || "No Email");
      setUserId(user.id || user._id);

      if (user.profilePicture) {
        setProfilePreview(`http://localhost:3000${user.profilePicture}`);
      }
    }
  }, []);


  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
      await handleUpload(file);
    }
  };

  // upload pp
  const handleUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await uploadProfilePictureApi(formData);
      if (response.data.success) {
        toast.success("Profile picture updated!");

        const user = JSON.parse(localStorage.getItem('user'));
        user.profilePicture = response.data.imageUrl;
        localStorage.setItem('user', JSON.stringify(user));

        setProfilePreview(`http://localhost:3000${response.data.imageUrl}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. " + (error.response?.data?.message || ""));
    }
  };


  const handleUpdateProfile = async () => {
    try {

      const response = await updateProfileApi({ name: fullName }); 

      if (response.data.success) {
        setModalTitle("Profile Updated");
        setModalMessage("Your profile name has been updated successfully!");                
        setIsModalOpen(true); 

        const user = JSON.parse(localStorage.getItem('user'));
        user.name = fullName; 
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      console.error("Update error:", error);

      toast.error("Failed to update profile. " + (error.response?.data?.message || ""));
    }
  };

  //chnage ps
  const handleChangePassword = async () => {

    setPasswordError("");
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      const response = await changePasswordApi({ 
        currentPassword, 
        newPassword 
      });

      if (response.data.success) {
        setModalTitle("Password Updated");
        setModalMessage("Your password has been changed successfully. Please log in again.");
        setIsModalOpen(true);

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError("");
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setTimeout(() => {
            window.location.href = '/login'; 
        }, 2000);
      }
    } catch (error) {
      console.error("Password update error:", error);

      setPasswordError(error.response?.data?.message || "Failed to change password");
    }
  };


  const handleNotificationToggle = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    localStorage.setItem('notificationsEnabled', newValue); 
    
    if (newValue) {
      toast.success("Notifications enabled!");
    } else {
      toast.error("Notifications disabled!");
    }
  };

  return (
    <div className="space-y-6">
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 relative">

            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-lg font-bold text-slate-800 mb-2">{modalTitle}</h3>
            <p className="text-sm text-slate-600 mb-5">{modalMessage}</p>
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Settings</h3>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-sm rounded-[24px] p-6 border border-white shadow-sm text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <img
                src={profilePreview}
                className="w-full h-full rounded-full object-cover border-4 border-slate-50 shadow-sm"
                alt="Profile"
              />

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white shadow-md hover:bg-blue-700 transition-all"
              >
                <Camera size={12} />
              </button>
            </div>

            <h4 className="text-sm font-bold text-slate-800">{fullName || "Loading..."}</h4>
            <div className="flex items-center justify-center gap-1.5 mt-1 text-slate-500">
              <Mail size={12} />
              <p className="text-[10px]">{userEmail || "Loading..."}</p>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-tight">ID: #{userId}</p>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-5">
          
          <div className="bg-white/80 backdrop-blur-sm rounded-[24px] p-6 border border-white shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 mb-5 flex items-center gap-2 uppercase tracking-tight">
              <User size={14} className="text-blue-600" /> Personal Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup
                label="Full Name"
                value={fullName}

                onChange={(e) => setFullName(e.target.value)}
              />
              <InputGroup
                label="Email Address"
                value={userEmail}
                disabled={true}
                title="You can't change your email"
              />
              <div className="md:col-span-2 flex justify-end mt-2">
                <button 

                  onClick={handleUpdateProfile} 
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl text-[11px] font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-[24px] p-6 border border-white shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 mb-5 flex items-center gap-2 uppercase tracking-tight">
              <Lock size={14} className="text-blue-600" /> Change Password
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="md:col-span-2 relative">
                <InputGroup 
                  label="Current Password" 
                  type={showCurrentPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <button 
                  type="button" 
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-9 text-slate-400 hover:text-blue-600"
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>


              <div className="relative">
                <InputGroup 
                  label="New Password" 
                  type={showNewPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-9 text-slate-400 hover:text-blue-600"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="relative">
                <InputGroup 
                  label="Confirm Password" 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-slate-400 hover:text-blue-600"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              

              {passwordError && (
                <div className="md:col-span-2 text-red-500 text-[10px] font-semibold -mt-2">
                  {passwordError}
                </div>
              )}
              
              <div className="md:col-span-2 flex justify-end mt-2">
                <button 
                  onClick={handleChangePassword} 
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl text-[11px] font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>

          {/* PREFERENCES BOX */}
          <div className="bg-white/80 backdrop-blur-sm rounded-[24px] p-6 border border-white shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 mb-5 flex items-center gap-2 uppercase tracking-tight">
              <ShieldCheck size={14} className="text-blue-600" /> Preferences
            </h4>
            <div className="space-y-3">

              <ToggleRow 
                icon={<Bell size={14} />} 
                title="Notifications" 
                desc="Alerts for appointments" 
                active={notifications} 
                onToggle={handleNotificationToggle}
              />
              
              <div className="flex items-center justify-between p-3 bg-red-50/30 rounded-xl border border-red-50 mt-4 group cursor-pointer hover:bg-red-50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100/50 text-red-500 rounded-lg">
                    <Trash2 size={14} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-red-600">Delete Account</p>
                    <p className="text-[9px] text-red-400 uppercase font-bold tracking-tighter">Remove all data permanently</p>
                  </div>
                </div>
                <button className="text-red-300 group-hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const InputGroup = ({ label, type = "text", value, onChange, placeholder, disabled = false, title }) => (
  <div className="flex flex-col gap-1.5" title={title}>
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-2 text-[11px] text-slate-700 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : 'hover:border-blue-100'}`}
    />
  </div>
);

const ToggleRow = ({ icon, title, desc, active, onToggle }) => (
  <div className="flex items-center justify-between p-3 bg-slate-50/30 rounded-xl border border-slate-50">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white text-blue-600 rounded-lg shadow-xs border border-slate-50">{icon}</div>
      <div>
        <p className="font-bold text-slate-700 text-[11px]">{title}</p>
        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">{desc}</p>
      </div>
    </div>
    <button onClick={onToggle} className={`w-9 h-5 rounded-full transition-all relative ${active ? 'bg-blue-600' : 'bg-slate-200'}`}>
      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${active ? 'right-1' : 'left-1'}`} />
    </button>
  </div>
);

export default SettingsPage;