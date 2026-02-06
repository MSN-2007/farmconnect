import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home,
    Users,
    ShoppingCart,
    TrendingUp,
    Tractor,
    Sprout,
    Calculator,
    Wallet,
    BarChart2,
    CloudSun,
    Scan,
    BookOpen,
    CalendarDays,
    Store,
    Stethoscope,
    Bot,
    Settings,
    LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';

const sidebarItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Community', icon: Users, path: '/community' },
    { name: 'Buy & Sell', icon: ShoppingCart, path: '/buy-sell' },
    { name: 'Market Prices', icon: TrendingUp, path: '/market-prices' },
    { name: 'Rentals', icon: Tractor, path: '/rentals' },
    { name: 'Farm Plan', icon: Sprout, path: '/farm-plan' },
    { name: 'Calculator', icon: Calculator, path: '/calculator' },
    { name: 'Expenses', icon: Wallet, path: '/expenses' },
    { name: 'Analytics', icon: BarChart2, path: '/analytics' },
    { name: 'Weather', icon: CloudSun, path: '/weather' },
    { name: 'AI Lens', icon: Scan, path: '/ai-lens' },
    { name: 'Courses', icon: BookOpen, path: '/courses' },
    { name: 'Events', icon: CalendarDays, path: '/events' },
    { name: 'Shops', icon: Store, path: '/shops' },
    { name: 'Vet', icon: Stethoscope, path: '/vet' },
    { name: 'AI Assistant', icon: Bot, path: '/ai-assistant' },
];

const Sidebar = () => {
    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen transition-all duration-300">
            <div className="p-6 flex items-center gap-2">
                <Sprout className="h-8 w-8 text-nature-600" />
                <span className="text-xl font-bold text-gray-800 tracking-tight">FarmConnect</span>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {sidebarItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                            isActive
                                ? "bg-nature-700 text-white shadow-sm"
                                : "text-gray-600 hover:bg-earth-100 hover:text-nature-700"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 w-full rounded-lg hover:bg-red-50 transition-colors">
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
