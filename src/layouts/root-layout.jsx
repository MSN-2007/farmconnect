import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import FloatingActionButton from '../components/floating-action-button';
import HelpWidget from '../components/help-widget';

const RootLayout = () => {
    return (
        <div className="flex h-screen bg-earth-50 overflow-hidden">
            {/* Sidebar - Fixed */}
            <Sidebar />

            {/* Main Content - With left margin to avoid sidebar overlap */}
            <div className="flex-1 flex flex-col overflow-hidden ml-64">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24">
                    <Outlet />
                </main>
            </div>

            {/* Quick Actions - Always Accessible */}
            <FloatingActionButton />

            {/* Help - Always Available */}
            <HelpWidget />
        </div>
    );
};

export default RootLayout;
