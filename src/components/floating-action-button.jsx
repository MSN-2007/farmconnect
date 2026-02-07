import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ShoppingCart, Camera, MessageSquare, Phone, X, Mic } from 'lucide-react';
import { cn } from '../lib/utils';

const FloatingActionButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const quickActions = [
        {
            name: 'Sell Crop',
            icon: ShoppingCart,
            path: '/buy-sell',
            color: 'bg-green-500 hover:bg-green-600',
            description: 'List your produce'
        },
        {
            name: 'Check Disease',
            icon: Camera,
            path: '/ai-lens',
            color: 'bg-purple-500 hover:bg-purple-600',
            description: 'Scan plant photo'
        },
        {
            name: 'Ask Community',
            icon: MessageSquare,
            path: '/community',
            color: 'bg-blue-500 hover:bg-blue-600',
            description: 'Get farmer advice'
        },
        {
            name: 'Call Expert',
            icon: Phone,
            path: '/vet',
            color: 'bg-orange-500 hover:bg-orange-600',
            description: 'Talk to specialist'
        },
        {
            name: 'Voice Help',
            icon: Mic,
            path: '/ai-assistant',
            color: 'bg-pink-500 hover:bg-pink-600',
            description: 'Speak your question'
        }
    ];

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Quick Actions Menu */}
            <div className={cn(
                "fixed bottom-24 right-6 z-50 transition-all duration-300",
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            )}>
                <div className="space-y-3">
                    {quickActions.map((action, index) => (
                        <Link
                            key={action.path}
                            to={action.path}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-full shadow-lg text-white transition-all duration-200",
                                action.color,
                                "transform hover:scale-105"
                            )}
                            style={{
                                transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
                            }}
                        >
                            <action.icon className="h-5 w-5" />
                            <div className="pr-2">
                                <div className="font-semibold text-sm">{action.name}</div>
                                <div className="text-xs opacity-90">{action.description}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main FAB Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 right-6 z-50",
                    "h-16 w-16 rounded-full shadow-2xl",
                    "bg-gradient-to-br from-nature-600 to-green-600",
                    "text-white flex items-center justify-center",
                    "transition-all duration-300 hover:scale-110",
                    "border-4 border-white",
                    isOpen && "rotate-45"
                )}
            >
                {isOpen ? (
                    <X className="h-7 w-7" />
                ) : (
                    <Plus className="h-7 w-7" />
                )}
            </button>

            {/* Helper Text */}
            {!isOpen && (
                <div className="fixed bottom-6 right-24 z-40 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg animate-pulse">
                    Quick Actions
                </div>
            )}
        </>
    );
};

export default FloatingActionButton;
