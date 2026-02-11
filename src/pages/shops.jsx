import React, { useState, useEffect } from 'react';
import {
    Search, MapPin, Phone, Star, Store,
    Navigation, ExternalLink, ChevronRight,
    Sparkles, X, Filter, Map as MapIcon,
    Clock, Check
} from 'lucide-react';
import { cn } from '../lib/utils';
import SearchBarWithAutocomplete from '../components/search-bar-autocomplete';

const ShopsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('Distance'); // Distance, Rating, Name
    const [showOnlyOpen, setShowOnlyOpen] = useState(false);

    const categories = [
        'All',
        'Seeds & Fertilizers',
        'Equipment & Tools',
        'Organic Inputs',
        'Irrigation',
        'Animal Feed',
        'Pesticides',
        'General Store'
    ];

    const [shopsData, setShopsData] = useState([
        {
            id: 1,
            name: 'Krishi Kendra Seeds & Fertilizers',
            category: 'Seeds & Fertilizers',
            rating: 4.8,
            reviews: 124,
            location: 'Main Market, Ludhiana',
            distanceNum: 5.2,
            distance: '5.2 km away',
            phone: '+91 98765 43210',
            products: ['Wheat Seeds', 'NPK Fertilizer', 'Urea', 'Hybrid Corn Seeds'],
            isOpen: true,
            hours: '8:00 AM - 8:00 PM',
            lat: 30.901,
            lng: 75.857
        },
        {
            id: 2,
            name: 'AgriTech Equipment Store',
            category: 'Equipment & Tools',
            rating: 4.6,
            reviews: 89,
            location: 'Industrial Area, Jalandhar',
            distanceNum: 28.5,
            distance: '28.5 km away',
            phone: '+91 98765 43211',
            products: ['Tractors', 'Sprayers', 'Ploughs', 'Sickles'],
            isOpen: true,
            hours: '9:00 AM - 7:00 PM',
            lat: 31.326,
            lng: 75.576
        },
        {
            id: 3,
            name: 'Organic Farm Supplies',
            category: 'Organic Inputs',
            rating: 4.9,
            reviews: 56,
            location: 'Green Valley, Khanna',
            distanceNum: 2.1,
            distance: '2.1 km away',
            phone: '+91 98765 43212',
            products: ['Organic Fertilizer', 'Bio-Pesticides', 'Compost', 'Neem Oil'],
            isOpen: true,
            hours: '7:30 AM - 6:30 PM',
            lat: 30.707,
            lng: 76.216
        },
        {
            id: 4,
            name: 'Modern Irrigation Systems',
            category: 'Irrigation',
            rating: 4.7,
            reviews: 42,
            location: 'Tech Park, Chandigarh',
            distanceNum: 45.0,
            distance: '45.0 km away',
            phone: '+91 98765 43213',
            products: ['Drip Systems', 'Sprinklers', 'Solar Pumps', 'Pipes'],
            isOpen: false,
            hours: '10:00 AM - 6:00 PM',
            lat: 30.733,
            lng: 76.779
        },
        {
            id: 5,
            name: 'Premium Animal Feed Center',
            category: 'Animal Feed',
            rating: 4.5,
            reviews: 210,
            location: 'Livestock Market, Patiala',
            distanceNum: 1.5,
            distance: '1.5 km away',
            phone: '+91 98765 43214',
            products: ['Cattle Feed', 'Poultry Feed', 'Mineral Blocks', 'Hay'],
            isOpen: true,
            hours: '6:00 AM - 9:00 PM',
            lat: 30.339,
            lng: 76.386
        },
        {
            id: 6,
            name: 'Punjab Agri General Store',
            category: 'General Store',
            rating: 4.3,
            reviews: 167,
            location: 'Village Square, Sangrur',
            distanceNum: 8.4,
            distance: '8.4 km away',
            phone: '+91 98765 43216',
            products: ['Farm Tools', 'Boots', 'Gloves', 'Storage Bags'],
            isOpen: true,
            hours: '8:00 AM - 9:30 PM',
            lat: 30.245,
            lng: 75.830
        },
        {
            id: 7,
            name: 'Kisan Crop Protection',
            category: 'Pesticides',
            rating: 4.4,
            reviews: 73,
            location: 'Grain Market, Moga',
            distanceNum: 12.7,
            distance: '12.7 km away',
            phone: '+91 98765 43217',
            products: ['Insecticides', 'Fungicides', 'Herbicides', 'Rat Poison'],
            isOpen: true,
            hours: '8:30 AM - 7:30 PM',
            lat: 30.817,
            lng: 75.174
        },
        {
            id: 8,
            name: 'Guru Nanak Seed Store',
            category: 'Seeds & Fertilizers',
            rating: 4.7,
            reviews: 312,
            location: 'Station Road, Bathinda',
            distanceNum: 3.8,
            distance: '3.8 km away',
            phone: '+91 98765 43218',
            products: ['Basmati Rice Seeds', 'DAP', 'MOP', 'Vegetable Seeds'],
            isOpen: true,
            hours: '8:00 AM - 8:30 PM',
            lat: 30.211,
            lng: 74.945
        }
    ]);

    // Sorting and Filtering Logic
    const filteredAndSortedShops = shopsData
        .filter(shop => {
            const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                shop.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                shop.products.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = selectedCategory === 'All' || shop.category === selectedCategory;
            const matchesOpen = !showOnlyOpen || shop.isOpen;
            return matchesSearch && matchesCategory && matchesOpen;
        })
        .sort((a, b) => {
            if (sortBy === 'Distance') return a.distanceNum - b.distanceNum;
            if (sortBy === 'Rating') return b.rating - a.rating;
            if (sortBy === 'Name') return a.name.localeCompare(b.name);
            return 0;
        });

    // Smart Suggestions for Autocomplete
    const getSuggestions = () => {
        if (searchQuery.length < 2) return [];
        const suggestions = new Set();

        shopsData.forEach(shop => {
            if (shop.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                suggestions.add(shop.name);
            }
            shop.products.forEach(product => {
                if (product.toLowerCase().includes(searchQuery.toLowerCase())) {
                    suggestions.add(product);
                }
            });
        });

        return Array.from(suggestions).slice(0, 5);
    };

    const suggestions = getSuggestions();

    const handleCall = (phone) => {
        window.location.href = `tel:${phone}`;
    };

    const handleDirections = (lat, lng, name) => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${name}`, '_blank');
    };

    return (
        <div className="max-w-7xl mx-auto py-6 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-nature-100 rounded-2xl">
                        <Store className="h-8 w-8 text-nature-700" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-nature-900">Agriculture Shops</h1>
                        <p className="text-gray-600">Find nearest seeds, fertilizers, and equipment stores</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowOnlyOpen(!showOnlyOpen)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all shadow-sm",
                            showOnlyOpen
                                ? "bg-green-600 text-white border-green-600"
                                : "bg-white text-gray-700 border-gray-200 hover:border-nature-300"
                        )}
                    >
                        {showOnlyOpen ? <Check className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                        Open Now
                    </button>
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="text-sm font-bold text-gray-700 focus:outline-none bg-transparent"
                        >
                            <option value="Distance">Nearby First</option>
                            <option value="Rating">Best Rated</option>
                            <option value="Name">Alphabetical</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Smart Search Bar */}
            <div className="max-w-3xl">
                <SearchBarWithAutocomplete
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by shop name or products (e.g. Urea, Seeds, Tractor)..."
                    suggestions={suggestions}
                    className="shadow-md"
                />
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Shop Categories</h3>
                <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                                "px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border",
                                selectedCategory === category
                                    ? "bg-nature-700 border-nature-700 text-white shadow-lg scale-105"
                                    : "bg-white border-gray-200 text-gray-600 hover:border-nature-300 hover:bg-nature-50"
                            )}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Shops Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredAndSortedShops.length > 0 ? (
                    filteredAndSortedShops.map((shop, index) => (
                        <div
                            key={shop.id}
                            className={cn(
                                "group bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden",
                                index === 0 && sortBy === 'Distance' && searchQuery === '' && "border-nature-300 ring-1 ring-nature-100"
                            )}
                        >
                            {/* Nearby Badge */}
                            {index === 0 && sortBy === 'Distance' && (
                                <div className="absolute top-0 right-0 bg-nature-600 text-white px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                                    <Sparkles className="h-3 w-3" />
                                    Nearest
                                </div>
                            )}

                            {/* Shop Image/Icon Area */}
                            <div className="flex-shrink-0">
                                <div className="w-24 h-24 bg-gradient-to-br from-nature-50 to-green-100 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                    <Store className="h-12 w-12 text-nature-700" />
                                </div>
                                <div className="mt-3 text-center">
                                    <div className={cn(
                                        "inline-flex items-center justify-center px-2 py-1 rounded-full text-[10px] font-black uppercase",
                                        shop.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    )}>
                                        {shop.isOpen ? 'Open' : 'Closed'}
                                    </div>
                                </div>
                            </div>

                            {/* Info Area */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-nature-700 transition-colors">{shop.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold">
                                                {shop.category}
                                            </span>
                                            <div className="flex items-center gap-1 text-amber-500">
                                                <Star className="h-4 w-4 fill-current" />
                                                <span className="text-sm font-bold text-gray-900">{shop.rating}</span>
                                                <span className="text-xs text-gray-400">({shop.reviews})</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-start gap-2 text-sm text-gray-600">
                                        <MapPin className="h-4 w-4 text-nature-600 mt-0.5" />
                                        <span>
                                            <span className="font-bold text-nature-700">{shop.distance}</span> • {shop.location}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        <span>{shop.hours}</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex flex-wrap gap-2">
                                        {shop.products.slice(0, 4).map((product, pIndex) => (
                                            <span key={pIndex} className="px-2 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-medium border border-gray-100">
                                                {product}
                                            </span>
                                        ))}
                                        {shop.products.length > 4 && (
                                            <span className="px-2 py-1 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-medium border border-gray-100 italic">
                                                +{shop.products.length - 4} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleCall(shop.phone)}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-nature-700 text-white rounded-2xl font-bold hover:bg-nature-800 transition-all shadow-lg active:scale-95"
                                    >
                                        <Phone className="h-4 w-4" />
                                        Call Store
                                    </button>
                                    <button
                                        onClick={() => handleDirections(shop.lat, shop.lng, shop.name)}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border-2 border-nature-700 text-nature-700 rounded-2xl font-bold hover:bg-nature-50 transition-all active:scale-95"
                                    >
                                        <Navigation className="h-4 w-4" />
                                        Directions
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Store className="h-12 w-12 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No shops matching your filters</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">Try searching for something else or change your category filters to find stores near you.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                            className="mt-6 px-8 py-3 bg-nature-700 text-white rounded-2xl font-bold shadow-md hover:bg-nature-800 transition-all"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Map Placeholder for future expansion */}
            <div className="bg-gradient-to-br from-nature-600 to-green-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute right-0 top-0 opacity-10 scale-150 transition-transform hover:scale-125 duration-1000">
                    <MapIcon className="w-64 h-64" />
                </div>
                <div className="relative z-10 max-w-lg">
                    <h2 className="text-3xl font-bold mb-4">View All Shops on Map</h2>
                    <p className="text-green-100 text-lg mb-6">
                        Get a birds-eye view of all agricultural suppliers in your region. Compare locations and find the most convenient path.
                    </p>
                    <button className="px-8 py-4 bg-white text-nature-700 rounded-2xl font-bold hover:bg-green-50 transition-all shadow-xl flex items-center gap-2 active:scale-95">
                        <MapIcon className="h-5 w-5" />
                        Open Interactive Map
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShopsPage;
