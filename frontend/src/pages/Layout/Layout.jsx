import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; 
import Header from './Header';

const Layout = () => {

  const user = JSON.parse(localStorage.getItem('user')) || { username: 'User' };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-[#D0E7FF] via-[#F3F8FF] to-white min-h-screen p-4 gap-4">

      <Sidebar />

      <div className="flex-1 flex flex-col gap-4">

        <Header username={user.username} />

        <main className="flex-1 overflow-y-auto bg-white/80 backdrop-blur-md rounded-[16px] border border-white/50 shadow-sm p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;