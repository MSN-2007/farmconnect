// Security Monitoring and Logging Middleware
import jwt from 'jsonwebtoken';

// Security event logger
export const securityLogger = {
    logAuthAttempt: (ip, phone, success) => {
        const timestamp = new Date().toISOString();
        const status = success ? 'SUCCESS' : 'FAILED';
        console.log(`[SECURITY] ${timestamp} | AUTH ${status} | IP: ${ip} | Phone: ${phone}`);
    },

    logRateLimitHit: (ip, endpoint) => {
        const timestamp = new Date().toISOString();
        console.error(`[SECURITY] ${timestamp} | RATE_LIMIT | IP: ${ip} | Endpoint: ${endpoint}`);
    },

    logAuthorizationFailure: (userId, resource, action) => {
        const timestamp = new Date().toISOString();
        console.warn(`[SECURITY] ${timestamp} | AUTHZ_FAILED | User: ${userId} | Resource: ${resource} | Action: ${action}`);
    },

    logSuspiciousActivity: (ip, reason) => {
        const timestamp = new Date().toISOString();
        console.error(`[SECURITY] ${timestamp} | SUSPICIOUS | IP: ${ip} | Reason: ${reason}`);
    }
};

// IP-based request tracking (for brute force detection)
const requestTracker = new Map();
const SUSPICIOUS_THRESHOLD = 50; // requests per minute

export const trackRequest = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!requestTracker.has(ip)) {
        requestTracker.set(ip, []);
    }

    const requests = requestTracker.get(ip);
    // Remove requests older than 1 minute
    const recentRequests = requests.filter(time => now - time < 60000);
    recentRequests.push(now);
    requestTracker.set(ip, recentRequests);

    // Flag suspicious activity
    if (recentRequests.length > SUSPICIOUS_THRESHOLD) {
        securityLogger.logSuspiciousActivity(ip, `${recentRequests.length} requests in 1 minute`);
    }

    next();
};

// Enhanced authentication logger
export const logAuthMiddleware = (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = (body) => {
        // Log authentication attempts
        if (req.path === '/api/auth/login' || req.path === '/api/auth/register') {
            const ip = req.ip || req.connection.remoteAddress;
            const phone = req.body?.phone || 'unknown';
            const success = res.statusCode === 200;

            securityLogger.logAuthAttempt(ip, phone, success);
        }

        return originalJson(body);
    };

    next();
};

// Audit trail for sensitive operations
export const auditLogger = {
    logDataAccess: (userId, resource, action) => {
        const timestamp = new Date().toISOString();
        console.log(`[AUDIT] ${timestamp} | USER: ${userId} | ${action} | ${resource}`);
    },

    logDataModification: (userId, collection, documentId, changes) => {
        const timestamp = new Date().toISOString();
        console.log(`[AUDIT] ${timestamp} | MODIFY | User: ${userId} | Collection: ${collection} | Doc: ${documentId}`);
    },

    logDataDeletion: (userId, collection, documentId) => {
        const timestamp = new Date().toISOString();
        console.warn(`[AUDIT] ${timestamp} | DELETE | User: ${userId} | Collection: ${collection} | Doc: ${documentId}`);
    }
};

// Production error handler (no stack traces to client)
export const productionErrorHandler = (err, req, res, next) => {
    // Log full error server-side
    console.error('[ERROR]', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip
    });

    // Send minimal error to client in production
    if (process.env.NODE_ENV === 'production') {
        res.status(err.status || 500).json({
            error: 'An error occurred',
            message: err.message || 'Internal server error',
            requestId: req.id
        });
    } else {
        // Full error in development
        res.status(err.status || 500).json({
            error: err.message,
            stack: err.stack
        });
    }
};

// Request sanitizer - removes potential XSS from all inputs
export const sanitizeInputs = (req, res, next) => {
    const sanitize = (obj) => {
        if (typeof obj === 'string') {
            // Remove potential script tags and dangerous characters
            return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '');
        }
        if (typeof obj === 'object' && obj !== null) {
            Object.keys(obj).forEach(key => {
                obj[key] = sanitize(obj[key]);
            });
        }
        return obj;
    };

    if (req.body) {
        req.body = sanitize(req.body);
    }
    if (req.query) {
        req.query = sanitize(req.query);
    }
    if (req.params) {
        req.params = sanitize(req.params);
    }

    next();
};
