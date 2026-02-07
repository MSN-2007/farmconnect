import React, { useState } from 'react';
import { Search, Bell, User, ChevronDown, MessageSquare, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const Topbar = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const notifications = [
        { id: 1, type: 'price', message: 'Wheat prices increased by 5%', time: '2h ago', unread: true },
        { id: 2, type: 'weather', message: 'Heavy rainfall expected tomorrow', time: '4h ago', unread: true },
        { id: 3, type: 'community', message: 'New comment on your post', time: '1d ago', unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search crops, markets, farmers, or ask AI..."
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-500 focus:bg-white transition-all text-sm"
                    />
                    <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded font-mono">
                        Ctrl K
                    </kbd>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 ml-6">
                {/* Help */}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative group">
                    <HelpCircle className="h-5 w-5 text-gray-600" />
                    <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Help & Support
                    </div>
                </button>

                {/* Messages */}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative group">
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-green-500 rounded-full border-2 border-white"></span>
                    <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Messages
                    </div>
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                    >
                        <Bell className="h-5 w-5 text-gray-600" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowNotifications(false)}
                            />
                            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                                    <button className="text-xs text-nature-600 font-medium hover:text-nature-700">
                                        Mark all read
                                    </button>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.map(notif => (
                                        <div
                                            key={notif.id}
                                            className={cn(
                                                "p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors",
                                                notif.unread && "bg-nature-50/30"
                                            )}
                                        >
                                            <div className="flex gap-3">
                                                <div className={cn(
                                                    "h-2 w-2 rounded-full mt-2 flex-shrink-0",
                                                    notif.unread ? "bg-nature-600" : "bg-transparent"
                                                )} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-900 font-medium">{notif.message}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 text-center border-t border-gray-200">
                                    <button className="text-sm text-nature-600 font-medium hover:text-nature-700">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Profile */}
                <div className="relative">
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-3 pl-3 pr-2 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <div className="h-8 w-8 bg-gradient-to-br from-nature-600 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            JD
                        </div>
                        <div className="text-left hidden md:block">
                            <div className="text-sm font-semibold text-gray-900">John Doe</div>
                            <div className="text-xs text-gray-500">Farmer</div>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-600" />
                    </button>

                    {/* Profile Dropdown */}
                    {showProfile && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowProfile(false)}
                            />
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 bg-gradient-to-br from-nature-600 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                                            JD
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">John Doe</div>
                                            <div className="text-sm text-gray-500">john@farmconnect.com</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-2">
                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                        My Profile
                                    </button>
                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                        My Listings
                                    </button>
                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                        Settings
                                    </button>
                                </div>
                                <div className="p-2 border-t border-gray-200">
                                    <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Topbar;
