import React, { useState, useEffect } from 'react';
import { CloudSun, Droplets, Wind, Loader, CloudRain, Sun, Cloud } from 'lucide-react';
import { smartFetch } from '../lib/api-config';

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Get user location or default to Delhi
                const lat = 28.6139;
                const lon = 77.2090;

                const data = await smartFetch('weather', { lat, lon });
                setWeather(data);
            } catch (error) {
                console.error("Weather load failed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (loading) return (
        <div className="bg-orange-50 p-6 rounded-2xl flex items-center justify-center h-48 border border-orange-100">
            <Loader className="h-8 w-8 text-orange-400 animate-spin" />
        </div>
    );

    if (!weather) return (
        <div className="bg-orange-50 p-6 rounded-2xl flex items-center justify-center h-48 border border-orange-100">
            <p className="text-orange-400">Weather Unavailable</p>
        </div>
    );

    const isRain = weather.weather[0].main.toLowerCase().includes('rain');
    const isClear = weather.weather[0].main.toLowerCase().includes('clear');

    return (
        <div className="bg-orange-50 p-6 rounded-2xl flex flex-col justify-between h-48 border border-orange-100">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm font-medium">Today's Weather ({weather.name})</p>
                    <div className="flex items-center gap-3 mt-2">
                        <h2 className="text-4xl font-bold text-gray-800">{Math.round(weather.main.temp)}°C</h2>
                        {isRain ? <CloudRain className="h-8 w-8 text-blue-500" /> :
                            isClear ? <Sun className="h-8 w-8 text-orange-400" /> :
                                <Cloud className="h-8 w-8 text-gray-500" />}
                    </div>
                    <p className="text-gray-600 mt-1 capitalize">{weather.weather[0].description}</p>
                </div>

                <div className="text-right space-y-2">
                    <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
                        <span>{weather.main.humidity}%</span>
                        <Droplets className="h-4 w-4 text-orange-400" />
                    </div>
                    <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
                        <span>{weather.wind.speed} m/s</span>
                        <Wind className="h-4 w-4 text-orange-400" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
