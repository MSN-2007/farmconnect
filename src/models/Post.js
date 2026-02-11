import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    author: { type: String, required: true }, // Ideally ref to User
    content: { type: String, required: true },
    community: { type: String, required: true },
    image: String, // URL
    tags: [String],
    likes: { type: Number, default: 0 },
    comments: [{
        author: String,
        content: String,
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

postSchema.index({ community: 1 });

export const Post = mongoose.model('Post', postSchema);
