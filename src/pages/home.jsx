import React, { useState, useEffect } from 'react';
import { smartFetch } from '../lib/api-config';
import QuickAccessGrid from '../components/quick-access-grid';
import WeatherWidget from '../components/weather-widget';
import FarmTipWidget from '../components/farm-tip-widget';
import MarketPricesWidget from '../components/market-prices-widget';
import DailyNewsWidget from '../components/daily-news-widget';
import { TrendingUp, Users, ShoppingBag, Calendar, Sparkles, BarChart3, AlertTriangle, X, Bell, Cloud, Droplets, Wind } from 'lucide-react';

const HomePage = () => {
    const [alerts, setAlerts] = useState([
        {
            id: 1,
            type: 'warning',
            title: 'Heavy Rain Alert',
            message: 'Heavy rainfall expected in next 48 hours. Secure your crops and equipment.',
            time: '2 hours ago',
            icon: Cloud,
            color: 'orange'
        },
        {
            id: 2,
            type: 'info',
            title: 'Market Price Update',
            message: 'Wheat prices increased by 5% in nearby markets.',
            time: '5 hours ago',
            icon: TrendingUp,
            color: 'blue'
        },
        {
            id: 3,
            type: 'success',
            title: 'New Government Scheme',
            message: 'PM-KISAN subsidy payment released. Check your account.',
            time: '1 day ago',
            icon: Bell,
            color: 'green'
        }
    ]);

    const [showAlerts, setShowAlerts] = useState(true);

    const dismissAlert = (id) => {
        setAlerts(alerts.filter(alert => alert.id !== id));
    };

    // Weather graph data (7 days)
    const [weatherData, setWeatherData] = useState([]);
    const [loadingForecast, setLoadingForecast] = useState(true);

    useEffect(() => {
        const fetchForecast = async () => {
            try {
                // Get user location or default to Delhi
                const lat = 28.6139;
                const lon = 77.2090;

                const data = await smartFetch('forecast', { lat, lon });

                if (data.list) {
                    // Process 5-day forecast (3-hour intervals) into daily summary
                    const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00')).map(item => {
                        return {
                            day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
                            temp: Math.round(item.main.temp),
                            rainfall: item.rain ? item.rain['3h'] || 0 : 0,
                            humidity: item.main.humidity
                        };
                    });
                    setWeatherData(dailyData);
                }
            } catch (error) {
                console.error("Forecast load failed", error);
            } finally {
                setLoadingForecast(false);
            }
        };

        fetchForecast();
    }, []);

    // Weather Graph Component
    const WeatherGraph = () => {
        const maxTemp = Math.max(...weatherData.map(d => d.temp));
        const maxRain = Math.max(...weatherData.map(d => d.rainfall));
        const width = 700;
        const height = 200;
        const padding = 40;

        const getX = (index) => (index / (weatherData.length - 1)) * (width - 2 * padding) + padding;
        const getTempY = (temp) => height - padding - ((temp / maxTemp) * (height - 2 * padding));
        const getRainY = (rain) => height - padding - ((rain / maxRain) * (height - 2 * padding));

        const tempPoints = weatherData.map((d, i) => `${getX(i)},${getTempY(d.temp)}`).join(' ');
        const rainPoints = weatherData.map((d, i) => `${getX(i)},${getRainY(d.rainfall)}`).join(' ');

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Cloud className="h-6 w-6 text-blue-600" />
                        7-Day Weather Forecast
                    </h3>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span className="text-gray-600">Temperature (°C)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-600">Rainfall (mm)</span>
                        </div>
                    </div>
                </div>

                <div className="w-full overflow-x-auto">
                    <svg width={width} height={height} className="mx-auto">
                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4].map(i => {
                            const y = padding + (i * (height - 2 * padding) / 4);
                            return (
                                <line
                                    key={i}
                                    x1={padding}
                                    y1={y}
                                    x2={width - padding}
                                    y2={y}
                                    stroke="#e5e7eb"
                                    strokeWidth="1"
                                />
                            );
                        })}

                        {/* Rainfall bars */}
                        {weatherData.map((d, i) => (
                            <rect
                                key={`rain-${i}`}
                                x={getX(i) - 15}
                                y={getRainY(d.rainfall)}
                                width="30"
                                height={height - padding - getRainY(d.rainfall)}
                                fill="#3b82f6"
                                opacity="0.3"
                                rx="4"
                            />
                        ))}

                        {/* Temperature line */}
                        <polyline
                            points={tempPoints}
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Temperature points */}
                        {weatherData.map((d, i) => (
                            <g key={`temp-${i}`}>
                                <circle
                                    cx={getX(i)}
                                    cy={getTempY(d.temp)}
                                    r="5"
                                    fill="#f97316"
                                    stroke="white"
                                    strokeWidth="2"
                                />
                                <text
                                    x={getX(i)}
                                    y={getTempY(d.temp) - 15}
                                    textAnchor="middle"
                                    className="text-xs font-bold fill-orange-600"
                                >
                                    {d.temp}°
                                </text>
                            </g>
                        ))}

                        {/* Day labels */}
                        {weatherData.map((d, i) => (
                            <text
                                key={`day-${i}`}
                                x={getX(i)}
                                y={height - 15}
                                textAnchor="middle"
                                className="text-sm font-medium fill-gray-700"
                            >
                                {d.day}
                            </text>
                        ))}
                    </svg>
                </div>

                {/* Weather details */}
                <div className="grid grid-cols-7 gap-2 mt-4">
                    {weatherData.map((d, i) => (
                        <div key={i} className="text-center p-2 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-600 mb-1">{d.day}</div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-center gap-1 text-xs">
                                    <Droplets className="h-3 w-3 text-blue-500" />
                                    <span className="text-blue-600 font-medium">{d.rainfall}mm</span>
                                </div>
                                <div className="flex items-center justify-center gap-1 text-xs">
                                    <Wind className="h-3 w-3 text-gray-500" />
                                    <span className="text-gray-600">{d.humidity}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const stats = [
        { icon: Users, label: 'Active Farmers', value: '50K+', color: 'bg-green-100 text-green-700' },
        { icon: ShoppingBag, label: 'Daily Listings', value: '1.2K', color: 'bg-blue-100 text-blue-700' },
        { icon: TrendingUp, label: 'Avg. Profit Increase', value: '+23%', color: 'bg-amber-100 text-amber-700' },
        { icon: Calendar, label: 'Events This Month', value: '45', color: 'bg-purple-100 text-purple-700' }
    ];

    return (
        <div className="max-w-7xl mx-auto py-6 space-y-8">
            {/* Alerts Section */}
            {showAlerts && alerts.length > 0 && (
                <div className="space-y-3">
                    {alerts.map(alert => (
                        <div
                            key={alert.id}
                            className={`bg-${alert.color}-50 border-l-4 border-${alert.color}-500 p-4 rounded-lg flex items-start gap-4 shadow-sm`}
                        >
                            <div className={`p-2 bg-${alert.color}-100 rounded-lg`}>
                                <alert.icon className={`h-5 w-5 text-${alert.color}-600`} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className={`font-bold text-${alert.color}-900`}>{alert.title}</h4>
                                    <span className="text-xs text-gray-500">{alert.time}</span>
                                </div>
                                <p className={`text-sm text-${alert.color}-800`}>{alert.message}</p>
                            </div>
                            <button
                                onClick={() => dismissAlert(alert.id)}
                                className="p-1 hover:bg-white/50 rounded transition-colors"
                            >
                                <X className="h-4 w-4 text-gray-500" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

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

            {/* Weather Graph Section */}
            <WeatherGraph />

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
