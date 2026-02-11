import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    // Order details
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        default: 'kg'
    },
    pricePerUnit: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    // Delivery info
    deliveryAddress: {
        type: String,
        required: true
    },
    deliveryPhone: {
        type: String,
        required: true
    },
    deliveryMethod: {
        type: String,
        enum: ['pickup', 'delivery'],
        default: 'delivery'
    },
    // Status tracking
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    statusHistory: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String
    }],
    // Payment
    paymentMethod: {
        type: String,
        enum: ['cod', 'online', 'advance'],
        default: 'cod'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'partial', 'paid'],
        default: 'pending'
    },
    advanceAmount: {
        type: Number,
        default: 0
    },
    // Timestamps
    orderDate: {
        type: Date,
        default: Date.now
    },
    expectedDelivery: {
        type: Date
    },
    deliveredAt: {
        type: Date
    },
    // Notes
    buyerNotes: {
        type: String,
        maxlength: 500
    },
    sellerNotes: {
        type: String,
        maxlength: 500
    },
    // Cancellation
    cancellationReason: {
        type: String
    },
    cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Indexes for performance
orderSchema.index({ buyer: 1, orderDate: -1 });
orderSchema.index({ seller: 1, orderDate: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderDate: -1 });

// Auto-populate listing and user data
orderSchema.pre(/^find/, function (next) {
    this.populate('listing', 'name image category')
        .populate('buyer', 'name phone')
        .populate('seller', 'name phone');
    next();
});

export const Order = mongoose.model('Order', orderSchema);
