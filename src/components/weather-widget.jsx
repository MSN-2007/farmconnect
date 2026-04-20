import React, { useState, useEffect, useCallback } from 'react';
import { CloudSun, Droplets, Wind, Loader, CloudRain, Sun, Cloud, MapPin, RefreshCw } from 'lucide-react';
import { smartFetch } from '../lib/api-config';

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locationName, setLocationName] = useState('Detecting...');

    const fetchWeather = useCallback(async (forced = false) => {
        setLoading(true);
        setError(null);
        try {
            let lat = 28.6139; // Default Delhi
            let lon = 77.2090;

            // Try to get real location
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 5000
                    });
                });
                lat = position.coords.latitude;
                lon = position.coords.longitude;
                setLocationName('Current Location');
                console.log(`📍 Location acquired: ${lat}, ${lon}`);
            } catch (err) {
                console.warn("Location access denied or timed out, using default.", err);
                setLocationName('Delhi (Default)');
            }

            const data = await smartFetch('weather', { lat, lon });
            if (data.error) throw new Error(data.error);
            
            setWeather(data);
        } catch (error) {
            console.error("Weather load failed", error);
            setError("Failed to load weather data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWeather();
    }, [fetchWeather]);

    if (loading) return (
        <div className="bg-orange-50 p-6 rounded-2xl flex flex-col items-center justify-center h-48 border border-orange-100">
            <Loader className="h-8 w-8 text-orange-400 animate-spin mb-2" />
            <p className="text-orange-400 text-sm font-medium">Syncing Atmosphere...</p>
        </div>
    );

    if (error || !weather) return (
        <div className="bg-orange-50 p-6 rounded-2xl flex flex-col items-center justify-center h-48 border border-orange-100">
            <p className="text-orange-400 font-medium mb-2">{error || 'Weather Unavailable'}</p>
            <button 
                onClick={() => fetchWeather(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-xl text-sm font-bold hover:bg-orange-200 transition-colors"
            >
                <RefreshCw className="h-4 w-4" /> Retry
            </button>
        </div>
    );

    const isRain = weather.weather?.[0]?.main?.toLowerCase().includes('rain') || false;
    const isClear = weather.weather?.[0]?.main?.toLowerCase().includes('clear') || false;

    return (
        <div className="bg-orange-50 p-6 rounded-2xl flex flex-col justify-between h-48 border border-orange-100 relative group">
            <button 
                onClick={() => fetchWeather(true)}
                className="absolute top-4 right-4 p-2 bg-white/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-orange-600"
                title="Refresh Weather"
            >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                        <MapPin className="h-3 w-3 text-orange-400" />
                        <p>{weather.name || locationName}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                        <h2 className="text-4xl font-bold text-gray-800">{Math.round(weather.main.temp)}°C</h2>
                        {isRain ? <CloudRain className="h-8 w-8 text-blue-500" /> :
                            isClear ? <Sun className="h-8 w-8 text-orange-400" /> :
                                <Cloud className="h-8 w-8 text-gray-500" />}
                    </div>
                    <p className="text-gray-600 mt-1 capitalize">{weather.weather?.[0]?.description ?? 'Unknown'}</p>
                </div>

                <div className="text-right space-y-2 mt-6">
                    <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
                        <span>{weather.main.humidity}%</span>
                        <Droplets className="h-4 w-4 text-orange-400" />
                    </div>
                    <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
                        <span>{Math.round(weather.wind.speed * 3.6)} km/h</span>
                        <Wind className="h-4 w-4 text-orange-400" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;

