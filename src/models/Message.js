import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 2000
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'listing'],
        default: 'text'
    },
    // If messageType is 'listing', store listing reference
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing'
    },
    // If messageType is 'image', store image URL
    imageUrl: {
        type: String
    },
    // Read status
    read: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, read: 1 });

export const Message = mongoose.model('Message', messageSchema);

// Conversation model to group messages
const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Related listing if conversation started from a listing
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing'
    },
    lastMessage: {
        type: String
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    },
    // Unread count per participant
    unreadCount: {
        type: Map,
        of: Number,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });

// Ensure participants array has exactly 2 unique users
conversationSchema.pre('save', function (next) {
    if (this.participants.length !== 2) {
        next(new Error('Conversation must have exactly 2 participants'));
    }
    const uniqueParticipants = [...new Set(this.participants.map(p => p.toString()))];
    if (uniqueParticipants.length !== 2) {
        next(new Error('Participants must be unique'));
    }
    next();
});

export const Conversation = mongoose.model('Conversation', conversationSchema);
