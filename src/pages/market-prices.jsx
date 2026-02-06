import React, { useState } from 'react';
import {
    ChevronDown,
    ArrowUpRight,
    ArrowRight,
    MapPin,
    Search,
    BarChart2,
    MessageCircle
} from 'lucide-react';

const MarketPricesPage = () => {
    const [selectedCrop, setSelectedCrop] = useState('Wheat');
    const [radius, setRadius] = useState('Within 15 km');
    const [timeRange, setTimeRange] = useState('7 Days');

    // Generate dynamic price history based on crop and time range
    const generatePriceHistory = (crop, range) => {
        const days = parseInt(range.split(' ')[0]);
        const basePrices = {
            'Wheat': 2100,
            'Rice': 3200,
            'Cotton': 7200,
            'Maize': 1800
        };

        const basePrice = basePrices[crop] || 2000;
        const data = [];

        for (let i = 0; i < days; i++) {
            // Generate realistic price variations
            const trend = Math.sin(i / 3) * 50; // Cyclical trend
            const randomVariation = (Math.random() - 0.5) * 80; // Random daily variation
            const price = Math.round(basePrice + trend + randomVariation + (i * 5)); // Slight upward trend

            data.push({
                day: days <= 7 ? `Day ${i + 1}` : `D${i + 1}`,
                price: price
            });
        }

        return data;
    };

    const priceHistory = generatePriceHistory(selectedCrop, timeRange);

    // Generate dynamic nearby markets based on selected crop
    const generateNearbyMarkets = (crop) => {
        const basePrices = {
            'Wheat': 2200,
            'Rice': 3300,
            'Cotton': 7400,
            'Maize': 1900
        };

        const basePrice = basePrices[crop] || 2000;

        return [
            {
                id: 1,
                name: 'District Market',
                distance: '12 km',
                price: Math.round(basePrice + (Math.random() - 0.5) * 100),
                trend: +(Math.random() * 3).toFixed(1)
            },
            {
                id: 2,
                name: 'Central Mandi',
                distance: '14 km',
                price: Math.round(basePrice - 50 + (Math.random() - 0.5) * 100),
                trend: +(Math.random() * 2).toFixed(1)
            },
            {
                id: 3,
                name: 'APMC Yard',
                distance: '8 km',
                price: Math.round(basePrice - 100 + (Math.random() - 0.5) * 100),
                trend: +(Math.random() * 1.5).toFixed(1)
            },
        ];
    };

    const nearbyMarkets = generateNearbyMarkets(selectedCrop);

    // Simple SVG Line Chart Component with Tooltips
    const PriceChart = () => {
        const [hoveredPoint, setHoveredPoint] = useState(null);
        const maxPrice = Math.max(...priceHistory.map(p => p.price)) + 100;
        const minPrice = Math.min(...priceHistory.map(p => p.price)) - 100;
        const width = 800;
        const height = 200;
        const padding = 40;

        const getX = (index) => (index / (priceHistory.length - 1)) * (width - 2 * padding) + padding;
        const getY = (price) => height - padding - ((price - minPrice) / (maxPrice - minPrice)) * (height - 2 * padding);

        const points = priceHistory.map((d, i) => `${getX(i)},${getY(d.price)}`).join(' ');

        return (
            <div className="w-full overflow-x-auto relative">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full min-w-[600px]">
                    {/* Grid Lines */}
                    {[0, 1, 2, 3].map(i => {
                        const y = padding + (i * (height - 2 * padding)) / 3;
                        return (
                            <line key={i} x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e5e7eb" strokeDasharray="4" />
                        );
                    })}

                    {/* Y-Axis Labels */}
                    {[0, 1, 2, 3].map(i => {
                        const price = Math.round(maxPrice - (i * (maxPrice - minPrice)) / 3);
                        const y = padding + (i * (height - 2 * padding)) / 3;
                        return (
                            <text key={i} x={padding - 10} y={y + 4} textAnchor="end" fontSize="10" fill="#6b7280">
                                {price}
                            </text>
                        );
                    })}

                    {/* X-Axis Labels */}
                    {priceHistory.map((d, i) => (
                        <text key={i} x={getX(i)} y={height - 20} textAnchor="middle" fontSize="10" fill="#6b7280">
                            {d.day}
                        </text>
                    ))}

                    {/* Line Path */}
                    <polyline points={points} fill="none" stroke="#4a7c59" strokeWidth="2" />

                    {/* Data Points */}
                    {priceHistory.map((d, i) => (
                        <circle
                            key={i}
                            cx={getX(i)}
                            cy={getY(d.price)}
                            r="4"
                            fill="#4a7c59"
                            className="hover:r-6 transition-all cursor-pointer"
                            onMouseEnter={() => setHoveredPoint({ day: d.day, price: d.price, x: getX(i), y: getY(d.price) })}
                            onMouseLeave={() => setHoveredPoint(null)}
                        />
                    ))}

                    {/* Tooltip */}
                    {hoveredPoint && (
                        <g>
                            <rect
                                x={hoveredPoint.x - 40}
                                y={hoveredPoint.y - 40}
                                width="80"
                                height="30"
                                fill="white"
                                stroke="#4a7c59"
                                strokeWidth="1"
                                rx="4"
                            />
                            <text
                                x={hoveredPoint.x}
                                y={hoveredPoint.y - 28}
                                textAnchor="middle"
                                fontSize="10"
                                fill="#6b7280"
                            >
                                {hoveredPoint.day}
                            </text>
                            <text
                                x={hoveredPoint.x}
                                y={hoveredPoint.y - 16}
                                textAnchor="middle"
                                fontSize="12"
                                fill="#4a7c59"
                                fontWeight="bold"
                            >
                                price: {hoveredPoint.price}
                            </text>
                        </g>
                    )}
                </svg>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto pb-12">
            {/* Header / Selectors */}
            <div className="flex items-center gap-2 mb-6">
                <h1 className="text-2xl font-bold text-nature-900 flex items-center gap-2">
                    Market Prices <BarChart2 className="h-6 w-6 text-blue-400" />
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Crop</label>
                    <div className="relative">
                        <button
                            onClick={() => document.getElementById('crop-dropdown').classList.toggle('hidden')}
                            className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent cursor-pointer text-left font-medium text-gray-900"
                        >
                            {selectedCrop}
                        </button>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />

                        {/* Dropdown Options */}
                        <div id="crop-dropdown" className="hidden absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                            {['Wheat', 'Rice', 'Cotton'].map((crop) => (
                                <button
                                    key={crop}
                                    onClick={() => {
                                        setSelectedCrop(crop);
                                        document.getElementById('crop-dropdown').classList.add('hidden');
                                    }}
                                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${selectedCrop === crop
                                        ? 'bg-amber-400 text-white font-bold hover:bg-amber-500'
                                        : 'text-gray-900'
                                        }`}
                                >
                                    {crop}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Radius</label>
                    <div className="relative">
                        <select
                            value={radius}
                            onChange={(e) => setRadius(e.target.value)}
                            className="w-full appearance-none bg-white border border-nature-600 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-nature-500 text-nature-900 font-medium cursor-pointer"
                        >
                            <option>Within 15 km</option>
                            <option>Within 30 km</option>
                            <option>Within 50 km</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-nature-600 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Current Price Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Current Market Price</p>
                        <h2 className="text-4xl font-bold text-gray-800">₹2,150</h2>
                        <p className="text-gray-500 text-sm">per Quintal</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 text-green-500 font-bold text-xl">
                            <ArrowUpRight className="h-5 w-5" />
                            5.2%
                        </div>
                        <p className="text-gray-400 text-xs">vs last week</p>
                    </div>
                </div>
            </div>

            {/* Best Price Highlight */}
            <div className="bg-nature-50 rounded-2xl p-6 mb-8 border border-nature-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-nature-200 flex items-center justify-center text-nature-700 shrink-0">
                        <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-nature-900">Best Price Available</h3>
                        <p className="text-nature-700 text-sm">Get the highest price for your {selectedCrop} at this market</p>
                        <div className="mt-2 text-3xl font-bold text-nature-600">₹2,300</div>
                        <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            Export Market • 25 km away
                        </p>
                    </div>
                </div>
                <button className="bg-nature-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-nature-800 transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm shadow-nature-200">
                    Get Directions
                    <ArrowRight className="h-5 w-5" />
                </button>
            </div>

            {/* Price Trends */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-nature-900">Price Trends</h3>
                </div>

                {/* Time Range Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-fit mb-6">
                    {['7 Days', '30 Days'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all ${timeRange === range
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>

                <div className="h-64 w-full">
                    <PriceChart />
                </div>
            </div>

            {/* Nearby Markets */}
            <div>
                <h3 className="text-xl font-bold text-nature-900 mb-4">Nearby Markets (15km)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {nearbyMarkets.map((market) => (
                        <div key={market.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg">{market.name}</h4>
                                    <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                                        <MapPin className="h-3 w-3" />
                                        {market.distance} away
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-gray-900">₹{market.price}</div>
                                    <div className="text-green-500 text-sm font-medium flex items-center justify-end gap-0.5">
                                        <ArrowUpRight className="h-3 w-3" />
                                        {market.trend}%
                                    </div>
                                </div>
                            </div>
                            <button className="w-full py-2 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                                View Market Details
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Chat Button (from screenshot) */}
            <button className="fixed bottom-6 right-6 h-14 w-14 bg-nature-700 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-nature-800 transition-transform hover:scale-105 z-50">
                <MessageCircle className="h-6 w-6" />
            </button>
        </div>
    );
};

export default MarketPricesPage;
