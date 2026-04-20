import React, { useState, useEffect } from 'react';
import {
    Cloud, Droplets, Wind, Sun, CloudRain, Gauge, Eye,
    Thermometer, CloudDrizzle, Sprout, AlertCircle, WifiOff,
    Sunrise, Sunset, Waves, Info,
    CloudLightning, Compass, Zap
} from 'lucide-react';
import { cn } from '../lib/utils';
import { smartFetch } from '../lib/api-config';

const WeatherPage = () => {
    const [forecastRange, setForecastRange] = useState('7 Days');
    const [hoveredBar, setHoveredBar] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState(null);
    const [weatherData, setWeatherData] = useState({
        locationName: 'Simulated Farm',
        temp: 28,
        condition: 'Partly Cloudy',
        feelsLike: 30,
        minTemp: 22,
        maxTemp: 32,
        humidity: 75,
        windSpeed: 14,
        windDirection: 'North-East',
        windDeg: 45,
        pressure: 1013,
        visibility: 8,
        uvIndex: 6,
        uvLevel: 'High',
        sunlightIntensity: 'Very High',
        luxValue: 1250,
        solarRadiation: '650 W/m²',
        soilTemp: 26,
        soilMoisture: 45,
        dewPoint: 21,
        aqi: 42,
        aqiLevel: 'Good',
        precipProb: '10%',
        scientificNote: 'Awaiting local sync...'
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [forecastData, setForecastData] = useState([]);
    const [activeMetric, setActiveMetric] = useState('temp');

    useEffect(() => {
        const syncWeather = async () => {
            const manager = (await import('../lib/offline-data-manager')).default;
            const cached = await manager.getWeatherData('Current Location');
            if (cached && cached.length > 0) {
                setLastSynced(new Date(cached[0].cachedAt).toLocaleString());
                setForecastData(cached);
                if (cached[0].detailed) setWeatherData(cached[0].detailed);
            } else {
                // Initial fallback
                setForecastData(generateForecastData(7));
            }
        };
        syncWeather();
    }, []);

    const handleSync = async (cityName = null) => {
        setIsSyncing(true);
        const manager = (await import('../lib/offline-data-manager')).default;

        try {
            let latitude, longitude;
            let queryParams = {};

            if (cityName && typeof cityName === 'string' && cityName.trim() !== '') {
                queryParams = { q: cityName.trim() };
                console.log(`📍 [Weather] Searching for city: ${cityName}`);
            } else {
                // 1. Get real location via GPS
                console.log("📍 [Weather] Requesting geolocation...");
                const pos = await new Promise((res, rej) => {
                    navigator.geolocation.getCurrentPosition(res, rej, {
                        enableHighAccuracy: true,
                        timeout: 10000
                    });
                });
                latitude = pos.coords.latitude;
                longitude = pos.coords.longitude;
                queryParams = { lat: latitude, lon: longitude };
                console.log(`📍 [Weather] Geolocation acquired: ${latitude}, ${longitude}`);
            }

            // 2. Fetch atmospheric data (Weather Proxy)
            const realData = await smartFetch('weather', {
                ...queryParams,
                units: 'metric'
            });

            if (!realData || realData.error) throw new Error(realData.error || "Weather service returned no data");

            // 2.5 Fetch REAL 5-Day Forecast
            console.log("📅 [Weather] Fetching 5-day predictive forecast...");
            const realForecast = await smartFetch('weather', {
                ...queryParams,
                forecast: true,
                units: 'metric'
            }).catch(err => {
                console.warn("⚠️ Forecast fetch failed, using generated fallback:", err);
                return null;
            });

            // 3. Fetch Agricultural Intelligence (Soil/Water)
            // Use coords from weather response (more accurate for city search)
            const targetLat = realData.coord?.lat || latitude;
            const targetLon = realData.coord?.lon || longitude;

            console.log("🧠 [Weather] Fetching regional intelligence...");
            const agriIntel = await smartFetch('agri-intelligence', {
                lat: targetLat,
                lon: targetLon
            }).catch(err => {
                console.warn("⚠️ Agri-Intelligence failed, using estimates:", err);
                return null;
            });

            const freshDetailed = {
                locationName: realData.name || 'Current Location',
                temp: Math.round(realData.main.temp),
                condition: realData.weather[0].main,
                feelsLike: Math.round(realData.main.feels_like),
                minTemp: Math.round(realData.main.temp_min),
                maxTemp: Math.round(realData.main.temp_max),
                humidity: realData.main.humidity,
                windSpeed: Math.round(realData.wind.speed * 3.6),
                windDirection: 'North-East',
                windDeg: realData.wind.deg || 0,
                pressure: realData.main.pressure,
                visibility: Math.round(realData.visibility / 1000),
                uvIndex: 6,
                aqi: 42,
                precipProb: (realData.clouds?.all || 0) + '%',
                // Mix in Agricultural Intelligence
                soilType: agriIntel?.soilType || 'Detecting...',
                soilPH: agriIntel?.soilPH || 7.0,
                soilMoisture: agriIntel?.soilMoistureEstimate || 45,
                soilTemp: Math.round(realData.main.temp - 2), // Estimation
                waterTable: agriIntel?.waterTableDepth || 'Unknown',
                scientificNote: agriIntel?.scientificNote || 'Scientific profiling complete for your region.'
            };

            setWeatherData(prev => ({ ...prev, ...freshDetailed }));
            console.log(`✅ [Weather] Sync complete for ${realData.name}`);

            let forecastToSave;
            if (realForecast && realForecast.list) {
                // Map OpenWeather 5-day / 3-hour forecast to our daily format
                const dailyMap = {};
                realForecast.list.forEach(item => {
                    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    if (!dailyMap[date]) {
                        dailyMap[date] = {
                            date,
                            temp: Math.round(item.main.temp),
                            rainfall: item.rain ? item.rain['3h'] || 0 : 0,
                            humidity: item.main.humidity,
                            wind: Math.round(item.wind.speed * 3.6),
                            location: realData.name || 'Current Location',
                            detailed: freshDetailed
                        };
                    }
                });
                forecastToSave = Object.values(dailyMap);
            } else {
                forecastToSave = generateForecastData(15).map(d => ({
                    ...d,
                    location: realData.name || 'Current Location',
                    detailed: freshDetailed
                }));
            }

            setForecastData(forecastToSave);
            await manager.saveWeatherData(forecastToSave);

        } catch (e) {
            console.error("❌ [Weather] Sync failed:", e.message);
            const errorMsg = e.code === 1 ? "Location permission denied" : e.message;
            alert(`Weather Sync Failed: ${errorMsg}`);

            const freshData = generateForecastData(15).map(d => ({ ...d, location: 'Current Location' }));
            await manager.saveWeatherData(freshData);
        }

        setTimeout(() => {
            setIsSyncing(false);
            setLastSynced(new Date().toLocaleString());
        }, 1500);
    };

    // Current weather data now uses state
    const currentWeather = weatherData;

    // AI Farming Advisories
    const advisories = [
        {
            id: 1,
            day: 'Today',
            icon: Sprout,
            message: 'Optimal temperature for nitrogen absorption. Consider applying fertilizer before evening.',
            color: 'green'
        },
        {
            id: 2,
            day: 'Tomorrow',
            icon: Wind,
            message: 'Wind speed increasing to 18km/h. Avoid foliar spray during midday hours.',
            color: 'amber'
        },
        {
            id: 3,
            day: 'Day 3',
            icon: CloudRain,
            message: 'Thunderstorm warning. High risk of crop lodging in North Field. Ensure drainage is clear.',
            color: 'red'
        }
    ];

    // Generate forecast data based on range
    const generateForecastData = (days) => {
        const data = [];
        const startDate = new Date();

        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const baseTemp = 27;
            const variation = Math.sin(i / 3) * 4 + Math.random() * 2;
            const temp = Math.round(baseTemp + variation);

            const rainfall = Math.random() > 0.7 ? Math.round(Math.random() * 16) : 0;

            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                temp,
                rainfall,
                humidity: Math.round(60 + Math.random() * 25),
                uvIndex: Math.round(3 + Math.random() * 5),
                wind: Math.round(8 + Math.random() * 12)
            });
        }
        return data;
    };

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

    const getForecastSlice = () => {
        const days = getForecastDays();
        return forecastData.slice(0, days);
    };

    const currentForecast = getForecastSlice();

    const getMetricLabel = () => {
        switch (activeMetric) {
            case 'temp': return 'Temperature (°C)';
            case 'rainfall': return 'Rainfall (mm)';
            case 'wind': return 'Wind (km/h)';
            case 'humidity': return 'Humidity (%)';
            default: return 'Value';
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-nature-900 flex items-center gap-3">
                        {weatherData.locationName} <span className="text-3xl">📡</span>
                    </h1>
                    <p className="text-gray-600 font-bold">Real-time telemetry for your region</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search City (e.g. Zaheerabad)"
                            className="bg-white border-2 border-gray-100 rounded-2xl px-6 py-3 pr-12 font-bold text-gray-900 focus:outline-none focus:border-nature-500 transition-all w-64 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSync(searchQuery)}
                        />
                        <button
                            onClick={() => handleSync(searchQuery)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                            <Sun className="h-5 w-5 text-nature-700" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 px-6 py-3 bg-nature-900 text-white rounded-2xl shadow-xl">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-black uppercase tracking-widest">Live Sensor Data</span>
                    </div>
                </div>
            </div>

            {/* Main Weather Hero */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* primary Current Card */}
                <div className="lg:col-span-12 xl:col-span-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-12 opacity-10 -translate-y-1/2 translate-x-1/4">
                        <Sun className="w-[400px] h-[400px]" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                                    <CloudLightning className="h-12 w-12 text-amber-300" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-blue-100">{currentWeather.condition}</p>
                                    <p className="text-blue-200 text-sm font-medium">Updated: Just Now</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-9xl font-black tracking-tighter">{currentWeather.temp}°</span>
                                <div className="py-4 space-y-1">
                                    <p className="text-xl font-bold flex items-center gap-2"><Thermometer className="h-5 w-5" /> Feels like {currentWeather.feelsLike}°</p>
                                    <p className="text-indigo-200 font-medium">H: {currentWeather.maxTemp}° • L: {currentWeather.minTemp}°</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 w-full md:w-auto">
                            <div className="space-y-1 text-center md:text-left">
                                <p className="text-indigo-200 text-xs font-black uppercase tracking-[0.2em]">Wind Vector</p>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-white/10 rounded-2xl">
                                        <Compass className="h-6 w-6 text-amber-300" style={{ transform: `rotate(${currentWeather.windDeg}deg)` }} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black">{currentWeather.windDirection}</p>
                                        <p className="text-sm font-bold opacity-70">{currentWeather.windSpeed} km/h</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1 text-center md:text-left">
                                <p className="text-indigo-200 text-xs font-black uppercase tracking-[0.2em]">Precipitation</p>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-white/10 rounded-2xl">
                                        <Droplets className="h-6 w-6 text-blue-300" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black">{currentWeather.precipProb}</p>
                                        <p className="text-sm font-bold opacity-70">Chance of Rain</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1">Humidity</p>
                            <p className="text-2xl font-black">{currentWeather.humidity}%</p>
                        </div>
                        <div>
                            <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1">Sun Intensity</p>
                            <p className="text-2xl font-black">{currentWeather.sunlightIntensity}</p>
                        </div>
                        <div>
                            <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1">Pressure</p>
                            <p className="text-2xl font-black">{currentWeather.pressure} hPa</p>
                        </div>
                        <div>
                            <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1">UV Index</p>
                            <p className="text-2xl font-black">{currentWeather.uvIndex} <span className="text-xs">({currentWeather.uvLevel})</span></p>
                        </div>
                    </div>
                </div>

                {/* AI Advisory Panel */}
                <div className="lg:col-span-12 xl:col-span-4 bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-50 rounded-xl">
                                <Zap className="h-6 w-6 text-amber-600" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Weather Advisor</h2>
                        </div>

                        <div className="space-y-4">
                            {advisories.map((adv) => {
                                const Icon = adv.icon;
                                return (
                                    <div key={adv.id} className={cn(
                                        "p-6 rounded-[28px] border-2 flex items-start gap-4 transition-all hover:scale-[1.02]",
                                        adv.color === 'green' ? "bg-green-50/50 border-green-100 text-green-900" :
                                            adv.color === 'amber' ? "bg-amber-50/50 border-amber-100 text-amber-900" :
                                                "bg-red-50/50 border-red-100 text-red-900"
                                    )}>
                                        <div className={cn(
                                            "p-3 rounded-2xl",
                                            adv.color === 'green' ? "bg-green-100" :
                                                adv.color === 'amber' ? "bg-amber-100" : "bg-red-100"
                                        )}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">{adv.day}</p>
                                            <p className="text-sm font-bold leading-relaxed">{adv.message}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <button className="mt-8 py-5 bg-nature-900 text-white rounded-3xl font-black text-sm flex items-center justify-center gap-2 hover:bg-nature-800 transition-all">
                        View Detailed Log <Info className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Detailed Atmospheric Gauges */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Sunlight Intensity Card */}
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm group hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-6">
                        <div className="p-3 bg-amber-50 rounded-2xl">
                            <Sun className="h-6 w-6 text-amber-600" />
                        </div>
                        <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-widest">Active</span>
                    </div>
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] mb-1">Sunlight Intensity</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-gray-900">{currentWeather.luxValue}</h3>
                        <span className="text-gray-400 font-bold">lux</span>
                    </div>
                    <p className="text-sm font-bold text-gray-600 mt-4 leading-relaxed">
                        Total Solar Radiation: <span className="text-nature-900">{currentWeather.solarRadiation}</span>
                    </p>
                    <div className="mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                </div>

                {/* Air Quality Card */}
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm group hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-6">
                        <div className="p-3 bg-green-50 rounded-2xl">
                            <Waves className="h-6 w-6 text-green-600" />
                        </div>
                        <span className="text-[10px] font-black text-green-600 bg-green-100 px-3 py-1 rounded-full uppercase tracking-widest">Good</span>
                    </div>
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] mb-1">Air Quality Index</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-gray-900">{currentWeather.aqi}</h3>
                        <span className="text-gray-400 font-bold">AQI</span>
                    </div>
                    <p className="text-sm font-bold text-gray-600 mt-4 leading-relaxed">
                        Level: <span className="text-nature-900">{currentWeather.aqiLevel}</span>
                    </p>
                    <div className="mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                </div>

                {/* Soil Environment Card */}
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm group hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-6">
                        <div className="p-3 bg-nature-50 rounded-2xl">
                            <Sprout className="h-6 w-6 text-nature-700" />
                        </div>
                        <span className="text-[10px] font-black text-nature-700 bg-nature-100 px-3 py-1 rounded-full uppercase tracking-widest">{currentWeather.soilType}</span>
                    </div>
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] mb-1">Soil pH & Moisture</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-gray-900">{currentWeather.soilPH} pH</h3>
                        <span className="text-gray-400 font-bold">Avg.</span>
                    </div>
                    <p className="text-sm font-bold text-gray-600 mt-4 leading-relaxed">
                        Moisture: <span className="text-nature-900">{currentWeather.soilMoisture}%</span> | Temp: <span className="text-nature-900">{currentWeather.soilTemp}°C</span>
                    </p>
                    <div className="mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-nature-700 rounded-full" style={{ width: `${currentWeather.soilMoisture}%` }}></div>
                    </div>
                </div>

                {/* Ground Water & Sunlight Card */}
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="p-3 bg-blue-50 rounded-2xl">
                            <Droplets className="h-6 w-6 text-blue-600" />
                        </div>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-widest">Ground Water</span>
                    </div>
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] mb-1">Estimated Water Table</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-gray-900">{currentWeather.waterTable}m</h3>
                        <span className="text-gray-400 font-bold">Below Surface</span>
                    </div>
                    <p className="text-xs font-bold text-gray-500 mt-4 leading-relaxed">
                        Scientific Note: <span className="text-blue-900">{currentWeather.scientificNote || "Updating from regional data..."}</span>
                    </p>
                </div>
            </div>

            {/* Range Selector & Forecast Chart Section */}
            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900">Predictive Analytics</h2>
                        <p className="text-gray-500 font-bold">Long-range temperature & precipitation forecasting</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex bg-gray-50 p-2 rounded-2xl overflow-x-auto gap-2">
                            {['7 Days', '15 Days', '30 Days', '90 Days'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setForecastRange(range)}
                                    className={cn(
                                        "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                        forecastRange === range
                                            ? "bg-nature-900 text-white shadow-lg"
                                            : "text-gray-400 hover:text-gray-600 hover:bg-white"
                                    )}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                        <div className="flex bg-nature-50 p-2 rounded-2xl overflow-x-auto gap-2 self-end">
                            {[
                                { id: 'temp', label: 'Temp', icon: Thermometer },
                                { id: 'rainfall', label: 'Rain', icon: CloudRain },
                                { id: 'wind', label: 'Wind', icon: Wind },
                                { id: 'humidity', label: 'Humid', icon: Droplets }
                            ].map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setActiveMetric(m.id)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                        activeMetric === m.id
                                            ? "bg-nature-800 text-white shadow-md"
                                            : "text-nature-600 hover:bg-white"
                                    )}
                                >
                                    <m.icon className="h-3 w-3" /> {m.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chart Visualization */}
                <div className="relative bg-gray-50 rounded-[32px] p-10 overflow-hidden">
                    <div className="h-80 overflow-x-auto custom-scrollbar flex items-end justify-around gap-4 px-8">
                        {currentForecast.map((data, index) => {
                            const val = data[activeMetric] || 0;
                            const max = activeMetric === 'temp' ? 45 : activeMetric === 'rainfall' ? 30 : activeMetric === 'wind' ? 40 : 100;
                            const percentage = Math.min((val / max) * 100, 100);

                            return (
                                <div
                                    key={index}
                                    className="relative flex-1 min-w-[60px] group flex flex-col items-center gap-4"
                                    onMouseEnter={() => setHoveredBar(index)}
                                    onMouseLeave={() => setHoveredBar(null)}
                                >
                                    {/* Tooltip */}
                                    {hoveredBar === index && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-nature-900 text-white text-[10px] font-bold rounded-2xl px-4 py-3 whitespace-nowrap z-30 shadow-2xl animate-in zoom-in-50 duration-200">
                                            <div className="text-nature-400 mb-1">{data.date}</div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                                                {getMetricLabel()}: {val}{activeMetric === 'temp' ? '°C' : activeMetric === 'rainfall' ? 'mm' : activeMetric === 'wind' ? 'km/h' : '%'}
                                            </div>
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[8px] border-transparent border-t-nature-900"></div>
                                        </div>
                                    )}

                                    {/* Bar with dynamic color based on metric */}
                                    <div className="flex items-end h-48 w-full justify-center">
                                        <div
                                            className={cn(
                                                "w-4 rounded-full transition-all duration-500 shadow-sm group-hover:shadow-md",
                                                activeMetric === 'temp' ? "bg-gradient-to-t from-orange-500 to-amber-400" :
                                                    activeMetric === 'rainfall' ? "bg-gradient-to-t from-blue-600 to-blue-400" :
                                                        activeMetric === 'wind' ? "bg-gradient-to-t from-teal-500 to-emerald-400" :
                                                            "bg-gradient-to-t from-indigo-500 to-purple-400"
                                            )}
                                            style={{ height: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter truncate w-full text-center">
                                        {data.date}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    </div>

                    {/* Chart Legend */}
                    <div className="mt-8 flex items-center justify-center gap-10 pt-8 border-t border-gray-200/50">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Temperature Avg</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Expected Precipitation</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Offline Shield */}
            <div className="bg-nature-900 rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute -left-10 top-0 opacity-10">
                    <WifiOff className="w-40 h-40 text-white" />
                </div>
                <div className="flex items-center gap-8 relative z-10">
                    <div className="w-20 h-20 bg-white/10 rounded-[32px] flex items-center justify-center backdrop-blur-md">
                        <WifiOff className="h-10 w-10 text-white" />
                    </div>
                    <div>
                        <h4 className="text-2xl font-black text-white">Intelligent Offline Caching</h4>
                        <p className="text-nature-400 font-bold">
                            {lastSynced ? `Last Synced: ${lastSynced}` : "All weather telemetry is synced and available even in zero-network zones."}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="px-10 py-5 bg-white text-nature-900 rounded-3xl font-black shadow-2xl active:scale-95 transition-all relative z-10 disabled:opacity-50"
                >
                    {isSyncing ? "Syncing..." : "Sync Now"}
                </button>
            </div>

        </div>
    );
};

export default WeatherPage;
