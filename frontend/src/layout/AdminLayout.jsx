import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../components/Sidebar';

const AdminLayout = () => {

  return (
    <div className={`flex min-h-screen bg-gray-100`}>
      <SideBar />
      <main className={`flex-1  max-h-screen overflow-auto text-gray-900`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
