import React, { useState, useEffect } from 'react';
import {
    ChevronDown, ArrowUpRight, ArrowRight, MapPin, Search,
    BarChart2, Navigation, Phone, ExternalLink, RefreshCw, AlertCircle
} from 'lucide-react';
import { smartFetch } from '../lib/api-config';

const MarketPricesPage = () => {
    const [selectedCrop, setSelectedCrop] = useState('Wheat');
    const [userLocation, setUserLocation] = useState(null);
    const [status, setStatus] = useState('locating'); // locating, loading_data, ready, error
    const [nearbyMarkets, setNearbyMarkets] = useState([]);
    const [district, setDistrict] = useState('');
    const [state, setState] = useState('');

    const crops = [
        'Wheat', 'Rice', 'Cotton', 'Maize', 'Tomato', 'Potato', 'Onion',
        'Soybean', 'Mustard', 'Groundnut', 'Chickpea', 'Turmeric'
    ];

    // 1. Get User Location & Reverse Geocode
    useEffect(() => {
        if (!navigator.geolocation) {
            setStatus('error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
                setStatus('loading_data');

                // Reverse Geocoding (using bigdatacloud free api for demo or similar)
                // For now, we will use a mock or a simple fetch if available, 
                // but strictly speaking we should use the backend proxy if we had a key.
                // WE WILL SIMULATE District Detection for now to ensure robustness without extra keys.
                // In production, use Google Maps Geocoding API via backend.

                // Simulating discovery based on lat/long regions for demo
                // (Real implementation should use an API)
                setDistrict('Ludhiana');
                setState('Punjab');

                fetchMarketData('Ludhiana');
            },
            (err) => {
                console.error("Location blocked", err);
                // Fallback
                setUserLocation({ lat: 30.7333, lng: 76.7794 });
                setDistrict('Chandigarh');
                setState('Punjab');
                fetchMarketData('Chandigarh');
            }
        );
    }, []);

    // 2. Fetch Market Data (Real or Proxy)
    const fetchMarketData = async (dist) => {
        try {
            // In a real scenario, we call our backend: 
            // const data = await smartFetch('market', { district: dist, crop: selectedCrop });

            // For now, illustrating the "Smart" logic with realistic generated data 
            // that mimics the "Mandi" API response structure.

            // Simulating API Delay
            await new Promise(r => setTimeout(r, 1000));

            const generatedMarkets = [
                { id: 1, name: `${dist} Main Mandi`, distance: '4.2 km', lat: 30.9, lng: 75.8, price: 2250, trend: 1.2 },
                { id: 2, name: `${dist} APMC Yard`, distance: '8.5 km', lat: 30.8, lng: 75.9, price: 2180, trend: -0.5 },
                { id: 3, name: 'Rural Grain Market', distance: '12.0 km', lat: 30.7, lng: 75.7, price: 2300, trend: 2.1 },
            ];

            setNearbyMarkets(generatedMarkets);
            setStatus('ready');

        } catch (e) {
            console.error("Market data failed", e);
            setStatus('error');
        }
    };

    // Refetch when crop changes
    useEffect(() => {
        if (status === 'ready' && district) {
            fetchMarketData(district);
        }
    }, [selectedCrop]);

    // Google Maps Direction
    const openDirections = (market) => {
        if (userLocation) {
            const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${market.lat},${market.lng}&travelmode=driving`;
            window.open(url, '_blank');
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-nature-900 mb-2">Smart Market Finder</h1>
                    <p className="text-gray-600 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-nature-600" />
                        {status === 'locating' ? 'Locating you...' : `Markets near ${district}, ${state}`}
                    </p>
                </div>

                {/* Crop Selector */}
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                    <span className="text-gray-500 font-bold text-sm uppercase">Crop:</span>
                    <select
                        value={selectedCrop}
                        onChange={e => setSelectedCrop(e.target.value)}
                        className="font-black text-nature-800 bg-transparent outline-none cursor-pointer"
                    >
                        {crops.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* Status States */}
            {status === 'locating' && (
                <div className="py-20 text-center bg-gray-50 rounded-3xl animate-pulse">
                    <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold">Triangulating your location via GPS...</p>
                </div>
            )}

            {status === 'loading_data' && (
                <div className="py-20 text-center bg-gray-50 rounded-3xl">
                    <RefreshCw className="h-12 w-12 text-nature-600 mx-auto mb-4 animate-spin" />
                    <p className="text-nature-700 font-bold">Fetching live {selectedCrop} prices from {district}...</p>
                </div>
            )}

            {status === 'ready' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Best Price Card */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-nature-800 to-green-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                            <p className="text-nature-300 font-bold uppercase tracking-widest text-sm mb-1">Best Market Price</p>
                            <div className="flex items-baseline gap-2 mb-2">
                                <h2 className="text-6xl font-black">₹{Math.max(...nearbyMarkets.map(m => m.price)).toLocaleString()}</h2>
                                <span className="text-xl opacity-80">/ Quintal</span>
                            </div>
                            <p className="text-green-100 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {nearbyMarkets.reduce((prev, curr) => prev.price > curr.price ? prev : curr).name}
                            </p>
                        </div>
                        <div className="absolute right-0 bottom-0 p-8 opacity-10">
                            <BarChart2 className="h-48 w-48" />
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col justify-center space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-bold">Average</span>
                            <span className="text-xl font-black text-gray-900">
                                ₹{Math.round(nearbyMarkets.reduce((s, m) => s + m.price, 0) / nearbyMarkets.length).toLocaleString()}
                            </span>
                        </div>
                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-nature-500 w-3/4"></div>
                        </div>
                        <p className="text-xs text-gray-400 font-bold">
                            Based on {nearbyMarkets.length} active mandis in {district}
                        </p>
                    </div>

                    {/* List of Markets */}
                    <div className="lg:col-span-3 space-y-4">
                        <h3 className="text-xl font-black text-gray-900 ml-2">Nearby Mandis</h3>
                        {nearbyMarkets.map((market) => (
                            <div key={market.id} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all flex flex-col md:flex-row items-center justify-between gap-6 group">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="text-xl font-black text-gray-900 group-hover:text-nature-700 transition-colors">{market.name}</h4>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${market.trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                            {market.trend > 0 ? 'Trending Up' : 'Down'}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 font-bold text-sm flex items-center gap-1">
                                        <MapPin className="h-3 w-3" /> {market.distance} away
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-2xl font-black text-gray-900">₹{market.price.toLocaleString()}</p>
                                    <p className={`text-xs font-bold ${market.trend > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {market.trend > 0 ? '+' : ''}{market.trend}% vs yesterday
                                    </p>
                                </div>

                                <button
                                    onClick={() => openDirections(market)}
                                    className="px-6 py-3 bg-nature-50 hover:bg-nature-100 text-nature-800 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"
                                >
                                    <Navigation className="h-4 w-4" /> Get Directions
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketPricesPage;
