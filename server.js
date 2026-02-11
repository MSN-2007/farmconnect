import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import CloudinaryStorage from 'multer-storage-cloudinary';
import multer from 'multer';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import compression from 'compression';

// Models
import { User } from './src/models/User.js';
import { Listing } from './src/models/Listing.js';
import { Post } from './src/models/Post.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Security Middleware ---
app.use(helmet()); // Secure HTTP headers

// Rate Limiting (100 in 15 mins)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Strict CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:4173'], // Vite default ports
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' })); // Limit body size to prevent DoS
app.use(compression()); // Compress all responses

// --- Configuration ---
// 1. MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/farm-connect')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err));

// 2. Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'farm-connect',
        allowed_formats: ['jpg', 'png', 'jpeg']
    }
});
const upload = multer({ storage: storage });

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- Routes ---

// 1. Authentication
app.post('/api/auth/register',
    [
        body('name').trim().notEmpty().escape(),
        body('phone').trim().isMobilePhone().withMessage('Invalid phone number'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
        body('role').isIn(['farmer', 'consumer', 'expert', 'developer']).optional()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, phone, password, role } = req.body;
            const existingUser = await User.findOne({ phone });
            if (existingUser) return res.status(400).json({ error: 'User already exists' });

            const user = new User({ name, phone, password, role });
            await user.save();

            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.json({ token, user: { id: user._id, name, role } });
        } catch (error) {
            res.status(500).json({ error: 'Registration failed' });
        }
    });

app.post('/api/auth/login',
    [
        body('phone').trim().notEmpty(),
        body('password').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { phone, password } = req.body;
            const user = await User.findOne({ phone });
            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
        } catch (error) {
            res.status(500).json({ error: 'Login failed' });
        }
    });

// 2. AI Vision Proxy
app.post('/api/ai/analyze-image', async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        const apiKey = process.env.VITE_AI_GEMINI_KEY;
        if (!apiKey) return res.status(500).json({ error: 'Missing AI Key' });

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const payload = {
            contents: [{
                parts: [
                    { text: "Analyze this plant image. Identify: 1. Crop Name 2. Disease/Pest (if any) 3. Confidence Level 4. Treatment 5. Prevention. Return ONLY JSON format." },
                    { inline_data: { mime_type: "image/jpeg", data: imageBase64 } }
                ]
            }]
        };

        const response = await axios.post(url, payload);
        const text = response.data.candidates[0].content.parts[0].text;
        const jsonStr = text.replace(/```json|```/g, '').trim();
        res.json(JSON.parse(jsonStr));
    } catch (error) {
        console.error('AI Error:', error.message);
        res.status(500).json({ error: 'Analysis Failed' });
    }
});

// 3. Listings (Buy & Sell)
app.get('/api/listings', async (req, res) => {
    try {
        const { category, state } = req.query;
        const query = {};
        if (category && category !== 'All Categories') query.category = category;
        if (state && state !== 'All States') query.state = state;

        const listings = await Listing.find(query).sort({ createdAt: -1 });
        res.json(listings);
    } catch (error) {
        res.status(500).json({ error: 'Fetch failed' });
    }
});

app.post('/api/listings', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const listingData = req.body;
        if (req.file) {
            listingData.image = req.file.path; // Cloudinary URL
        }
        // If image comes as base64 (fallback), we might want to upload it to cloudinary here too, 
        // but for now let's assume client sends multipart/form-data OR we handle base64 separately if needed.
        // For this specific 'upload.single', client MUST send multipart/form-data.
        // If client sends JSON with base64, 'req.file' is undefined.

        const listing = new Listing({ ...listingData, seller: req.user.id }); // Link to auth user
        await listing.save();
        res.json(listing);
    } catch (error) {
        res.status(500).json({ error: 'Creation failed' });
    }
});

// 4. Community Posts
app.get('/api/posts', async (req, res) => {
    try {
        const { community } = req.query;
        const query = {};
        if (community && community !== 'all') query.community = community;

        const posts = await Post.find(query).sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Fetch failed' });
    }
});

app.post('/api/posts', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const postData = req.body;
        if (req.file) postData.image = req.file.path;

        const post = new Post({ ...postData, author: req.user.id }); // Link to auth user
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Post failed' });
    }
});

app.post('/api/posts/:id/like', authenticateToken, async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { $inc: { likes: 1 } },
            { new: true }
        );
        res.json({ success: true, likes: post.likes });
    } catch (error) {
        res.status(500).json({ error: 'Like failed' });
    }
});

// 5. Weather Proxy
app.get('/api/weather', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const apiKey = process.env.VITE_WEATHER_API_KEY_APAC;
        if (!apiKey) return res.status(500).json({ error: 'Missing Weather Key' });

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (e) { res.status(500).json({ error: 'Weather Fetch Failed' }); }
});

app.get('/api/weather/forecast', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const apiKey = process.env.VITE_WEATHER_API_KEY_APAC;
        if (!apiKey) return res.status(500).json({ error: 'Missing Weather Key' });

        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (e) { res.status(500).json({ error: 'Forecast Fetch Failed' }); }
});

// 6. Analytics (Real-time Graphs)
import { Metric } from './src/models/Metric.js';

app.get('/api/analytics', authenticateToken, async (req, res) => {
    try {
        const metrics = await Metric.find({ user: req.user.id }).sort({ date: 1 });
        res.json(metrics);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch metrics' });
    }
});

app.post('/api/analytics', authenticateToken, async (req, res) => {
    try {
        const metric = new Metric({ ...req.body, user: req.user.id });
        await metric.save();
        res.json(metric);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save metric' });
    }
});


app.listen(PORT, () => console.log(`✅ FarmConnect Production Server running on http://localhost:${PORT}`));
