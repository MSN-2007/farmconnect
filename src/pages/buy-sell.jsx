import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, MessageCircle, Plus, TrendingUp, TrendingDown, X, Upload, Image as ImageIcon, Sparkles, Heart, SlidersHorizontal, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/auth-context';
import { calculateDistance, formatDistance, getUserLocation } from '../lib/distance';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const BuySellPage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('available');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedState, setSelectedState] = useState('All States');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    // Enhanced filters
    const [priceRange, setPriceRange] = useState([0, 50000]);
    const [sortBy, setSortBy] = useState('recent');
    const [showFilters, setShowFilters] = useState(false);

    // Wishlist
    const [wishlistItems, setWishlistItems] = useState(new Set());

    // User location for distance calculation
    const [userLocation, setUserLocation] = useState(null);

    // Seller ratings cache
    const [sellerRatings, setSellerRatings] = useState({});

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
        negotiable: true,
        image: null // Store File object here or separately
    });
    const [imageFile, setImageFile] = useState(null); // Separate state for File object
    const [additionalImages, setAdditionalImages] = useState([]); // Store multiple images
    const [produceListings, setProduceListings] = useState([]); // Marketplace listings

    // ... (categories arrays remain same) ...

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // Store file for upload
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Preview only
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle multiple images
    const handleAdditionalImages = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + additionalImages.length > 4) {
            alert('Maximum 5 images allowed (1 main + 4 additional)');
            return;
        }
        setAdditionalImages(prev => [...prev, ...files]);
    };

    const removeAdditionalImage = (index) => {
        setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    };

    // Fetch user location on mount
    useEffect(() => {
        getUserLocation()
            .then(loc => setUserLocation(loc))
            .catch(() => { }); // Silent fail if location not available
    }, []);

    // Handle add listing
    const handleAddListing = async () => {
        if (!newListing.name || !newListing.price || !newListing.quantity || !newListing.location || !newListing.phone) {
            alert('Please fill all required fields');
            return;
        }

        const formData = new FormData();
        formData.append('name', newListing.name);
        formData.append('category', newListing.category);
        formData.append('price', newListing.price);
        formData.append('unit', newListing.unit);
        formData.append('quantity', `${newListing.quantity} ${newListing.unit} available`);
        formData.append('location', newListing.location);
        formData.append('state', newListing.state);
        formData.append('phone', newListing.phone);
        formData.append('description', newListing.description);
        formData.append('negotiable', newListing.negotiable);


        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const res = await fetch(`${API_URL}/api/listings`, {
                method: 'POST',
                credentials: 'include',  // Send httpOnly cookie
                body: formData
            });

            if (res.ok) {
                const newItem = await res.json();
                setProduceListings([newItem, ...produceListings]);
                setShowAddModal(false);
                setImagePreview(null);
                setImageFile(null);
                // Reset form
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
                    negotiable: true,
                    image: null
                });
                alert('Listing verified and published!');
            } else {
                alert('Failed to publish listing. check login');
            }
        } catch (error) {
            console.error('Failed to create listing:', error);
            alert('Failed to publish listing.');
        }
    };

    // Handle call button
    const handleCall = (phone) => {
        window.location.href = `tel:${phone}`;
    };

    // Handle message button
    const handleMessage = (phone) => {
        // Try WhatsApp first, fallback to SMS
        const message = encodeURIComponent('Hi, I am interested in your listing on FarmConnect.');
        window.location.href = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`;
    };

    const filteredListings = produceListings.filter(item => {
        const categoryMatch = selectedCategory === 'All Categories' || item.category === selectedCategory;
        const stateMatch = selectedState === 'All States' || item.state === selectedState;
        const priceMatch = item.price >= priceRange[0] && item.price <= priceRange[1];
        const searchMatch = searchQuery === '' ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase());
        return categoryMatch && stateMatch && priceMatch && searchMatch;
    });

    // Sort filtered listings
    const sortedListings = [...filteredListings].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'recent':
            default:
                return 0; // Assuming already sorted by recent
        }
    });

    // Wishlist functions
    const toggleWishlist = async (listingId) => {
        if (!user) {
            alert('Please login to add to wishlist');
            return;
        }

        const isInWishlist = wishlistItems.has(listingId);

        try {
            if (isInWishlist) {
                await fetch(`${API_URL}/api/wishlist/${listingId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                setWishlistItems(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(listingId);
                    return newSet;
                });
            } else {
                await fetch(`${API_URL}/api/wishlist/${listingId}`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ notifyOnPriceDrop: true })
                });
                setWishlistItems(prev => new Set([...prev, listingId]));
            }
        } catch (error) {
            console.error('Wishlist error:', error);
        }
    };

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

            {/* Search Bar with Autocomplete */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSearchSuggestions(e.target.value.length >= 2);
                        }}
                        onFocus={() => setShowSearchSuggestions(searchQuery.length >= 2)}
                        onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                        placeholder="Search by crop, location, or seller..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all"
                    />

                    {/* Search Suggestions Dropdown */}
                    {showSearchSuggestions && searchSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                            {searchSuggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setSearchQuery(suggestion);
                                        setShowSearchSuggestions(false);
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                                >
                                    <div className="flex items-center gap-2">
                                        <Search className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-900">{suggestion}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
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

            {/* Enhanced Filters Bar */}
            <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    {/* Price Range */}
                    <div className="flex-1 min-w-[250px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price Range:  ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="50000"
                            step="500"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                            className="w-full"
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500"
                        >
                            <option value="recent">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>

                    {/* Results Count */}
                    <div className="text-sm text-gray-600">
                        Showing <span className="font-bold text-nature-700">{sortedListings.length}</span> listings
                    </div>
                </div>
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
                            {sortedListings.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                                    <p className="text-gray-500 font-medium">No listings found</p>
                                    <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                                </div>
                            ) : (
                                sortedListings.map(item => (
                                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative">
                                        {/* Wishlist Heart Button */}
                                        <button
                                            onClick={() => toggleWishlist(item.id)}
                                            className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all z-10"
                                        >
                                            <Heart
                                                className={cn(
                                                    "h-5 w-5 transition-colors",
                                                    wishlistItems.has(item.id)
                                                        ? "fill-red-500 text-red-500"
                                                        : "text-gray-400 hover:text-red-500"
                                                )}
                                            />
                                        </button>

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
                                                <p className="text-sm text-gray-600 mb-1">
                                                    Seller: {item.seller}
                                                    {item.sellerId && sellerRatings[item.sellerId] > 0 && (
                                                        <span className="ml-2 inline-flex items-center gap-1 text-yellow-600">
                                                            <Star className="h-3 w-3 fill-yellow-400" />
                                                            <span className="font-medium">{sellerRatings[item.sellerId].toFixed(1)}</span>
                                                        </span>
                                                    )}
                                                </p>
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <MapPin className="h-4 w-4" />
                                                    {item.location}
                                                    {userLocation && item.lat && item.lon && (
                                                        <span className="ml-2 text-nature-600 font-medium">
                                                            • {formatDistance(calculateDistance(
                                                                userLocation.lat,
                                                                userLocation.lon,
                                                                item.lat,
                                                                item.lon
                                                            ))}
                                                        </span>
                                                    )}
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
                                                <button
                                                    onClick={() => handleCall(item.phone)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                                >
                                                    <Phone className="h-4 w-4" />
                                                    Call
                                                </button>
                                                <button
                                                    onClick={() => handleMessage(item.phone)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                                >
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

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex-1 flex flex-col items-center justify-center px-4 py-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-600">Click to upload image</span>
                                        <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                    {imagePreview && (
                                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-nature-500">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => {
                                                    setImagePreview(null);
                                                    setNewListing({ ...newListing, image: null });
                                                }}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
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
