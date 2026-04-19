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
        <div className="min-h-screen bg-earth-50 relative lg:pl-64 transition-all duration-300">
            {/* Sidebar - Drawer on Mobile, Fixed on Desktop */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content Area */}
            <div className="flex flex-col min-h-screen relative overflow-hidden">
                <Topbar onToggleSidebar={toggleSidebar} />
                <main className="flex-1 p-4 md:p-6 pb-24">
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
