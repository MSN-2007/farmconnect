import React, { useState } from 'react';
import {
    Cloud,
    Droplets,
    Wind,
    Sun,
    CloudRain,
    Gauge,
    Eye,
    Thermometer,
    CloudDrizzle,
    Sprout,
    AlertCircle,
    WifiOff
} from 'lucide-react';
import { cn } from '../lib/utils';

const WeatherPage = () => {
    const [forecastRange, setForecastRange] = useState('7 Days');
    const [hoveredBar, setHoveredBar] = useState(null);

    // Current Weather Data
    const currentWeather = {
        temp: 28,
        condition: 'Partly Cloudy',
        feelsLike: 30,
        minTemp: 22,
        maxTemp: 32,
        humidity: 75,
        wind: 12,
        pressure: 1013,
        visibility: 8,
        uvIndex: 6,
        uvLevel: 'High',
        sunlight: 650,
        soilTemp: 26,
        soilMoisture: 45
    };

    // AI Farming Advisories
    const advisories = [
        {
            id: 1,
            day: 'Today',
            icon: Sprout,
            message: 'Good day for irrigation. Temperatures are moderate and humidity is ideal.',
            color: 'green'
        },
        {
            id: 2,
            day: 'Tomorrow',
            icon: Sun,
            message: 'Excellent conditions for spraying pesticides. Low wind and sunny weather.',
            color: 'amber'
        },
        {
            id: 3,
            day: 'Day 3',
            icon: CloudRain,
            message: 'Heavy rain expected. Postpone outdoor activities and secure equipment.',
            color: 'red'
        }
    ];

    // Generate forecast data based on range
    const generateForecastData = (days) => {
        const data = [];
        const startDate = new Date(2024, 10, 20); // Nov 20, 2024

        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            // Generate realistic temperature (22-32°C range)
            const baseTemp = 27;
            const variation = Math.sin(i / 3) * 4 + Math.random() * 2;
            const temp = Math.round(baseTemp + variation);

            // Generate rainfall (0-16mm, with some days having no rain)
            const rainfall = Math.random() > 0.6 ? Math.round(Math.random() * 16) : Math.round(Math.random() * 4);

            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                temp,
                rainfall,
                humidity: Math.round(60 + Math.random() * 25),
                uvIndex: Math.round(3 + Math.random() * 5),
                wind: Math.round(8 + Math.random() * 10)
            });
        }

        return data;
    };

    // Get forecast data based on selected range
    const getForecastDays = () => {
        switch (forecastRange) {
            case '7 Days': return 7;
            case '15 Days': return 15;
            case '30 Days': return 30;
            case '45 Days': return 45;
            case '90 Days': return 90;
            default: return 7;
        }
    };

    const forecastData = generateForecastData(getForecastDays());

    // 7-Day Forecast for cards
    const forecast = [
        {
            day: 'Today',
            date: 'Nov 20',
            icon: Cloud,
            temp: 28,
            minTemp: 22,
            maxTemp: 30,
            condition: 'Partly Cloudy',
            humidity: 75,
            uvIndex: 6,
            wind: 12
        },
        {
            day: 'Tomorrow',
            date: 'Nov 21',
            icon: Sun,
            temp: 30,
            minTemp: 23,
            maxTemp: 33,
            condition: 'Sunny',
            humidity: 65,
            uvIndex: 8,
            wind: 8
        },
        {
            day: 'Day 3',
            date: 'Nov 22',
            icon: CloudRain,
            temp: 26,
            minTemp: 21,
            maxTemp: 28,
            condition: 'Rainy',
            humidity: 85,
            uvIndex: 3,
            wind: 18
        },
        {
            day: 'Day 4',
            date: 'Nov 23',
            icon: Cloud,
            temp: 27,
            minTemp: 22,
            maxTemp: 29,
            condition: 'Partly Cloudy',
            humidity: 70,
            uvIndex: 5,
            wind: 10
        },
        {
            day: 'Day 5',
            date: 'Nov 24',
            icon: Sun,
            temp: 29,
            minTemp: 24,
            maxTemp: 32,
            condition: 'Sunny',
            humidity: 60,
            uvIndex: 7,
            wind: 9
        },
        {
            day: 'Day 6',
            date: 'Nov 25',
            icon: Cloud,
            temp: 28,
            minTemp: 23,
            maxTemp: 30,
            condition: 'Partly Cloudy',
            humidity: 68,
            uvIndex: 6,
            wind: 11
        },
        {
            day: 'Day 7',
            date: 'Nov 26',
            icon: Cloud,
            temp: 27,
            minTemp: 22,
            maxTemp: 29,
            condition: 'Cloudy',
            humidity: 72,
            uvIndex: 4,
            wind: 13
        }
    ];

    // Temperature chart data (mock)
    const tempChartData = forecast.map(f => ({ temp: f.temp, humidity: f.humidity }));

    return (
        <div className="max-w-7xl mx-auto py-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <h1 className="text-3xl font-bold text-nature-900">Weather & Environment Monitor</h1>
                <span className="text-2xl">🌦️</span>
            </div>

            {/* Current Weather Section */}
            <div className="bg-gradient-to-br from-amber-50 to-green-50 rounded-xl shadow-sm border border-amber-100 p-6 mb-6">
                <h2 className="text-sm font-semibold text-gray-600 mb-4">Current Weather</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {/* Temperature */}
                    <div className="lg:col-span-2">
                        <div className="flex items-start gap-3">
                            <Cloud className="h-12 w-12 text-amber-500 mt-2" />
                            <div>
                                <div className="text-5xl font-bold text-nature-900">{currentWeather.temp}°C</div>
                                <div className="text-sm text-gray-600 mt-1">{currentWeather.condition}</div>
                                <div className="text-xs text-gray-500 mt-1">Feels like {currentWeather.feelsLike}°C</div>
                                <div className="text-xs text-gray-500">Min: {currentWeather.minTemp}°C • Max: {currentWeather.maxTemp}°C</div>
                            </div>
                        </div>
                    </div>

                    {/* Humidity */}
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="flex items-center gap-2 text-amber-600 mb-1">
                            <Droplets className="h-4 w-4" />
                            <span className="text-xs font-medium text-gray-600">Humidity</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{currentWeather.humidity}%</div>
                    </div>

                    {/* Wind */}
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="flex items-center gap-2 text-amber-600 mb-1">
                            <Wind className="h-4 w-4" />
                            <span className="text-xs font-medium text-gray-600">Wind</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{currentWeather.wind} km/h</div>
                    </div>

                    {/* UV Index */}
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="flex items-center gap-2 text-amber-600 mb-1">
                            <Sun className="h-4 w-4" />
                            <span className="text-xs font-medium text-gray-600">UV Index</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{currentWeather.uvIndex} ({currentWeather.uvLevel})</div>
                    </div>

                    {/* Sunlight */}
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="flex items-center gap-2 text-amber-600 mb-1">
                            <Sun className="h-4 w-4" />
                            <span className="text-xs font-medium text-gray-600">Sunlight</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{currentWeather.sunlight} lux</div>
                    </div>

                    {/* Pressure */}
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="flex items-center gap-2 text-amber-600 mb-1">
                            <Gauge className="h-4 w-4" />
                            <span className="text-xs font-medium text-gray-600">Pressure</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{currentWeather.pressure} mb</div>
                    </div>

                    {/* Visibility */}
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="flex items-center gap-2 text-amber-600 mb-1">
                            <Eye className="h-4 w-4" />
                            <span className="text-xs font-medium text-gray-600">Visibility</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{currentWeather.visibility} km</div>
                    </div>

                    {/* Soil Temp */}
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="flex items-center gap-2 text-amber-600 mb-1">
                            <Thermometer className="h-4 w-4" />
                            <span className="text-xs font-medium text-gray-600">Soil Temp</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{currentWeather.soilTemp}°C</div>
                    </div>

                    {/* Soil Moisture */}
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="flex items-center gap-2 text-amber-600 mb-1">
                            <CloudDrizzle className="h-4 w-4" />
                            <span className="text-xs font-medium text-gray-600">Soil Moist.</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{currentWeather.soilMoisture}%</div>
                    </div>
                </div>
            </div>

            {/* AI Farming Advisories */}
            <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <h2 className="text-lg font-bold text-gray-900">AI Farming Advisories</h2>
                </div>

                <div className="space-y-3">
                    {advisories.map((advisory) => (
                        <div
                            key={advisory.id}
                            className={cn(
                                "rounded-lg p-4 border",
                                advisory.color === 'green' && "bg-green-50 border-green-200",
                                advisory.color === 'amber' && "bg-amber-50 border-amber-200",
                                advisory.color === 'red' && "bg-red-50 border-red-200"
                            )}
                        >
                            <div className="flex items-start gap-3">
                                <advisory.icon className={cn(
                                    "h-5 w-5 flex-shrink-0 mt-0.5",
                                    advisory.color === 'green' && "text-green-600",
                                    advisory.color === 'amber' && "text-amber-600",
                                    advisory.color === 'red' && "text-red-600"
                                )} />
                                <div>
                                    <h3 className={cn(
                                        "font-bold text-sm mb-1",
                                        advisory.color === 'green' && "text-green-900",
                                        advisory.color === 'amber' && "text-amber-900",
                                        advisory.color === 'red' && "text-red-900"
                                    )}>
                                        {advisory.day}
                                    </h3>
                                    <p className={cn(
                                        "text-sm",
                                        advisory.color === 'green' && "text-green-700",
                                        advisory.color === 'amber' && "text-amber-700",
                                        advisory.color === 'red' && "text-red-700"
                                    )}>
                                        {advisory.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Forecast Range Selector */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['7 Days', '15 Days', '30 Days', '45 Days', '90 Days'].map((range) => (
                    <button
                        key={range}
                        onClick={() => setForecastRange(range)}
                        className={cn(
                            "px-6 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border",
                            forecastRange === range
                                ? "bg-white border-gray-300 text-gray-900 shadow-sm"
                                : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200"
                        )}
                    >
                        {range}
                    </button>
                ))}
            </div>

            {/* 7-Day Detailed Forecast */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">7-Day Detailed Forecast</h2>

                {/* Forecast Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                    {forecast.map((day, index) => (
                        <div key={index} className="text-center">
                            <div className="text-sm font-semibold text-gray-900 mb-1">{day.day}</div>
                            <div className="text-xs text-gray-500 mb-3">{day.date}</div>
                            <day.icon className={cn(
                                "h-10 w-10 mx-auto mb-3",
                                day.condition.includes('Rain') ? 'text-blue-500' :
                                    day.condition.includes('Sunny') ? 'text-amber-500' : 'text-gray-400'
                            )} />
                            <div className="text-2xl font-bold text-gray-900 mb-1">{day.temp}°</div>
                            <div className="text-xs text-gray-500 mb-2">{day.minTemp}° - {day.maxTemp}°</div>
                            <div className="text-xs text-gray-600 mb-2">{day.condition}</div>
                            <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                                <Droplets className="h-3 w-3" />
                                <span>{day.humidity}%</span>
                            </div>
                            <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                                <Sun className="h-3 w-3" />
                                <span>UV {day.uvIndex}</span>
                            </div>
                            <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                                <Wind className="h-3 w-3" />
                                <span>{day.wind} km/h</span>
                            </div>
                        </div>
                    ))}
                </div>


                {/* Temperature & Rainfall Bar Chart */}
                <div className="relative">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        {forecastRange} Temperature & Rainfall Forecast
                    </h3>

                    <div className="relative bg-white rounded-lg p-4 border border-gray-200">
                        {/* Chart Container */}
                        <div className="relative h-80 overflow-x-auto">
                            <div style={{ minWidth: `${Math.max(700, forecastData.length * 50)}px` }} className="h-full relative">
                                {/* Grid Lines */}
                                <div className="absolute inset-0">
                                    {[0, 8, 16, 24, 32].map((val) => (
                                        <div
                                            key={val}
                                            className="absolute w-full border-t border-dashed border-gray-200"
                                            style={{ bottom: `${(val / 32) * 100}%` }}
                                        >
                                            <span className="absolute -left-8 -top-2 text-xs text-gray-400">{val}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Right Y-axis labels (Rainfall) */}
                                <div className="absolute right-0 inset-y-0">
                                    {[0, 4, 8, 12, 16].map((val) => (
                                        <span
                                            key={val}
                                            className="absolute -right-8 text-xs text-gray-400"
                                            style={{ bottom: `${(val / 16) * 100}%`, transform: 'translateY(50%)' }}
                                        >
                                            {val}
                                        </span>
                                    ))}
                                </div>

                                {/* Bars */}
                                <div className="absolute inset-0 flex items-end justify-around px-8">
                                    {forecastData.map((data, index) => (
                                        <div
                                            key={index}
                                            className="relative flex-1 max-w-[40px] mx-1"
                                            onMouseEnter={() => setHoveredBar(index)}
                                            onMouseLeave={() => setHoveredBar(null)}
                                        >
                                            {/* Tooltip */}
                                            {hoveredBar === index && (
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10 shadow-lg">
                                                    <div className="font-semibold mb-1">{data.date}</div>
                                                    <div className="text-green-300">Temperature (°C) : {data.temp}</div>
                                                    <div className="text-amber-300">Rainfall (mm) : {data.rainfall}</div>
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                                                        <div className="w-2 h-2 bg-gray-800 transform rotate-45"></div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Temperature Bar (Green) */}
                                            <div
                                                className="absolute bottom-0 left-0 w-1/2 bg-green-600 hover:bg-green-700 transition-colors cursor-pointer rounded-t"
                                                style={{ height: `${(data.temp / 32) * 100}%` }}
                                            />

                                            {/* Rainfall Bar (Orange) */}
                                            <div
                                                className="absolute bottom-0 right-0 w-1/2 bg-amber-500 hover:bg-amber-600 transition-colors cursor-pointer rounded-t"
                                                style={{ height: `${(data.rainfall / 16) * 100}%` }}
                                            />

                                            {/* Date Label */}
                                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap transform -rotate-0">
                                                {data.date}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center justify-center gap-6 mt-8 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-600 rounded"></div>
                                <span className="text-sm text-gray-700">Temperature (°C)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-amber-500 rounded"></div>
                                <span className="text-sm text-gray-700">Rainfall (mm)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Offline Mode Notice */}
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 flex items-center gap-3">
                <WifiOff className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                    <span className="font-semibold">Offline Mode:</span> Last 10 days of weather data cached for offline access. Data will refresh when you're back online.
                </p>
            </div>
        </div>
    );
};

export default WeatherPage;
