import React from 'react';
import QuickAccessGrid from '../components/quick-access-grid';
import WeatherWidget from '../components/weather-widget';
import MarketPricesWidget from '../components/market-prices-widget';
import FarmTipWidget from '../components/farm-tip-widget';
import DailyNewsWidget from '../components/daily-news-widget';

const HomePage = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-nature-900 mb-2">Welcome back, Farmer! 🌾</h1>
                <p className="text-gray-600">Here's what's happening on your farm today</p>
            </div>

            <QuickAccessGrid />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 space-y-6">
                    <WeatherWidget />
                    <FarmTipWidget />
                </div>
                <div className="lg:col-span-1">
                    <MarketPricesWidget />
                </div>
            </div>

            {/* Daily News Section at Bottom */}
            <div className="mt-8">
                <DailyNewsWidget />
            </div>
        </div>
    );
};

export default HomePage;
