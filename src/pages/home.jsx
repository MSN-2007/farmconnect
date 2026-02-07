import React from 'react';
import QuickAccessGrid from '../components/quick-access-grid';
import WeatherWidget from '../components/weather-widget';
import FarmTipWidget from '../components/farm-tip-widget';
import MarketPricesWidget from '../components/market-prices-widget';
import DailyNewsWidget from '../components/daily-news-widget';
import { TrendingUp, Users, ShoppingBag, Calendar, Sparkles, BarChart3 } from 'lucide-react';

const HomePage = () => {
    const stats = [
        { icon: Users, label: 'Active Farmers', value: '50K+', color: 'bg-green-100 text-green-700' },
        { icon: ShoppingBag, label: 'Daily Listings', value: '1.2K', color: 'bg-blue-100 text-blue-700' },
        { icon: TrendingUp, label: 'Avg. Profit Increase', value: '+23%', color: 'bg-amber-100 text-amber-700' },
        { icon: Calendar, label: 'Events This Month', value: '45', color: 'bg-purple-100 text-purple-700' }
    ];

    return (
        <div className="max-w-7xl mx-auto py-6 space-y-8">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-nature-700 via-green-600 to-emerald-700 rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
                <div className="relative px-8 py-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <Sparkles className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">Welcome to FarmConnect</h1>
                            <p className="text-green-100 text-lg">Your Digital Farming Companion</p>
                        </div>
                    </div>
                    <p className="text-white/90 text-lg max-w-2xl mb-6">
                        Empowering farmers with AI-driven insights, market intelligence, and community support.
                        Grow smarter, sell better, earn more.
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                <div className={`inline-flex p-2 rounded-lg ${stat.color} mb-2`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <div className="text-sm text-green-100">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Access */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-6 w-6 text-nature-700" />
                    <h2 className="text-2xl font-bold text-gray-900">Quick Access</h2>
                </div>
                <QuickAccessGrid />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Weather & Tips */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="text-2xl">🌤️</span>
                            Today's Weather
                        </h2>
                        <WeatherWidget />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="text-2xl">💡</span>
                            Farm Tips
                        </h2>
                        <FarmTipWidget />
                    </div>
                </div>

                {/* Right Column - Market Prices */}
                <div className="lg:col-span-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">💰</span>
                        Market Prices
                    </h2>
                    <MarketPricesWidget />
                </div>
            </div>

            {/* Daily News Section */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📰</span>
                    Agriculture News Today
                </h2>
                <DailyNewsWidget />
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-nature-600 to-green-600 rounded-2xl p-8 text-center shadow-lg">
                <h3 className="text-2xl font-bold text-white mb-3">Ready to Transform Your Farming?</h3>
                <p className="text-green-50 mb-6 max-w-2xl mx-auto">
                    Join thousands of farmers who are already using FarmConnect to increase their yields and profits
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                    <button className="px-6 py-3 bg-white text-nature-700 rounded-lg font-semibold hover:bg-green-50 transition-colors shadow-md">
                        Explore Features
                    </button>
                    <button className="px-6 py-3 bg-nature-800 text-white rounded-lg font-semibold hover:bg-nature-900 transition-colors border-2 border-white/20">
                        Watch Tutorial
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
