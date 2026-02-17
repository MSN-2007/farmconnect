import React, { useState, useEffect } from 'react';
import {
    Search, Plus, MapPin, Phone, MessageCircle, Star,
    Sparkles, X, Upload, Image as ImageIcon, Filter,
    Tractor, Wrench, Settings, Navigation, ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import SearchBarWithAutocomplete from '../components/search-bar-autocomplete.jsx';

const RentalsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    // Detailed Categories
    const categories = [
        { id: 'All', name: 'All', icon: Settings },
        { id: 'Tractor-Small', name: 'Small Tractor (<30 HP)', icon: Tractor },
        { id: 'Tractor-Medium', name: 'Medium Tractor (30-60 HP)', icon: Tractor },
        { id: 'Tractor-Large', name: 'Large Tractor (>60 HP)', icon: Tractor },
        { id: 'Tiller', name: 'Tillers & Cultivators', icon: Wrench },
        { id: 'Seeder', name: 'Seeders & Rowers', icon: SproutIcon },
        { id: 'Harvester', name: 'Harvesters', icon: Sparkles },
        { id: 'Small-Equipment', name: 'Small Equipment (Sprayers, etc.)', icon: Wrench },
    ];

    // Placeholder for Sprout as it wasn't in the import list above (using custom svg for variety)
    function SproutIcon({ className }) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 20h10" /><path d="M10 20c5.5-3 5.5-13 0-16" /><path d="M14 20c-5.5-3-5.5-13 0-16" /><path d="M12 20v-4" />
            </svg>
        );
    }

    const [rentalListings, setRentalListings] = useState([
        {
            id: 1,
            name: 'John Deere 5050D',
            owner: 'Rajesh Kumar',
            category: 'Tractor-Medium',
            status: 'Available',
            rating: 4.8,
            brand: 'John Deere',
            model: '5050D',
            capacity: '50 HP',
            fuel: 'Diesel',
            hourlyRate: 500,
            dailyRate: 3500,
            location: 'Ludhiana, Punjab',
            distance: '5.2 km',
            phone: '+91 98765 43210',
            image: null,
            imagePlaceholder: true,
            description: 'Powerful 50 HP tractor, perfect for heavy ploughing and haulage.'
        },
        {
            id: 2,
            name: 'VST Shakti 130 DI Tiller',
            owner: 'Amit Singh',
            category: 'Tiller',
            status: 'Available',
            rating: 4.5,
            brand: 'VST Shakti',
            model: '130 DI',
            capacity: '13 HP',
            fuel: 'Diesel',
            hourlyRate: 200,
            dailyRate: 1200,
            location: 'Ambala, Haryana',
            distance: '8.5 km',
            phone: '+91 97654 32108',
            image: null,
            imagePlaceholder: true,
            description: 'Compact power tiller perfect for small to medium-sized fields. Easy to operate.'
        },
        {
            id: 3,
            name: 'Mahindra 9-Row Seed Drill',
            owner: 'Priya Devi',
            category: 'Seeder',
            status: 'Booked',
            rating: 4.9,
            brand: 'Mahindra',
            model: 'SD-09',
            capacity: '9 rows',
            fuel: 'Manual attachment',
            hourlyRate: 150,
            dailyRate: 900,
            location: 'Khanna, Punjab',
            distance: '3.1 km',
            phone: '+91 98887 65432',
            image: null,
            imagePlaceholder: true,
            description: 'Precision seed drill for uniform planting. Attachable to any standard tractor.'
        },
        {
            id: 4,
            name: 'Sonalika GT 20',
            owner: 'Gurjot Singh',
            category: 'Tractor-Small',
            status: 'Available',
            rating: 4.6,
            brand: 'Sonalika',
            model: 'GT 20',
            capacity: '20 HP',
            fuel: 'Diesel',
            hourlyRate: 300,
            dailyRate: 2200,
            location: 'Patiala, Punjab',
            distance: '12.4 km',
            phone: '+91 91234 56789',
            image: null,
            imagePlaceholder: true,
            description: 'Mini tractor ideal for orchards and small farm operations.'
        },
        {
            id: 5,
            name: 'New Holland 7500',
            owner: 'Vikram Patel',
            category: 'Tractor-Large',
            status: 'Available',
            rating: 4.7,
            brand: 'New Holland',
            model: '7500',
            capacity: '75 HP',
            fuel: 'Diesel',
            hourlyRate: 800,
            dailyRate: 5500,
            location: 'Gondal, Gujarat',
            distance: '15.8 km',
            phone: '+91 96543 21098',
            image: null,
            imagePlaceholder: true,
            description: 'Heavy duty 75 HP tractor with 4WD, suitable for large scale harvesting and land preparation.'
        },
        {
            id: 6,
            name: 'Stihl Battery Sprayer',
            owner: 'Mohan Lal',
            category: 'Small-Equipment',
            status: 'Available',
            rating: 4.4,
            brand: 'Stihl',
            model: 'SGA 85',
            capacity: '17 Liters',
            fuel: 'Battery',
            hourlyRate: 50,
            dailyRate: 350,
            location: 'Jalandhar, Punjab',
            distance: '6.7 km',
            phone: '+91 98760 12345',
            image: null,
            imagePlaceholder: true,
            description: 'Professional battery-powered backpack sprayer for efficient pesticide application.'
        }
    ]);

    // Smart Autocomplete Suggestions
    const equipmentNames = [
        'John Deere Tractor', 'Mahindra Tractor', 'Sonalika Tractor',
        'Power Tiller', 'Rotavator', 'Seed Drill', 'Combine Harvester',
        'Pesticide Sprayer', 'Water Pump', 'Plough', 'Cultivator',
        'Rice Transplanter', 'Brush Cutter', 'Sugarcane Harvester'
    ];

    const getSmartSuggestions = (query) => {
        if (query.length < 2) return [];
        const lowerQuery = query.toLowerCase();

        // Use fuzzy matching logic similar to Buy Sell
        const matches = equipmentNames.filter(name => {
            const lowerName = name.toLowerCase();
            if (lowerName.includes(lowerQuery)) return true;

            // Simple fuzzy check
            let queryIdx = 0;
            for (let char of lowerName) {
                if (char === lowerQuery[queryIdx]) queryIdx++;
                if (queryIdx === lowerQuery.length) return true;
            }
            return false;
        });

        return matches.slice(0, 5);
    };

    const searchSuggestions = getSmartSuggestions(searchQuery);

    const filteredListings = rentalListings.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const handleCall = (phone) => {
        window.location.href = `tel:${phone}`;
    };

    const handleMessage = (phone) => {
        const message = encodeURIComponent('Hi, I am interested in renting your equipment on FarmConnect.');
        window.location.href = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`;
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-6 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-nature-900 mb-2">Equipment Rentals</h1>
                    <p className="text-gray-600">Rent high-quality farming machinery at affordable rates</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-nature-700 text-white rounded-xl font-bold hover:bg-nature-800 transition-all shadow-lg active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                    List Equipment
                </button>
            </div>

            {/* Smart Search Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 max-w-2xl">
                <SearchBarWithAutocomplete
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search tractors, tillers, harvesters..."
                    suggestions={searchSuggestions}
                    className="border-none ring-0 focus-within:ring-0"
                />
            </div>

            {/* Detailed Categories */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-900 font-bold">
                    <Filter className="h-5 w-5" />
                    <h2>Quick Categories</h2>
                </div>
                <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={cn(
                                "flex items-center gap-2 px-5 py-3 rounded-full font-medium whitespace-nowrap transition-all border",
                                activeCategory === cat.id
                                    ? "bg-nature-700 text-white border-nature-700 shadow-md"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-nature-300 hover:bg-nature-50"
                            )}
                        >
                            <cat.icon className="h-4 w-4" />
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Equipment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.length > 0 ? (
                    filteredListings.map(item => (
                        <div key={item.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                            {/* Image Placeholder */}
                            <div className="relative h-56 bg-gray-100">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-200">
                                        <Tractor className="h-16 w-16 mb-2 opacity-20" />
                                        <span className="text-xs font-medium uppercase tracking-wider">No Image Available</span>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-xs font-bold shadow-sm",
                                        item.status === 'Available' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    )}>
                                        {item.status}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                    <Star className="h-3 w-3 fill-amber-400 stroke-amber-400" />
                                    <span className="text-xs font-bold text-gray-900">{item.rating}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-nature-700 transition-colors">
                                            {item.name}
                                        </h3>
                                        <div className="text-right">
                                            <div className="text-nature-700 font-bold text-lg">₹{item.dailyRate}</div>
                                            <div className="text-[10px] text-gray-500 uppercase font-bold">per day</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                        <MapPin className="h-4 w-4" />
                                        {item.location} • {item.distance}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">{item.capacity}</span>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">{item.fuel}</span>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                                    {item.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">Owner</span>
                                        <span className="text-sm font-bold text-gray-900">{item.owner}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleCall(item.phone)}
                                            className="p-2.5 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors"
                                            title="Call Owner"
                                        >
                                            <Phone className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleMessage(item.phone)}
                                            className="p-2.5 bg-nature-50 text-nature-700 rounded-xl hover:bg-nature-100 transition-colors"
                                            title="Message Owner"
                                        >
                                            <MessageCircle className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">No equipment found</h3>
                        <p className="text-gray-500">Try adjusting your search or category filter</p>
                    </div>
                )}
            </div>

            {/* Add Equipment Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">List Your Equipment</h2>
                                <p className="text-sm text-gray-500">Reach thousands of farmers in your area</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="h-6 w-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto">
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                {/* Equipment Name */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Equipment Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. John Deere 5050D Tractor"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-500 transition-all font-medium"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Category</label>
                                        <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-500 transition-all font-medium">
                                            {categories.filter(c => c.id !== 'All').map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Daily Rate */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Daily Rental Rate (₹)</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 3500"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Location & Distance */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Location (City, State)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Ludhiana, Punjab"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-500 transition-all font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            placeholder="+91 XXXXX XXXXX"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Equipment Photo</label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex-1 cursor-pointer group">
                                            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 group-hover:bg-nature-50 group-hover:border-nature-200 transition-all">
                                                <div className="bg-nature-100 p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                                                    <Upload className="h-6 w-6 text-nature-700" />
                                                </div>
                                                <span className="text-sm font-bold text-gray-900 mb-1">Upload Photo</span>
                                                <span className="text-xs text-gray-500">JPG or PNG, up to 10MB</span>
                                                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                            </div>
                                        </label>
                                        {imagePreview && (
                                            <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg overflow-hidden relative group">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => setImagePreview(null)}
                                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-6 w-6 text-white" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Description</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Tell other farmers about your equipment's condition, age, and available attachments..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-500 transition-all font-medium resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    className="w-full py-4 bg-nature-700 text-white rounded-2xl font-bold text-lg hover:bg-nature-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    <Sparkles className="h-5 w-5" />
                                    Publish Listing
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RentalsPage;
