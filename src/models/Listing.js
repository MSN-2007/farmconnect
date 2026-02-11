import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    seller: { type: String, required: true }, // Ideally ref to User, keeping simple for migration
    price: { type: Number, required: true },
    unit: { type: String, required: true },
    quantity: { type: String, required: true },
    location: { type: String, required: true },
    state: { type: String, required: true },
    phone: { type: String, required: true },
    category: { type: String, required: true },
    description: String,
    image: String, // URL from Cloudinary
    verified: { type: Boolean, default: false },
    negotiable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Indexes for faster search
listingSchema.index({ category: 1 });
listingSchema.index({ state: 1 });
listingSchema.index({ location: 'text' }); // Text search for future use

export const Listing = mongoose.model('Listing', listingSchema);
