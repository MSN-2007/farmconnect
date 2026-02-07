import React from 'react';
import { Link } from 'react-router-dom';
import {
    ShoppingCart,
    TrendingUp,
    Users,
    Camera,
    Cloud,
    BarChart3,
    Bot,
    Calendar
} from 'lucide-react';
import { cn } from '../lib/utils';

const QuickAccessGrid = () => {
    const quickActions = [
        {
            name: 'Buy & Sell',
            icon: ShoppingCart,
            path: '/buy-sell',
            description: 'Trade produce',
            color: 'from-blue-500 to-blue-600',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
        {
            name: 'Market Prices',
            icon: TrendingUp,
            path: '/market-prices',
            description: 'Live rates',
            color: 'from-green-500 to-green-600',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600'
        },
        {
            name: 'Community',
            icon: Users,
            path: '/community',
            description: 'Connect & share',
            color: 'from-purple-500 to-purple-600',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600'
        },
        {
            name: 'AI Lens',
            icon: Camera,
            path: '/ai-lens',
            description: 'Identify diseases',
            color: 'from-pink-500 to-pink-600',
            iconBg: 'bg-pink-100',
            iconColor: 'text-pink-600',
            badge: 'AI'
        },
        {
            name: 'Weather',
            icon: Cloud,
            path: '/weather',
            description: 'Forecast & alerts',
            color: 'from-cyan-500 to-cyan-600',
            iconBg: 'bg-cyan-100',
            iconColor: 'text-cyan-600'
        },
        {
            name: 'Analytics',
            icon: BarChart3,
            path: '/analytics',
            description: 'Track progress',
            color: 'from-amber-500 to-amber-600',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600'
        },
        {
            name: 'AI Assistant',
            icon: Bot,
            path: '/ai-assistant',
            description: 'Ask anything',
            color: 'from-indigo-500 to-indigo-600',
            iconBg: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
            badge: 'New'
        },
        {
            name: 'Farm Plan',
            icon: Calendar,
            path: '/farm-plan',
            description: 'Plan crops',
            color: 'from-emerald-500 to-emerald-600',
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600'
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
                <Link
                    key={action.path}
                    to={action.path}
                    className="group relative bg-white rounded-xl p-5 border border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                    {/* Gradient Background on Hover */}
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                        action.color
                    )} />

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                            <div className={cn(
                                "h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300",
                                action.iconBg,
                                "group-hover:bg-white/20 group-hover:backdrop-blur-sm"
                            )}>
                                <action.icon className={cn(
                                    "h-6 w-6 transition-colors duration-300",
                                    action.iconColor,
                                    "group-hover:text-white"
                                )} />
                            </div>
                            {action.badge && (
                                <span className="text-[10px] px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold group-hover:bg-white/20 group-hover:text-white transition-all">
                                    {action.badge}
                                </span>
                            )}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-white transition-colors">
                            {action.name}
                        </h3>
                        <p className="text-sm text-gray-500 group-hover:text-white/80 transition-colors">
                            {action.description}
                        </p>
                    </div>

                    {/* Hover Arrow */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default QuickAccessGrid;
