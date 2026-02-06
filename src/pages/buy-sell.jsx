import React, { useState } from 'react';
import { Search, MapPin, Phone, MessageCircle, Plus, TrendingUp, TrendingDown, X } from 'lucide-react';
import { cn } from '../lib/utils';

const BuySellPage = () => {
    const [activeTab, setActiveTab] = useState('available');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedState, setSelectedState] = useState('All States');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    // Add listing form state
    const [newListing, setNewListing] = useState({
        name: '',
        category: 'Vegetables',
        price: '',
        unit: 'kg',
        quantity: '',
        location: '',
        state: 'Punjab',
        phone: '',
        description: '',
        negotiable: true
    });

    const categories = [
        'All Categories',
        'Vegetables',
        'Fruits',
        'Grains',
        'Seeds',
        'Fertilizers',
        'Equipment',
        'Raw Materials',
        'Organic'
    ];

    const vegetables = [
        'Tomatoes', 'Potatoes', 'Onions', 'Cabbage', 'Cauliflower',
        'Carrots', 'Beans', 'Peas', 'Spinach', 'Brinjal', 'Okra', 'Cucumber'
    ];

    const fruits = [
        'Apples', 'Bananas', 'Mangoes', 'Oranges', 'Grapes',
        'Pomegranate', 'Watermelon', 'Papaya', 'Guava', 'Pineapple'
    ];

    const grains = [
        'Wheat', 'Rice', 'Maize', 'Barley', 'Bajra', 'Jowar'
    ];

    const states = [
        'All States',
        'Punjab',
        'Haryana',
        'Gujarat',
        'Maharashtra',
        'Uttar Pradesh',
        'Rajasthan',
        'Karnataka',
        'Tamil Nadu',
        'Andhra Pradesh'
    ];

    const units = ['kg', 'Quintal', 'Ton', 'Bag', 'Bale', 'Piece'];

    const [produceListings, setProduceListings] = useState([
        {
            id: 1,
            name: 'Organic Wheat',
            seller: 'Ramesh Verma',
            price: 2200,
            unit: 'Quintal',
            quantity: '50 Quintal available',
            location: 'Khanna, Ludhiana, Punjab',
            phone: '+91 98765 43210',
            description: 'Premium quality organic wheat, grown without chemical fertilizers. Ready for immediate delivery.',
            verified: true,
            negotiable: true,
            category: 'Grains',
            state: 'Punjab'
        },
        {
            id: 2,
            name: 'Basmati Rice',
            seller: 'Sunita Devi',
            price: 3400,
            unit: 'Quintal',
            quantity: '100 Quintal available',
            location: 'Karnal, Haryana',
            phone: '+91 98765 43211',
            description: 'Grade A Basmati rice, perfect for export quality. Bulk orders available.',
            verified: true,
            negotiable: false,
            category: 'Grains',
            state: 'Haryana'
        },
        {
            id: 3,
            name: 'Cotton Bales',
            seller: 'Vijay Singh',
            price: 7000,
            unit: 'Bale',
            quantity: '25 Bales available',
            location: 'Gondal, Rajkot, Gujarat',
            phone: '+91 99887 76655',
            description: 'High quality cotton bales, suitable for textile manufacturing.',
            verified: false,
            negotiable: true,
            category: 'Raw Materials',
            state: 'Gujarat'
        },
        {
            id: 4,
            name: 'Organic Tomatoes',
            seller: 'Priya Sharma',
            price: 30,
            unit: 'kg',
            quantity: '500 kg available',
            location: 'Nashik, Maharashtra',
            phone: '+91 98765 43213',
            description: 'Fresh organic tomatoes, harvested this morning. Perfect for wholesale markets.',
            verified: true,
            negotiable: true,
            category: 'Vegetables',
            state: 'Maharashtra'
        },
        {
            id: 5,
            name: 'Premium Wheat Seeds',
            seller: 'Harjeet Kaur',
            price: 4500,
            unit: 'Quintal',
            quantity: '30 Quintal available',
            location: 'Patiala, Punjab',
            phone: '+91 98765 43214',
            description: 'Certified wheat seeds with high germination rate. Suitable for winter sowing.',
            verified: true,
            negotiable: false,
            category: 'Seeds',
            state: 'Punjab'
        }
    ]);

    const marketPrices = [
        { crop: 'Wheat', price: 2150, change: 5.2, trend: 'up' },
        { crop: 'Rice', price: 3200, change: 2.1, trend: 'down' },
        { crop: 'Cotton', price: 6800, change: 6.5, trend: 'up' }
    ];

    // Get product suggestions based on category
    const getProductSuggestions = () => {
        if (newListing.category === 'Vegetables') return vegetables;
        if (newListing.category === 'Fruits') return fruits;
        if (newListing.category === 'Grains') return grains;
        return [];
    };

    // Handle add listing
    const handleAddListing = () => {
        if (!newListing.name || !newListing.price || !newListing.quantity || !newListing.location || !newListing.phone) {
            alert('Please fill all required fields');
            return;
        }

        const listing = {
            id: Date.now(),
            name: newListing.name,
            seller: 'You',
            price: parseFloat(newListing.price),
            unit: newListing.unit,
            quantity: `${newListing.quantity} ${newListing.unit} available`,
            location: newListing.location,
            phone: newListing.phone,
            description: newListing.description,
            verified: false,
            negotiable: newListing.negotiable,
            category: newListing.category,
            state: newListing.state
        };

        setProduceListings([listing, ...produceListings]);
        setShowAddModal(false);
        setNewListing({
            name: '',
            category: 'Vegetables',
            price: '',
            unit: 'kg',
            quantity: '',
            location: '',
            state: 'Punjab',
            phone: '',
            description: '',
            negotiable: true
        });
    };

    const filteredListings = produceListings.filter(item => {
        const categoryMatch = selectedCategory === 'All Categories' || item.category === selectedCategory;
        const stateMatch = selectedState === 'All States' || item.state === selectedState;
        const searchMatch = searchQuery === '' ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase());
        return categoryMatch && stateMatch && searchMatch;
    });

    return (
        <div className="max-w-7xl mx-auto py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-nature-900">Buy & Sell</h1>
                    <span className="text-2xl">💰</span>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-nature-700 text-white rounded-lg font-medium hover:bg-nature-800 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    List Your Produce
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by crop, location, or seller..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Category and State Filters */}
            <div className="mb-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {/* Category Pills */}
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                            selectedCategory === cat
                                ? "bg-nature-700 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* State Filter */}
            <div className="mb-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {states.map(state => (
                    <button
                        key={state}
                        onClick={() => setSelectedState(state)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                            selectedState === state
                                ? "bg-nature-700 text-white"
                                : "bg-white border border-gray-200 text-gray-700 hover:border-nature-300"
                        )}
                    >
                        {state}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Tabs */}
                    <div className="flex gap-4 mb-6 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('available')}
                            className={cn(
                                "px-6 py-3 font-medium text-sm transition-all relative",
                                activeTab === 'available'
                                    ? "text-gray-900 border-b-2 border-nature-700"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            Available Produce
                        </button>
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={cn(
                                "px-6 py-3 font-medium text-sm transition-all relative",
                                activeTab === 'requests'
                                    ? "text-gray-900 border-b-2 border-nature-700"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            Buy Requests
                        </button>
                    </div>

                    {/* Listings */}
                    {activeTab === 'available' && (
                        <div className="space-y-4">
                            {filteredListings.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                                    <p className="text-gray-500 font-medium">No listings found</p>
                                    <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                                </div>
                            ) : (
                                filteredListings.map(item => (
                                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                                                    {item.verified && (
                                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                                            ✓ Verified
                                                        </span>
                                                    )}
                                                    {item.negotiable && (
                                                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                                            Negotiable
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mb-1">Seller: {item.seller}</p>
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <MapPin className="h-4 w-4" />
                                                    {item.location}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-nature-700">₹{item.price.toLocaleString()}</div>
                                                <div className="text-sm text-gray-500">per {item.unit}</div>
                                            </div>
                                        </div>

                                        <p className="text-gray-700 text-sm mb-4 leading-relaxed">{item.description}</p>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm font-medium text-gray-600">{item.quantity}</span>
                                                <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">{item.category}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                                                    <Phone className="h-4 w-4" />
                                                    Call
                                                </button>
                                                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                                    <MessageCircle className="h-4 w-4" />
                                                    Message
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'requests' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <p className="text-gray-500 font-medium">No buy requests at the moment</p>
                            <p className="text-gray-400 text-sm">Check back later for new requests</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Market Prices */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Market Prices</h3>
                        <div className="space-y-4">
                            {marketPrices.map(item => (
                                <div key={item.crop} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                    <span className="font-medium text-gray-700">{item.crop}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                                        {item.trend === 'up' ? (
                                            <div className="flex items-center text-green-500 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
                                                <TrendingUp className="h-3 w-3 mr-1" />
                                                {item.change}%
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-red-500 text-xs font-medium bg-red-50 px-2 py-1 rounded-full">
                                                <TrendingDown className="h-3 w-3 mr-1" />
                                                {item.change}%
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-gradient-to-br from-nature-50 to-green-50 rounded-xl p-6 border border-nature-200">
                        <h3 className="text-lg font-bold text-nature-900 mb-3">💡 Selling Tips</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex gap-2">
                                <span className="text-nature-600">•</span>
                                <span>Provide clear photos of your produce</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-nature-600">•</span>
                                <span>Mention quality grade and certifications</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-nature-600">•</span>
                                <span>Update availability regularly</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-nature-600">•</span>
                                <span>Respond to inquiries promptly</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Add Listing Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">List Your Produce</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                <select
                                    value={newListing.category}
                                    onChange={(e) => setNewListing({ ...newListing, category: e.target.value, name: '' })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500"
                                >
                                    {categories.filter(c => c !== 'All Categories').map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Product Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                                {getProductSuggestions().length > 0 ? (
                                    <select
                                        value={newListing.name}
                                        onChange={(e) => setNewListing({ ...newListing, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500"
                                    >
                                        <option value="">Select {newListing.category}</option>
                                        {getProductSuggestions().map(product => (
                                            <option key={product} value={product}>{product}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={newListing.name}
                                        onChange={(e) => setNewListing({ ...newListing, name: e.target.value })}
                                        placeholder="Enter product name"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500"
                                    />
                                )}
                            </div>

                            {/* Price and Unit */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                                    <input
                                        type="number"
                                        value={newListing.price}
                                        onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                                        placeholder="2000"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit *</label>
                                    <select
                                        value={newListing.unit}
                                        onChange={(e) => setNewListing({ ...newListing, unit: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500"
                                    >
                                        {units.map(unit => (
                                            <option key={unit} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Available *</label>
                                <input
                                    type="number"
                                    value={newListing.quantity}
                                    onChange={(e) => setNewListing({ ...newListing, quantity: e.target.value })}
                                    placeholder="100"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500"
                                />
                            </div>

                            {/* Location and State */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                                    <input
                                        type="text"
                                        value={newListing.location}
                                        onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                                        placeholder="City, District"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                                    <select
                                        value={newListing.state}
                                        onChange={(e) => setNewListing({ ...newListing, state: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500"
                                    >
                                        {states.filter(s => s !== 'All States').map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone *</label>
                                <input
                                    type="tel"
                                    value={newListing.phone}
                                    onChange={(e) => setNewListing({ ...newListing, phone: e.target.value })}
                                    placeholder="+91 98765 43210"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={newListing.description}
                                    onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                                    placeholder="Describe your produce quality, certifications, delivery options..."
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 resize-none"
                                />
                            </div>

                            {/* Negotiable */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="negotiable"
                                    checked={newListing.negotiable}
                                    onChange={(e) => setNewListing({ ...newListing, negotiable: e.target.checked })}
                                    className="h-4 w-4 text-nature-700 border-gray-300 rounded focus:ring-nature-500"
                                />
                                <label htmlFor="negotiable" className="text-sm text-gray-700">Price is negotiable</label>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddListing}
                                    className="flex-1 px-6 py-3 bg-nature-700 text-white rounded-lg font-medium hover:bg-nature-800 transition-colors"
                                >
                                    Publish Listing
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuySellPage;
