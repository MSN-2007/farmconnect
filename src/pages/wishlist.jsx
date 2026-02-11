import React, { useState, useEffect } from 'react';
import { Heart, X, Phone, MessageCircle, MapPin, TrendingUp, Trash2, Bell, BellOff } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import { cn } from '../lib/utils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const WishlistPage = () => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, avgPrice: 0, lowestPrice: 0 });

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const res = await fetch(`${API_URL}/api/wishlist`, {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setWishlist(data);
                calculateStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (items) => {
        if (items.length === 0) return;

        const prices = items.map(item => item.listing?.price || 0);
        setStats({
            total: items.length,
            avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
            lowestPrice: Math.min(...prices)
        });
    };

    const removeFromWishlist = async (listingId) => {
        try {
            const res = await fetch(`${API_URL}/api/wishlist/${listingId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                setWishlist(wishlist.filter(item => item.listing._id !== listingId));
                calculateStats(wishlist.filter(item => item.listing._id !== listingId));
            }
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
        }
    };

    const handleCall = (phone) => {
        window.location.href = `tel:${phone}`;
    };

    const handleMessage = (phone) => {
        const message = encodeURIComponent('Hi, I am interested in your listing on FarmConnect.');
        window.location.href = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`;
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto py-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-nature-600 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading your wishlist...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-8 w-8 text-red-500 fill-red-500" />
                    <h1 className="text-3xl font-bold text-nature-900">My Wishlist</h1>
                </div>
                <p className="text-gray-600">Save items you're interested in and get notified about price changes</p>
            </div>

            {/* Stats Cards */}
            {wishlist.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="text-sm text-gray-600 mb-1">Total Items</div>
                        <div className="text-2xl font-bold text-nature-700">{stats.total}</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="text-sm text-gray-600 mb-1">Average Price</div>
                        <div className="text-2xl font-bold text-gray-900">₹{stats.avgPrice.toLocaleString()}</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="text-sm text-gray-600 mb-1">Best Deal</div>
                        <div className="text-2xl font-bold text-green-600">₹{stats.lowestPrice.toLocaleString()}</div>
                    </div>
                </div>
            )}

            {/* Wishlist Items */}
            {wishlist.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-600 mb-4">
                        Start adding items you like to your wishlist!
                    </p>
                    <a
                        href="/buy-sell"
                        className="inline-block px-6 py-2 bg-nature-700 text-white rounded-lg font-medium hover:bg-nature-800 transition-colors"
                    >
                        Browse Listings
                    </a>
                </div>
            ) : (
                <div className="space-y-4">
                    {wishlist.map(({ listing, addedAt, notifyOnPriceDrop }) => (
                        <div key={listing._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{listing.name}</h3>
                                        {listing.verified && (
                                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                                ✓ Verified
                                            </span>
                                        )}
                                        {listing.negotiable && (
                                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                                Negotiable
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">Seller: {listing.seller || 'Unknown'}</p>
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <MapPin className="h-4 w-4" />
                                        {listing.location}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-2">
                                        Added {new Date(addedAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-2xl font-bold text-nature-700">₹{listing.price.toLocaleString()}</div>
                                    <div className="text-sm text-gray-500">per {listing.unit}</div>
                                </div>
                            </div>

                            <p className="text-gray-700 text-sm mb-4 leading-relaxed">{listing.description}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-gray-600">{listing.quantity || 'In Stock'}</span>
                                    <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">{listing.category}</span>
                                    {notifyOnPriceDrop && (
                                        <div className="flex items-center gap-1 text-xs text-green-600">
                                            <Bell className="h-3 w-3" />
                                            Price alerts ON
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleCall(listing.phone)}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                    >
                                        <Phone className="h-4 w-4" />
                                        Call
                                    </button>
                                    <button
                                        onClick={() => handleMessage(listing.phone)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        Message
                                    </button>
                                    <button
                                        onClick={() => removeFromWishlist(listing._id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
