import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage'; 
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import AppointmentsPage from './pages/AppointmentsPage';
import Layout from './pages/Layout/Layout'; 
import FavouritesPage from './pages/FavouritesPage';
import ReviewsPage from './pages/ReviewsPage';
import SettingsPage from './pages/SettingsPage';
import UsersPage from './pages/Admin/UsersPage';
import AdminAppointmentsPage from './pages/Admin/AdminAppointmentsPage';
import AdminServices from './pages/Admin/AdminServices';

//admin imports
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import DoctorDetailPage from './pages/DoctorDetailPage';
import HospitalDetailPage from './pages/HospitalDetailPage';
import AdminReviewsPage from './pages/Admin/AdminReviewsPage';

const AdminRoutes = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* admin routes */}
        <Route element={<AdminRoutes />}> 
          {/* admin layout */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
          <Route path="/admin/doctor-details" element={<DoctorDetailPage />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/hospital-details" element={<HospitalDetailPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/reviews" element={<AdminReviewsPage />} />

          </Route>
        </Route>

        {/* Puser routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctor-details" element={<DoctorDetailPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="favourites" element={<FavouritesPage />} />
          <Route path="/hospital-details" element={<HospitalDetailPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/settings" element={<SettingsPage />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;