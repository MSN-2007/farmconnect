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
    Download,
    X
} from 'lucide-react';
import { cn } from '../lib/utils';

const SidebarContent = ({ setIsOpen, location, menuSections }) => (
    <div className="flex flex-col h-full bg-white">
        {/* Logo & Mobile Close */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
                <div className="h-10 w-10 bg-gradient-to-br from-nature-600 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-nature-900 leading-none">FarmConnect</h1>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-bold">Digital Farming</p>
                </div>
            </Link>
            
            <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
                <X className="h-5 w-5 text-gray-500" />
            </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
            {menuSections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-3">
                        {section.title}
                    </h3>
                    <div className="space-y-1">
                        {section.items.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
                                        isActive
                                            ? "bg-nature-900 text-white shadow-lg"
                                            : "text-gray-600 hover:bg-gray-100"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "h-5 w-5 transition-transform group-hover:scale-110",
                                        isActive ? "text-white" : "text-gray-400"
                                    )} />
                                    <span className="font-bold text-sm tracking-tight">{item.name}</span>
                                    {item.badge && (
                                        <span className={cn(
                                            "ml-auto text-[9px] px-2 py-0.5 rounded-full font-black uppercase",
                                            item.badge === 'New' && "bg-green-100 text-green-700",
                                            item.badge === 'AI' && "bg-purple-100 text-purple-700"
                                        )}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 space-y-1">
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-all w-full text-left">
                <Settings className="h-5 w-5 text-gray-400" />
                <span className="font-bold text-sm">Settings</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all w-full text-left">
                <LogOut className="h-5 w-5" />
                <span className="font-bold text-sm">Logout</span>
            </button>
        </div>
    </div>
);

const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();

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
        <>
            {/* Desktop Sidebar (Fixed) */}
            <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 flex-col z-40">
                <SidebarContent setIsOpen={setIsOpen} location={location} menuSections={menuSections} />
            </aside>

            {/* Mobile Sidebar (Drawer Overlay) */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 z-[100] flex overflow-hidden">
                    <div 
                        className="fixed inset-0 bg-nature-950/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
                        onClick={() => setIsOpen(false)} 
                    />
                    <aside className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-500 ease-out">
                        <SidebarContent setIsOpen={setIsOpen} location={location} menuSections={menuSections} />
                    </aside>
                </div>
            )}
        </>
    );
};

export default Sidebar;
