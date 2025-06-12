// src/layouts/DashboardLayout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
                <div className="p-6 bg-gray-100 min-h-screen">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
