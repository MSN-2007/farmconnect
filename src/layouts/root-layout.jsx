import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';

const RootLayout = () => {
    return (
        <div className="flex h-screen bg-earth-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default RootLayout;
