import React, { useState, useRef } from 'react';
import { 
  Activity, Heart, Calendar, Users, 
  Stethoscope, Clock, MapPin, Phone, Mail
} from 'lucide-react';

// Assets 
import logo from '../assets/logo.png';
import landingPic from '../assets/landingpic.jpg';
import drEmma from '../assets/Dr.EmmaWilson.jpg';
import drDaniel from '../assets/Dr.DanielKim.jpg';
import drSarah from '../assets/Dr.SarahPatel.jpg';
import doctorImg from '../assets/doctor.png'; 

const LandingPage = ({ onRegisterClick }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const doctorsSectionRef = useRef(null);
  const servicesSectionRef = useRef(null);
  const footerSectionRef = useRef(null); 

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  // Scroll Functions
  const scrollToDoctors = () => {
    setActiveDropdown(null);
    doctorsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToServices = () => {
    setActiveDropdown(null);
    servicesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    setActiveDropdown(null);
    footerSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      
      {/* NAVIGATION */}
      <nav className="flex items-center justify-between px-6 md:px-20 py-6 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
          <img src={logo} alt="ApexMed Logo" className="h-8 w-auto" />
          <span className="text-2xl font-bold text-[#2d3e50] tracking-tight">ApexMed</span>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-[15px] font-semibold text-slate-500 relative">
          <div className="relative">
            <button onClick={() => toggleDropdown('about')} className="hover:text-blue-500 transition-colors">About</button>
            {activeDropdown === 'about' && (
              <NavDropdown 
                title="About Us" 
                content="ApexMed is a leading healthcare provider dedicated to excellence in patient care and medical innovation." 
              />
            )}
          </div>

          <button onClick={scrollToServices} className="hover:text-blue-500 transition-colors">
            Services
          </button>

          <button onClick={scrollToDoctors} className="hover:text-blue-500 transition-colors">
            Doctors
          </button>

          <button onClick={scrollToContact} className="hover:text-blue-500 transition-colors">
            Contact
          </button>
        </div>

        <button 
          onClick={onRegisterClick} 
          className="px-7 py-2.5 bg-blue-500 text-white font-bold rounded-full shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all active:scale-95"
        >
          Appointment
        </button>
      </nav>

      {/* HERO SECTION */}
      <header className="px-6 md:px-20 pt-8 pb-12 relative overflow-hidden bg-white mb-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-7 z-10 text-center md:text-left">
            <span className="text-blue-400 font-bold text-xs tracking-[0.3em] uppercase">Medical</span>
            <h1 className="text-6xl md:text-7xl font-extrabold text-[#2d3e50] leading-[1.1]">
              Healthcare <br /> Solutions
            </h1>
            <p className="text-slate-400 text-base max-w-sm leading-relaxed mx-auto md:mx-0">
              Access trusted doctors, book appointments, and manage your health—all in one secure platform.
            </p>
            <button className="px-10 py-4 bg-blue-500 text-white rounded-full font-bold shadow-xl shadow-blue-200 hover:-translate-y-1 transition-transform">
              Find Doctors
            </button>
          </div>

          <div className="md:w-1/2 relative flex justify-center mt-12 md:mt-0">
             <div className="relative w-full max-w-xl">
                <img 
                  src={landingPic} 
                  alt="Doctor Consultation" 
                  className="w-full h-100 object-cover rounded-3xl shadow-sm border border-slate-100" 
                />
                <div className="absolute top-4 right-4 bg-white p-3 rounded-xl shadow-lg text-blue-500 border border-slate-50">
                    <Heart fill="currentColor" size={20} />
                </div>
                <div className="absolute -bottom-4 left-10 bg-white p-3 rounded-xl shadow-lg text-blue-500 border border-slate-50">
                    <Activity size={20} />
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* QUICK ACTION CARDS */}
      <section className="px-6 md:px-20 py-12 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <ActionCard 
            title="Appointment" 
            icon={<Calendar size={22}/>} 
            description="Book your doctor appointment quickly and easily in just a few simple steps."
            btn="Request" 
          />
          <ActionCard 
            title="Find Doctors" 
            icon={<Users size={22}/>} 
            description="Search through our network of certified specialists to find the right care for you."
            btn="Doctors" 
          />
        </div>
      </section>

      {/*  MEDICAL SERVICES */}
      <section ref={servicesSectionRef} className="pt-28 pb-10 px-6 md:px-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-blue-400 font-bold text-xs uppercase tracking-[0.4em]">Service</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d3e50] mt-3">Our Medical Services</h2>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-20">
            <div className="lg:w-1/2 relative flex justify-center items-center h-137.5 w-full">
              <div className="absolute w-75 h-120 bg-blue-500 rounded-full flex items-end justify-center overflow-hidden shadow-[0_20px_50px_rgba(59,130,246,0.3)]">
                 <img src={doctorImg} alt="Doctor" className="h-[95%] w-auto object-contain translate-y-6" />
              </div>
              <ServiceTag text="Medicine" position="top-1/2 -left-8 md:left-4 -translate-y-1/2" icon={<Stethoscope size={14}/>} />
              <ServiceTag text="Orthopedic" position="bottom-10 left-4 md:left-12" icon={<Heart size={14}/>} />
              <ServiceTag text="Dental" position="bottom-1/3 -right-4 md:right-4" icon={<Activity size={14}/>} isRight />
            </div>

            <div className="lg:w-1/2 space-y-8">
              <h3 className="text-4xl font-bold text-[#2d3e50]">Dental Care Service</h3>
              <p className="text-slate-400 leading-relaxed text-lg max-w-lg">
                We provide comprehensive dental care, from routine checkups to advanced treatments, ensuring healthy and confident smiles for all ages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SPECIALITY BANNER */}
      <section className="py-10 px-6 md:px-20">
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
                <p className="text-blue-100 text-lg opacity-90 max-w-sm">Schedule your medical consultations in just a few clicks.</p>
             </div>
             <div className="md:w-1/2 flex justify-end mt-12 md:mt-0">
                <Stethoscope size={240} className="text-white/20 rotate-30" />
             </div>
          </div>
        </div>
      </section>

      {/* DOCTORS GRID */}
      <section ref={doctorsSectionRef} className="py-28 px-6 md:px-20 bg-[#f8fbff]">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-blue-400 font-bold text-xs uppercase tracking-[0.4em]">Team</span>
          <h2 className="text-4xl font-bold text-[#2d3e50] mt-3 mb-16">Our Doctors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             <DoctorCard name="Dr. Emma Wilson" role="Cardiologist" img={drEmma} />
             <DoctorCard name="Dr. Daniel Kim" role="Neurologist" img={drDaniel} />
             <DoctorCard name="Dr. Sarah Patel" role="Pediatrician" img={drSarah} />
          </div>
        </div>
      </section>

      {/* FOOTER / CONTACT */}
      <footer ref={footerSectionRef} className="bg-[#5a8c8c] text-white pt-16 pb-8 px-6 md:px-20 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 gap-8">
            
            <div className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="h-7 w-auto brightness-0 invert" />
              <span className="text-xl font-bold tracking-tight">ApexMed</span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-8 text-sm text-blue-50 opacity-90">
              <div className="flex items-center gap-2">
                <Phone size={18} />
                <span>(+977) 9876543210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} />
                <span>info@apexmed.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>Kathmandu, Nepal</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 text-xs text-blue-50 opacity-60">
            © 2026 ApexMed Healthcare Solutions - All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
};

// SUB-COMPONENTS 
const NavDropdown = ({ title, content }) => (
  <div className="absolute top-12 left-1/2 -translate-x-1/2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 z-100 animate-in fade-in zoom-in duration-200">
    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-slate-100 rotate-45"></div>
    <h5 className="font-bold text-[#2d3e50] mb-2">{title}</h5>
    <p className="text-xs text-slate-400 leading-relaxed">{content}</p>
  </div>
);

const ActionCard = ({ title, icon, description, btn }) => (
  <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-slate-100 border border-slate-50 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform">
    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors">{icon}</div>
    <h4 className="font-bold text-[#2d3e50] text-lg mb-3">{title}</h4>
    <p className="text-xs text-slate-400 mb-8 leading-relaxed">{description}</p>
    <button className="w-full py-2.5 bg-[#f0f7ff] text-blue-500 rounded-full text-xs font-bold hover:bg-blue-500 hover:text-white transition-all">{btn}</button>
  </div>
);

const ServiceTag = ({ text, position, icon, isRight = false }) => (
  <div className={`absolute ${position} z-20 flex items-center gap-3 bg-white px-6 py-3.5 rounded-full shadow-lg border border-slate-50 hover:scale-110 transition-all cursor-pointer`}>
    {!isRight && <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">{icon}</div>}
    <span className="text-sm font-bold text-[#2d3e50] whitespace-nowrap">{text}</span>
    {isRight && <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">{icon}</div>}
  </div>
);

const DoctorCard = ({ name, role, img }) => (
  <div className="bg-white p-8 rounded-[50px] shadow-sm border border-slate-100 flex flex-col items-center group hover:shadow-2xl transition-all">
    <div className="w-44 h-44 bg-[#eef7ff] rounded-[35px] mb-8 overflow-hidden">
       <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
    </div>
    <h5 className="font-bold text-[#2d3e50] text-xl">{name}</h5>
    <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-2">{role}</p>
  </div>
);

export default LandingPage;