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
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';

// Models
import { User } from './src/models/User.js';
import { Listing } from './src/models/Listing.js';
import { Post } from './src/models/Post.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔒 CRITICAL: Validate JWT_SECRET on startup
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('CHANGE_THIS')) {
    console.error('❌ SECURITY ERROR: JWT_SECRET is not set or uses default value!');
    console.error('Generate a secure secret with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
    process.exit(1);
}

// --- Security Middleware ---
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        },
    },
})); // Secure HTTP headers with CSP

// General Rate Limiting (100 requests per 15 mins)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Strict Auth Rate Limiting (5 attempts per 15 mins)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    message: 'Too many authentication attempts, please try again after 15 minutes.',
});

// Strict CORS
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:5173', 'http://localhost:4173'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies for future httpOnly JWT implementation
}));

app.use(express.json({ limit: '10mb' })); // Limit body size to prevent DoS
app.use(cookieParser()); // Parse cookies for future httpOnly JWT
app.use(compression()); // Compress all responses

// 🛡️ NoSQL Injection Prevention
app.use(mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        console.warn(`⚠️ Sanitized NoSQL injection attempt: ${key}`);
    },
}));

// 🛡️ HTTP Parameter Pollution Protection
app.use(hpp());

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
    authLimiter, // Apply strict rate limiting
    [
        body('name').trim().notEmpty().isLength({ max: 100 }).escape().withMessage('Name is required (max 100 chars)'),
        body('phone').trim().isMobilePhone('en-IN').withMessage('Invalid Indian mobile number'),
        body('password')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 chars')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain: uppercase, lowercase, and number'),
        body('role').optional().isIn(['farmer', 'consumer', 'expert', 'developer']).withMessage('Invalid role')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, phone, password, role } = req.body;

            // Check for existing user
            const existingUser = await User.findOne({ phone });
            if (existingUser) {
                return res.status(400).json({ error: 'Phone number already registered' });
            }

            const user = new User({ name, phone, password, role: role || 'farmer' });
            await user.save();

            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d', algorithm: 'HS256' }
            );

            res.json({
                token,
                user: { id: user._id, name: user.name, role: user.role }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Registration failed. Please try again.' });
        }
    });

app.post('/api/auth/login',
    authLimiter, // Apply strict rate limiting
    [
        body('phone').trim().notEmpty().isMobilePhone('en-IN').withMessage('Invalid phone number'),
        body('password').notEmpty().withMessage('Password is required')
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
                // Use generic error message to prevent user enumeration
                return res.status(401).json({ error: 'Invalid phone number or password' });
            }

            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d', algorithm: 'HS256' }
            );

            res.json({
                token,
                user: { id: user._id, name: user.name, role: user.role }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Login failed. Please try again.' });
        }
    });

// 2. AI Vision Proxy (Protected Endpoint)
app.post('/api/ai/analyze-image',
    authenticateToken, // Require authentication
    [
        body('imageBase64').notEmpty().withMessage('Image data is required'),
        body('imageBase64').isBase64().withMessage('Invalid image format')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { imageBase64 } = req.body;

            // Validate image size (max ~7MB base64 = ~5MB actual)
            if (imageBase64.length > 7 * 1024 * 1024) {
                return res.status(400).json({ error: 'Image too large (max 5MB)' });
            }

            const apiKey = process.env.VITE_AI_GEMINI_KEY;
            if (!apiKey) {
                console.error('❌ VITE_AI_GEMINI_KEY not configured');
                return res.status(500).json({ error: 'AI service unavailable' });
            }

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            const payload = {
                contents: [{
                    parts: [
                        { text: "Analyze this plant image. Identify: 1. Crop Name 2. Disease/Pest (if any) 3. Confidence Level 4. Treatment 5. Prevention. Return ONLY JSON format." },
                        { inline_data: { mime_type: "image/jpeg", data: imageBase64 } }
                    ]
                }]
            };

            const response = await axios.post(url, payload, { timeout: 30000 });
            const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                return res.status(500).json({ error: 'Invalid AI response' });
            }

            const jsonStr = text.replace(/```json|```/g, '').trim();
            res.json(JSON.parse(jsonStr));
        } catch (error) {
            console.error('AI Error:', error.message);

            if (error.response?.status === 429) {
                return res.status(429).json({ error: 'AI service rate limit exceeded. Try again later.' });
            }

            res.status(500).json({ error: 'Image analysis failed. Please try again.' });
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

app.post('/api/listings',
    authenticateToken,
    upload.single('image'),
    [
        body('name').trim().notEmpty().isLength({ max: 200 }).escape(),
        body('price').isNumeric().isFloat({ min: 0 }),
        body('unit').trim().notEmpty().isLength({ max: 50 }),
        body('quantity').trim().notEmpty(),
        body('location').trim().notEmpty().isLength({ max: 200 }),
        body('state').trim().notEmpty().isLength({ max: 100 }),
        body('phone').trim().isMobilePhone('en-IN'),
        body('category').trim().notEmpty(),
        body('description').optional().trim().isLength({ max: 1000 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const listingData = req.body;
            if (req.file) {
                listingData.image = req.file.path; // Cloudinary URL
            }

            const listing = new Listing({ ...listingData, seller: req.user.id });
            await listing.save();
            res.json(listing);
        } catch (error) {
            console.error('Listing creation error:', error);
            res.status(500).json({ error: 'Failed to create listing' });
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

app.post('/api/posts',
    authenticateToken,
    upload.single('image'),
    [
        body('content').trim().notEmpty().isLength({ max: 5000 }).withMessage('Content required (max 5000 chars)'),
        body('community').trim().notEmpty().isLength({ max: 100 }),
        body('tags').optional().isArray()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const postData = req.body;
            if (req.file) postData.image = req.file.path;

            const post = new Post({ ...postData, author: req.user.id });
            await post.save();
            res.json(post);
        } catch (error) {
            console.error('Post creation error:', error);
            res.status(500).json({ error: 'Failed to create post' });
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
