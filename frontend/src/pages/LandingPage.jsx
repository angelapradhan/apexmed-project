import React from 'react';
import { 
  Activity, Heart, Calendar, MapPin, Users, 
  Stethoscope, Shield, Clock, Search, ChevronRight
} from 'lucide-react';

// --- Assets ---
// Ensure you have your doctor image in this path
import doctorImg from '../assets/doctor.png';

const LandingPage = ({ onLoginClick, onRegisterClick }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      
      {/* --- 1. NAVIGATION --- */}
      <nav className="flex items-center justify-between px-6 md:px-20 py-6 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
          <Activity className="text-blue-500" size={30} />
          <span className="text-2xl font-bold text-[#2d3e50] tracking-tight">ApexMed</span>
        </div>
        <div className="hidden lg:flex items-center gap-8 text-[15px] font-semibold text-slate-500">
          <a href="#" className="hover:text-blue-500 transition-colors">About</a>
          <a href="#" className="hover:text-blue-500 transition-colors">Services</a>
          <a href="#" className="hover:text-blue-500 transition-colors">Doctors</a>
          <a href="#" className="hover:text-blue-500 transition-colors">Blog</a>
          <a href="#" className="hover:text-blue-500 transition-colors">Contact</a>
        </div>
        <button 
          onClick={onRegisterClick} 
          className="px-7 py-2.5 bg-blue-500 text-white font-bold rounded-full shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all active:scale-95"
        >
          Appointment
        </button>
      </nav>

      {/* --- 2. HERO SECTION --- */}
      <header className="px-6 md:px-20 py-12 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-7 z-10 text-center md:text-left">
            <span className="text-blue-400 font-bold text-xs tracking-[0.3em] uppercase">Medical</span>
            <h1 className="text-6xl md:text-8xl font-extrabold text-[#2d3e50] leading-[1.1]">
              Healthcare <br /> Solutions
            </h1>
            <p className="text-slate-400 text-base max-w-sm leading-relaxed mx-auto md:mx-0">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Ab iste eum quam dolores quia possimus incidunt placeat sapiente eaque.
            </p>
            <button className="px-10 py-4 bg-blue-500 text-white rounded-full font-bold shadow-xl shadow-blue-200 hover:-translate-y-1 transition-transform">
              Find Doctors
            </button>
          </div>

          <div className="md:w-1/2 relative flex justify-center mt-16 md:mt-0">
             {/* Large background circle */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-112.5 h-112.5 md:w-137.5 md:h-137.5 bg-[#eef7ff] rounded-full -z-10" />
             <div className="relative">
                <img src={doctorImg} alt="Doctor" className="h-125 md:h-150 object-contain" />
                {/* Floating Heart Icon */}
                <div className="absolute top-20 right-0 bg-white p-4 rounded-2xl shadow-2xl text-blue-500 border border-slate-50">
                    <Heart fill="currentColor" size={28} />
                </div>
                {/* Floating Stethoscope Icon */}
                <div className="absolute bottom-32 left-0 bg-white p-4 rounded-2xl shadow-2xl text-blue-500 border border-slate-50">
                    <Activity size={28} />
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* --- 3. QUICK ACTION CARDS (Blue Overlap) --- */}
      <section className="px-6 md:px-20 -mt-12 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-500 p-8 rounded-[40px] text-white shadow-2xl shadow-blue-200">
             <div className="flex justify-between items-start mb-12">
                <div>
                    <h4 className="font-bold text-xl">Opening Hours</h4>
                    <p className="text-xs text-blue-100 mt-6 mb-1">Monday - Friday</p>
                    <p className="text-lg font-bold">9:00am - 12:00pm</p>
                </div>
                <Clock size={36} className="opacity-80" />
             </div>
             <p className="text-[11px] opacity-60">Informatica Nederland B.V.</p>
          </div>
          <ActionCard title="Appointment" icon={<Calendar size={22}/>} btn="Request" />
          <ActionCard title="Find Doctors" icon={<Users size={22}/>} btn="Doctors" />
          <ActionCard title="Find Locations" icon={<MapPin size={22}/>} btn="Locations" />
        </div>
      </section>

      {/* --- 4. MEDICAL SERVICES (The Circle Thing) --- */}
      <section className="py-28 px-6 md:px-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-blue-400 font-bold text-xs uppercase tracking-[0.4em]">Service</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d3e50] mt-3">Our Medical Services</h2>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-20">
            {/* The Circular Layout with floating tags */}
            <div className="lg:w-1/2 relative flex justify-center items-center h-137.5 w-full">
              <div className="absolute w-75 h-120 bg-blue-500 rounded-full flex items-end justify-center overflow-hidden shadow-[0_20px_50px_rgba(59,130,246,0.3)]">
                 <img src={doctorImg} alt="Doctor" className="h-[95%] w-auto object-contain translate-y-6" />
              </div>

              {/* Tag positions matched to your image */}
              <ServiceTag text="Eye Care" position="top-10 left-4 md:left-12" icon={<Activity size={14}/>} />
              <ServiceTag text="Medicine" position="top-1/2 -left-8 md:left-4 -translate-y-1/2" icon={<Stethoscope size={14}/>} />
              <ServiceTag text="Orthopedic" position="bottom-10 left-4 md:left-12" icon={<Heart size={14}/>} />
              
              <ServiceTag text="Cardiology" position="top-1/4 -right-8 md:right-8" icon={<Activity size={14}/>} isRight />
              <ServiceTag text="Dental" position="bottom-1/3 -right-4 md:right-4" icon={<Activity size={14}/>} isRight />
            </div>

            <div className="lg:w-1/2 space-y-8">
              <h3 className="text-4xl font-bold text-[#2d3e50]">Dental Care Service</h3>
              <p className="text-slate-400 leading-relaxed text-lg max-w-lg">
                Lorem ipsum dolor sit amet consectetur adipiscing elit. Ab iste eum quam dolores quia possimus incidunt placeat sapiente eaque aspernatur aut, quaerat in. Eos in animi aliquam cupiditate tempora iste.
              </p>
              <button className="px-10 py-3.5 bg-blue-500 text-white rounded-full font-bold shadow-lg shadow-blue-100 hover:scale-105 transition-all">
                Learn more
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. SPECIALITY BANNER (Online Appointment) --- */}
      <section className="py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">Features</span>
            <h2 className="text-4xl font-bold text-[#2d3e50] mt-2">Our Speciality</h2>
          </div>
          
          <div className="bg-blue-500 rounded-[50px] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between text-white relative overflow-hidden shadow-2xl shadow-blue-100">
             <div className="text-left space-y-6 md:w-1/2 z-10">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Calendar size={28} />
                </div>
                <h3 className="text-4xl font-bold">Online Appointment</h3>
                <p className="text-blue-100 text-lg opacity-90 max-w-sm">Lorem ipsum dolor sit amet consectetur adipiscing elit. Ab iste eum quam dolores.</p>
                <button className="px-8 py-3 bg-white text-blue-500 rounded-full font-bold hover:shadow-lg transition-all">Learn more</button>
             </div>
             <div className="md:w-1/2 flex justify-end mt-12 md:mt-0 relative">
                <div className="bg-white/10 p-20 rounded-full absolute -right-20 -bottom-20 blur-3xl" />
                <Stethoscope size={240} className="text-white/20 rotate-30" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <Activity size={100} className="text-white animate-pulse" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- 6. TIME TABLE (3D Calendar) --- */}
      <section className="py-28 px-6 md:px-20 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-24">
          <div className="md:w-1/2 space-y-7 order-2 md:order-1">
            <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">Time Table</span>
            <h2 className="text-5xl font-bold text-[#2d3e50] leading-tight">Appointment <br /> Schedules</h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Ab iste eum quam dolores quia possimus incidunt placeat sapiente eaque aspernatur aut.
            </p>
            <button className="px-10 py-3.5 bg-blue-500 text-white rounded-full font-bold shadow-lg shadow-blue-100">Schedules</button>
          </div>
          
          <div className="md:w-1/2 flex justify-center order-1 md:order-2">
             <div className="bg-blue-500 w-72 h-80 rounded-[50px] relative shadow-[30px_30px_60px_-15px_rgba(59,130,246,0.3)]">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[85%] h-[90%] bg-white rounded-4xl shadow-xl p-6">
                    <div className="flex gap-2 mb-6">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <div className="w-3 h-3 rounded-full bg-blue-200" />
                        <div className="w-3 h-3 rounded-full bg-blue-100" />
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className={`h-8 rounded-lg ${i < 5 ? 'bg-blue-500' : 'bg-blue-50'}`} />
                        ))}
                    </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-400 rounded-full blur-3xl opacity-40" />
             </div>
          </div>
        </div>
      </section>

      {/* --- 7. DOCTORS GRID --- */}
      <section className="py-28 px-6 md:px-20 bg-[#f8fbff]">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-blue-400 font-bold text-xs uppercase tracking-[0.4em]">Team</span>
          <h2 className="text-4xl font-bold text-[#2d3e50] mt-3 mb-16">Our Doctors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             <DoctorCard name="Mamman Bo" role="Cardiologist" />
             <DoctorCard name="Reda Siana" role="Cardiologist" />
             <DoctorCard name="Yaroslav Hawa" role="Cardiologist" />
          </div>
          <button className="mt-16 px-12 py-3 bg-blue-500 text-white rounded-full font-bold shadow-lg hover:shadow-blue-200 transition-all">See All</button>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 bg-white text-center border-t border-slate-100">
          <p className="text-slate-400 text-sm">© 2026 ApexMed Healthcare Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const ActionCard = ({ title, icon, btn }) => (
  <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-slate-100 border border-slate-50 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform">
    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors">
      {icon}
    </div>
    <h4 className="font-bold text-[#2d3e50] text-lg mb-3">{title}</h4>
    <p className="text-xs text-slate-400 mb-8 leading-relaxed">Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
    <button className="w-full py-2.5 bg-[#f0f7ff] text-blue-500 rounded-full text-xs font-bold hover:bg-blue-500 hover:text-white transition-all">
      {btn}
    </button>
  </div>
);

const ServiceTag = ({ text, position, icon, isRight = false }) => (
  <div className={`absolute ${position} z-20 flex items-center gap-3 bg-white px-6 py-3.5 rounded-full shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)] border border-slate-50 transition-all hover:scale-110 hover:z-30 cursor-pointer`}>
    {!isRight && (
      <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
        {icon}
      </div>
    )}
    <span className="text-sm font-bold text-[#2d3e50] whitespace-nowrap">{text}</span>
    {isRight && (
      <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
        {icon}
      </div>
    )}
  </div>
);

const DoctorCard = ({ name, role }) => (
  <div className="bg-white p-8 rounded-[50px] shadow-sm border border-slate-100 flex flex-col items-center group hover:shadow-2xl transition-all">
    <div className="w-44 h-44 bg-[#eef7ff] rounded-[35px] mb-8 overflow-hidden relative">
       <img src={doctorImg} alt={name} className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500" />
    </div>
    <h5 className="font-bold text-[#2d3e50] text-xl">{name}</h5>
    <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-2">{role}</p>
  </div>
);

export default LandingPage;