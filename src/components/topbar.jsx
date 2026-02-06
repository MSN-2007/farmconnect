import React from 'react';
import { Bell, Menu, Search, User } from 'lucide-react';

const Topbar = () => {
    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-4 md:hidden">
                <button className="p-2 -ml-2 hover:bg-gray-100 rounded-md">
                    <Menu className="h-6 w-6 text-gray-600" />
                </button>
                <span className="text-lg font-bold text-nature-700">FarmConnect</span>
            </div>

            <div className="flex-1 hidden md:flex max-w-xl mx-auto">
                {/* Placeholder for center content if needed, e.g. search */}
            </div>

            <div className="flex items-center gap-4 ml-auto">
                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <div className="h-8 w-8 bg-nature-100 rounded-full flex items-center justify-center border border-nature-200 text-nature-700">
                    <User className="h-5 w-5" />
                </div>
            </div>
        </header>
    );
};

export default Topbar;
