import React, { useState } from 'react';
import { HelpCircle, X, Phone, MessageSquare, Video, Book } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const HelpWidget = () => {
    const [isOpen, setIsOpen] = useState(false);

    const helpOptions = [
        {
            icon: Phone,
            title: 'Call Support',
            description: 'Talk to our team',
            action: 'tel:1800-XXX-XXXX',
            color: 'bg-green-500',
            external: true
        },
        {
            icon: MessageSquare,
            title: 'Ask Community',
            description: 'Get farmer advice',
            action: '/community',
            color: 'bg-blue-500'
        },
        {
            icon: Video,
            title: 'Watch Tutorials',
            description: 'Learn how to use',
            action: '/courses',
            color: 'bg-purple-500'
        },
        {
            icon: Book,
            title: 'Read Guide',
            description: 'Step-by-step help',
            action: '#',
            color: 'bg-amber-500'
        }
    ];

    const commonQuestions = [
        { q: 'How to sell my crop?', a: 'Click the + button → Select "Sell Crop" → Follow 3 easy steps' },
        { q: 'How to check prices?', a: 'Go to Market Prices page or check the home page widget' },
        { q: 'How to identify disease?', a: 'Click + button → "Check Disease" → Take a photo of affected plant' }
    ];

    return (
        <>
            {/* Help Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 left-6 z-40 h-14 w-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 border-4 border-white"
            >
                <HelpCircle className="h-6 w-6" />
            </button>

            {/* Help Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl z-50 overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold">Need Help?</h2>
                                    <p className="text-blue-100 text-sm">We're here for you</p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Quick Help Options */}
                            <div>
                                <h3 className="font-bold text-gray-900 mb-3">Quick Help</h3>
                                <div className="space-y-3">
                                    {helpOptions.map((option, index) => (
                                        option.external ? (
                                            <a
                                                key={index}
                                                href={option.action}
                                                className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                                            >
                                                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center text-white", option.color)}>
                                                    <option.icon className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {option.title}
                                                    </div>
                                                    <div className="text-sm text-gray-600">{option.description}</div>
                                                </div>
                                                <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </a>
                                        ) : (
                                            <Link
                                                key={index}
                                                to={option.action}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                                            >
                                                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center text-white", option.color)}>
                                                    <option.icon className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {option.title}
                                                    </div>
                                                    <div className="text-sm text-gray-600">{option.description}</div>
                                                </div>
                                                <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        )
                                    ))}
                                </div>
                            </div>

                            {/* Common Questions */}
                            <div>
                                <h3 className="font-bold text-gray-900 mb-3">Common Questions</h3>
                                <div className="space-y-3">
                                    {commonQuestions.map((item, index) => (
                                        <div key={index} className="bg-blue-50 rounded-xl p-4">
                                            <div className="font-semibold text-blue-900 mb-2 flex items-start gap-2">
                                                <span className="text-blue-600 mt-0.5">Q:</span>
                                                <span>{item.q}</span>
                                            </div>
                                            <div className="text-sm text-blue-800 flex items-start gap-2 ml-5">
                                                <span className="text-blue-600 font-semibold mt-0.5">A:</span>
                                                <span>{item.a}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Emergency Contact */}
                            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
                                <h3 className="font-bold text-lg mb-2">Emergency Support</h3>
                                <p className="text-red-100 text-sm mb-4">
                                    For urgent farming issues or emergencies
                                </p>
                                <a
                                    href="tel:1800-XXX-XXXX"
                                    className="block w-full bg-white text-red-600 font-bold py-3 rounded-lg text-center hover:bg-red-50 transition-colors"
                                >
                                    Call 1800-XXX-XXXX
                                </a>
                            </div>

                            {/* Tips */}
                            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <div className="text-2xl">💡</div>
                                    <div>
                                        <div className="font-semibold text-green-900 mb-1">Pro Tip</div>
                                        <div className="text-sm text-green-800">
                                            Use the + button (bottom right) for quick access to common tasks!
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default HelpWidget;
