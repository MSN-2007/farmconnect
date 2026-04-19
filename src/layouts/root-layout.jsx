import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import FloatingActionButton from '../components/floating-action-button';
import HelpWidget from '../components/help-widget';

const RootLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-earth-50 overflow-hidden">
            {/* Sidebar - Drawer on Mobile, Fixed on Desktop (lg: 1024px) */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content - Dynamic margin based on sidebar state and screen size */}
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
                <Topbar onToggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24">
                    <Outlet />
                </main>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Quick Actions - Always Accessible */}
            <FloatingActionButton />

            {/* Help - Always Available */}
            <HelpWidget />
        </div>
    );
};

export default RootLayout;
