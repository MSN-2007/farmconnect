import React, { useState } from 'react';
import { Search, MapPin, Phone, Star, Store } from 'lucide-react';
import { cn } from '../lib/utils';

const ShopsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = [
        'All',
        'Seeds & Fertilizers',
        'Equipment & Tools',
        'Organic Inputs',
        'Irrigation',
        'Animal Feed',
        'Pesticides'
    ];

    const shops = [
        {
            id: 1,
            name: 'Krishi Kendra Seeds & Fertilizers',
            category: 'Seeds & Fertilizers',
            rating: 4.8,
            location: 'Main Market, Punjab',
            distance: '25 km away',
            phone: '+91 98765 43210',
            products: ['Wheat Seeds', 'NPK Fertilizer', 'Pesticides'],
            icon: '🏪'
        },
        {
            id: 2,
            name: 'AgriTech Equipment Store',
            category: 'Equipment & Tools',
            rating: 4.6,
            location: 'Industrial Area, Haryana',
            distance: '52 km away',
            phone: '+91 98765 43211',
            products: ['Tractors', 'Sprayers', 'Tools'],
            icon: '🏪'
        },
        {
            id: 3,
            name: 'Organic Farm Supplies',
            category: 'Organic Inputs',
            rating: 4.9,
            location: 'Green Valley, Punjab',
            distance: '18 km away',
            phone: '+91 98765 43212',
            products: ['Organic Fertilizer', 'Bio-Pesticides', 'Compost'],
            icon: '🏪'
        },
        {
            id: 4,
            name: 'Modern Irrigation Systems',
            category: 'Irrigation',
            rating: 4.7,
            location: 'Tech Park, Haryana',
            distance: '35 km away',
            phone: '+91 98765 43213',
            products: ['Drip Systems', 'Sprinklers', 'Pumps'],
            icon: '🏪'
        },
        {
            id: 5,
            name: 'Premium Animal Feed Center',
            category: 'Animal Feed',
            rating: 4.5,
            location: 'Livestock Market, Punjab',
            distance: '12 km away',
            phone: '+91 98765 43214',
            products: ['Cattle Feed', 'Poultry Feed', 'Supplements'],
            icon: '🏪'
        },
        {
            id: 6,
            name: 'Crop Protection Solutions',
            category: 'Pesticides',
            rating: 4.4,
            location: 'Agricultural Zone, Haryana',
            distance: '28 km away',
            phone: '+91 98765 43215',
            products: ['Insecticides', 'Fungicides', 'Herbicides'],
            icon: '🏪'
        }
    ];

    const filteredShops = shops.filter(shop => {
        const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shop.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shop.products.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'All' || shop.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-7xl mx-auto py-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <h1 className="text-3xl font-bold text-nature-900">Nearby Shops</h1>
                <span className="text-2xl">🏪</span>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search shops by name, product, or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Browse by Category */}
            <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Browse by Category</h2>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border",
                                selectedCategory === category
                                    ? "bg-amber-100 border-amber-300 text-amber-900"
                                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Shops Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredShops.map((shop) => (
                    <div key={shop.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex gap-4">
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center">
                                    <Store className="h-7 w-7 text-green-600" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                {/* Title & Rating */}
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-lg font-bold text-gray-900">{shop.name}</h3>
                                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md">
                                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                        <span className="text-sm font-bold text-amber-700">{shop.rating}</span>
                                    </div>
                                </div>

                                {/* Category Badge */}
                                <div className="mb-3">
                                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                        {shop.category}
                                    </span>
                                </div>

                                {/* Location */}
                                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span>{shop.location} • {shop.distance}</span>
                                </div>

                                {/* Phone */}
                                <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span>{shop.phone}</span>
                                </div>

                                {/* Available Products */}
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 mb-2">Available Products:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {shop.products.map((product, index) => (
                                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                                {product}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-nature-700 text-white rounded-lg font-bold hover:bg-nature-800 transition-colors">
                                        <Phone className="h-4 w-4" />
                                        Call Now
                                    </button>
                                    <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                        Get Directions
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredShops.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No shops found</h3>
                    <p className="text-gray-500">Try adjusting your search or category filter</p>
                </div>
            )}
        </div>
    );
};

export default ShopsPage;
