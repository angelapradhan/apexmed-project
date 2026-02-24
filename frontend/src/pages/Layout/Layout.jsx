import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; 
import Header from './Header';

const Layout = () => {
  // Get user info for Header
  const user = JSON.parse(localStorage.getItem('user')) || { username: 'User' };

  return (
    <div className="flex bg-[#eef2ff] min-h-screen p-4 gap-4">
      {/* Sidebar fixed hunxa */}
      <Sidebar />

      <div className="flex-1 flex flex-col gap-4">
        {/* Header top ma fixed hunxa */}
        <Header username={user.username} />

        {/* Dynamic Pages (Dashboard or Appointments) loading area */}
        <main className="flex-1 overflow-y-auto bg-white/40 backdrop-blur-md rounded-[32px] border border-white/50 shadow-sm p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;