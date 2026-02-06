import React, { useState } from 'react';
import { Search, Plus, MapPin, Phone, Star, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

const RentalsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const equipment = [
        {
            id: 1,
            name: 'John Deere Tractor',
            owner: 'Rajesh Kumar',
            type: 'Tractor',
            status: 'Available',
            rating: 4.8,
            brand: '',
            model: '',
            capacity: '',
            fuel: '',
            hourlyRate: 500,
            dailyRate: 3500,
            location: 'Punjab',
            distance: '5 km away',
            phone: '',
            imagePlaceholder: true
        },
        {
            id: 2,
            name: 'Power Tiller VST Shakti',
            owner: 'Amit Singh',
            type: 'Tiller',
            status: 'Available',
            rating: 4.5,
            brand: 'VST Shakti',
            model: '130 DI',
            capacity: '13 HP',
            fuel: 'Diesel',
            description: 'Compact power tiller perfect for small to medium-sized fields. Easy to operate.',
            hourlyRate: 200,
            dailyRate: 1200,
            location: 'Haryana',
            distance: '8 km away',
            phone: '+91 97654 32108',
            imagePlaceholder: true
        },
        {
            id: 3,
            name: '9-Row Seed Drill',
            owner: 'Priya Devi',
            type: 'Planting',
            status: 'Booked',
            rating: 4.9,
            brand: 'Mahindra',
            model: 'SD-09',
            capacity: '9 rows',
            fuel: 'Manual (Tractor attachment)',
            description: 'Precision seed drill for uniform planting. Attachable to any standard tractor.',
            hourlyRate: 150,
            dailyRate: 900,
            location: 'Punjab',
            distance: '3 km away',
            phone: '+91 98887 65432',
            imagePlaceholder: true
        },
        {
            id: 4,
            name: 'Combine Harvester',
            owner: 'Vikram Patel',
            type: 'Harvester',
            status: 'Available',
            rating: 4.7,
            brand: 'New Holland',
            model: 'TC 5070',
            capacity: '70 HP',
            fuel: 'Diesel',
            description: 'High-efficiency combine harvester suitable for wheat, rice, and other grains.',
            hourlyRate: 800,
            dailyRate: 5500,
            location: 'Gujarat',
            distance: '12 km away',
            phone: '+91 96543 21098',
            imagePlaceholder: true
        }
    ];

    const aiSuggestions = [
        {
            name: 'John Deere Tractor',
            distance: '5 km away',
            rate: 3500
        },
        {
            name: 'Power Tiller VST Shakti',
            distance: '8 km away',
            rate: 1200
        },
        {
            name: 'Combine Harvester',
            distance: '12 km away',
            rate: 5500
        }
    ];

    const mostRentedStats = [
        { type: 'Tractors', bookings: 152 },
        { type: 'Harvesters', bookings: 98 },
        { type: 'Tillers', bookings: 76 }
    ];

    const filteredEquipment = equipment.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-nature-900">Equipment Rentals</h1>
                    <span className="text-2xl">🚜</span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-nature-700 text-white rounded-lg font-medium hover:bg-nature-800 transition-colors">
                    <Plus className="h-4 w-4" />
                    List Equipment
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search equipment by name, type, or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* AI Equipment Suggestions */}
            <div className="bg-amber-50 rounded-xl shadow-sm border-2 border-amber-200 p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-amber-600" />
                    <h2 className="text-lg font-bold text-gray-900">AI Equipment Suggestions</h2>
                </div>
                <div className="space-y-3">
                    {aiSuggestions.map((suggestion, index) => (
                        <div key={index} className="text-sm text-gray-700">
                            <span className="font-semibold text-gray-900">{suggestion.name}</span> is available just {suggestion.distance} • ₹{suggestion.rate}/day
                        </div>
                    ))}
                </div>
            </div>

            {/* Equipment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {filteredEquipment.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row">
                            {/* Image Placeholder */}
                            <div className="w-full md:w-48 h-48 bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <div className="text-gray-300 text-4xl">📷</div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1">
                                {/* Title & Owner */}
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                                <p className="text-sm text-gray-600 mb-3">Owner: {item.owner}</p>

                                {/* Status Badges */}
                                <div className="flex gap-2 mb-3">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-xs font-bold",
                                        item.type === 'Tractor' ? "bg-amber-100 text-amber-700" :
                                            item.type === 'Tiller' ? "bg-amber-100 text-amber-700" :
                                                item.type === 'Planting' ? "bg-amber-100 text-amber-700" :
                                                    "bg-amber-100 text-amber-700"
                                    )}>
                                        {item.type}
                                    </span>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-xs font-bold",
                                        item.status === 'Available'
                                            ? "bg-green-700 text-white"
                                            : "bg-red-600 text-white"
                                    )}>
                                        {item.status}
                                    </span>
                                    <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                        <span className="text-xs font-bold text-gray-700">{item.rating}</span>
                                    </div>
                                </div>

                                {/* Specifications */}
                                {item.brand && (
                                    <div className="space-y-1 text-sm text-gray-700 mb-3">
                                        {item.brand && <p><span className="font-semibold">Brand:</span> {item.brand}</p>}
                                        {item.model && <p><span className="font-semibold">Model:</span> {item.model}</p>}
                                        {item.capacity && <p><span className="font-semibold">Capacity:</span> {item.capacity}</p>}
                                        {item.fuel && <p><span className="font-semibold">Fuel:</span> {item.fuel}</p>}
                                    </div>
                                )}

                                {/* Description */}
                                {item.description && (
                                    <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                                )}

                                {/* Rates */}
                                <div className="flex gap-6 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Hourly Rate</p>
                                        <p className="text-lg font-bold text-green-700">₹{item.hourlyRate}/hr</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Daily Rate</p>
                                        <p className="text-lg font-bold text-green-700">₹{item.dailyRate}/day</p>
                                    </div>
                                </div>

                                {/* Location & Phone */}
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <span>{item.location} • {item.distance}</span>
                                    </div>
                                    {item.phone && (
                                        <div className="flex items-center gap-1">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <span>{item.phone}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Action Button */}
                                <button
                                    disabled={item.status === 'Booked'}
                                    className={cn(
                                        "w-full py-2.5 rounded-lg font-bold transition-colors",
                                        item.status === 'Available'
                                            ? "bg-nature-700 text-white hover:bg-nature-800"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    )}
                                >
                                    {item.status === 'Available' ? 'Book Now' : 'Not Available'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Most Rented Equipment */}
            <div className="bg-amber-50 rounded-xl shadow-sm border border-amber-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="text-amber-600">⏱️</div>
                    <h2 className="text-xl font-bold text-gray-900">Most Rented Equipment</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {mostRentedStats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-amber-200">
                            <p className="text-sm text-gray-600 mb-1">{index + 1}. {stat.type}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.bookings} bookings this month</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Empty State */}
            {filteredEquipment.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No equipment found</h3>
                    <p className="text-gray-500">Try adjusting your search query</p>
                </div>
            )}
        </div>
    );
};

export default RentalsPage;
