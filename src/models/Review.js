import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        maxlength: 500
    },
    images: [{
        type: String
    }],
    // Specific ratings
    qualityRating: { type: Number, min: 1, max: 5 },
    communicationRating: { type: Number, min: 1, max: 5 },
    deliveryRating: { type: Number, min: 1, max: 5 },

    // Seller response
    sellerResponse: {
        type: String,
        maxlength: 500
    },
    sellerRespondedAt: {
        type: Date
    },

    // Helpful votes
    helpfulCount: {
        type: Number,
        default: 0
    },

    verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for performance
reviewSchema.index({ seller: 1, createdAt: -1 });
reviewSchema.index({ buyer: 1 });
reviewSchema.index({ listing: 1 });
reviewSchema.index({ rating: 1 });

// Prevent duplicate reviews from same buyer to same seller
reviewSchema.index({ seller: 1, buyer: 1, listing: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);
