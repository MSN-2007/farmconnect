import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    Users,
    ShoppingCart,
    TrendingUp,
    Wrench,
    Calendar,
    Calculator,
    Receipt,
    BarChart3,
    Cloud,
    Camera,
    BookOpen,
    CalendarDays,
    Store,
    Stethoscope,
    Bot,
    Settings,
    LogOut,
    Sparkles,
    Download
} from 'lucide-react';
import { cn } from '../lib/utils';

const Sidebar = () => {
    const location = useLocation();

    // Organized menu sections
    const menuSections = [
        {
            title: 'Main',
            items: [
                { name: 'Home', icon: Home, path: '/' },
                { name: 'Community', icon: Users, path: '/community' },
            ]
        },
        {
            title: 'Marketplace',
            items: [
                { name: 'Buy & Sell', icon: ShoppingCart, path: '/buy-sell' },
                { name: 'Market Prices', icon: TrendingUp, path: '/market-prices' },
                { name: 'Rentals', icon: Wrench, path: '/rentals' },
                { name: 'Shops', icon: Store, path: '/shops' },
            ]
        },
        {
            title: 'Farm Management',
            items: [
                { name: 'Farm Plan', icon: Calendar, path: '/farm-plan' },
                { name: 'Analytics', icon: BarChart3, path: '/analytics' },
                { name: 'Expenses', icon: Receipt, path: '/expenses' },
                { name: 'Calculator', icon: Calculator, path: '/calculator' },
            ]
        },
        {
            title: 'AI Tools',
            items: [
                { name: 'AI Assistant', icon: Bot, path: '/ai-assistant', badge: 'New' },
                { name: 'AI Lens', icon: Camera, path: '/ai-lens', badge: 'AI' },
            ]
        },
        {
            title: 'Resources',
            items: [
                { name: 'Weather', icon: Cloud, path: '/weather' },
                { name: 'Courses', icon: BookOpen, path: '/courses' },
                { name: 'Events', icon: CalendarDays, path: '/events' },
                { name: 'Vet', icon: Stethoscope, path: '/vet' },
                { name: 'Offline Data', icon: Download, path: '/offline-data', badge: 'New' },
            ]
        }
    ];

    return (
        <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 overflow-y-auto">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="h-10 w-10 bg-gradient-to-br from-nature-600 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-nature-900">FarmConnect</h1>
                        <p className="text-xs text-gray-500">Digital Farming</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-6">
                {menuSections.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                            {section.title}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative",
                                            isActive
                                                ? "bg-nature-700 text-white shadow-md"
                                                : "text-gray-700 hover:bg-gray-100"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "h-5 w-5 transition-transform group-hover:scale-110",
                                            isActive ? "text-white" : "text-gray-500"
                                        )} />
                                        <span className="font-medium text-sm">{item.name}</span>
                                        {item.badge && (
                                            <span className={cn(
                                                "ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold",
                                                item.badge === 'New' && "bg-green-100 text-green-700",
                                                item.badge === 'AI' && "bg-purple-100 text-purple-700"
                                            )}>
                                                {item.badge}
                                            </span>
                                        )}
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-200 space-y-1">
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-all w-full">
                    <Settings className="h-5 w-5 text-gray-500" />
                    <span className="font-medium text-sm">Settings</span>
                </button>
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all w-full">
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
