import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Star, Package, MapPin, Calendar, Shield, Award, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/auth-context';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const UserProfilePage = () => {
    const { userId } = useParams();
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);

    useEffect(() => {
        fetchProfile();
        fetchReviews();
    }, [userId]);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${API_URL}/api/users/${userId}/profile`);
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${API_URL}/api/reviews/seller/${userId}`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={cn(
                    "h-4 w-4",
                    i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                )}
            />
        ));
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto py-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-nature-600 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="max-w-7xl mx-auto py-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <p className="text-gray-500 font-medium">User not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-nature-600 to-nature-800 rounded-xl shadow-lg p-8 mb-6 text-white">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                        <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                            <User className="h-12 w-12" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{profile.user.name}</h1>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="bg-white/20 px-3 py-1 rounded-full capitalize">
                                    {profile.user.role}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Joined {new Date(profile.user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {currentUser && currentUser.id !== userId && (
                        <button
                            onClick={() => setShowReviewModal(true)}
                            className="bg-white text-nature-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                        >
                            Write Review
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                            <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {profile.stats.averageRating > 0 ? profile.stats.averageRating.toFixed(1) : 'N/A'}
                            </div>
                            <div className="text-sm text-gray-600">Average Rating</div>
                        </div>
                    </div>
                    {profile.stats.averageRating > 0 && (
                        <div className="flex items-center gap-1">
                            {renderStars(Math.round(profile.stats.averageRating))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{profile.stats.listingsCount}</div>
                            <div className="text-sm text-gray-600">Active Listings</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <MessageCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{profile.stats.reviewsCount}</div>
                            <div className="text-sm text-gray-600">Reviews</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-900">Verified</div>
                            <div className="text-xs text-gray-600">Phone ✓</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rating Breakdown */}
            {profile.stats.reviewsCount > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Rating Breakdown</h2>
                    <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map(rating => {
                            const count = profile.stats.ratingBreakdown[rating] || 0;
                            const percentage = (count / profile.stats.reviewsCount) * 100;
                            return (
                                <div key={rating} className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 w-20">
                                        <span className="text-sm font-medium">{rating}</span>
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    </div>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-400 transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Reviews ({reviews.length})</h2>
                {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No reviews yet</p>
                ) : (
                    <div className="space-y-6">
                        {reviews.map(review => (
                            <div key={review._id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="font-medium text-gray-900">{review.buyer?.name || 'Anonymous'}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center gap-1">
                                                {renderStars(review.rating)}
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    {review.verified && (
                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                                            ✓ Verified Purchase
                                        </span>
                                    )}
                                </div>
                                {review.comment && (
                                    <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
                                )}
                                {(review.qualityRating || review.communicationRating || review.deliveryRating) && (
                                    <div className="flex gap-4 text-sm">
                                        {review.qualityRating && (
                                            <div className="flex items-center gap-1">
                                                <span className="text-gray-600">Quality:</span>
                                                <div className="flex">{renderStars(review.qualityRating)}</div>
                                            </div>
                                        )}
                                        {review.communicationRating && (
                                            <div className="flex items-center gap-1">
                                                <span className="text-gray-600">Communication:</span>
                                                <div className="flex">{renderStars(review.communicationRating)}</div>
                                            </div>
                                        )}
                                        {review.deliveryRating && (
                                            <div className="flex items-center gap-1">
                                                <span className="text-gray-600">Delivery:</span>
                                                <div className="flex">{renderStars(review.deliveryRating)}</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {review.sellerResponse && (
                                    <div className="mt-3 ml-6 p-3 bg-gray-50 rounded-lg">
                                        <div className="text-sm font-medium text-gray-900 mb-1">Seller Response</div>
                                        <p className="text-sm text-gray-700">{review.sellerResponse}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {showReviewModal && <ReviewModal userId={userId} onClose={() => setShowReviewModal(false)} onSubmit={fetchReviews} />}
        </div>
    );
};

// Review Modal Component
const ReviewModal = ({ userId, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [qualityRating, setQualityRating] = useState(0);
    const [communicationRating, setCommunicationRating] = useState(0);
    const [deliveryRating, setDeliveryRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/api/reviews`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    seller: userId,
                    rating,
                    comment,
                    qualityRating: qualityRating || undefined,
                    communicationRating: communicationRating || undefined,
                    deliveryRating: deliveryRating || undefined
                })
            });

            if (res.ok) {
                onSubmit();
                onClose();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to submit review');
            }
        } catch (error) {
            alert('Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating *</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(r => (
                                <button
                                    key={r}
                                    onClick={() => setRating(r)}
                                    className="p-1"
                                >
                                    <Star className={cn("h-8 w-8", r <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience..."
                            className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-nature-500"
                            rows="4"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Quality</label>
                            <div className="flex flex-col gap-1">
                                {[1, 2, 3, 4, 5].map(r => (
                                    <button key={r} onClick={() => setQualityRating(r)}>
                                        <Star className={cn("h-4 w-4", r <= qualityRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Communication</label>
                            <div className="flex flex-col gap-1">
                                {[1, 2, 3, 4, 5].map(r => (
                                    <button key={r} onClick={() => setCommunicationRating(r)}>
                                        <Star className={cn("h-4 w-4", r <= communicationRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Delivery</label>
                            <div className="flex flex-col gap-1">
                                {[1, 2, 3, 4, 5].map(r => (
                                    <button key={r} onClick={() => setDeliveryRating(r)}>
                                        <Star className={cn("h-4 w-4", r <= deliveryRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-2 bg-nature-700 text-white rounded-lg font-medium hover:bg-nature-800 disabled:opacity-50"
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
