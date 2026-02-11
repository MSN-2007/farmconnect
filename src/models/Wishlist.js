import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    },
    notifyOnPriceDrop: {
        type: Boolean,
        default: true
    }
});

// Compound index for efficient queries
wishlistSchema.index({ user: 1, listing: 1 }, { unique: true });
wishlistSchema.index({ user: 1, addedAt: -1 });

export const Wishlist = mongoose.model('Wishlist', wishlistSchema);
