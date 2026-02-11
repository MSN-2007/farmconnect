// Data Encryption Utilities for Sensitive Information
import crypto from 'crypto';

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16;  // 128 bits
const TAG_LENGTH = 16; // 128 bits

/**
 * Generate encryption key from environment secret
 * In production, use a properly managed encryption key from environment
 */
const getEncryptionKey = () => {
    const secret = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('Encryption key not configured!');
    }
    // Derive a 32-byte key from the secret
    return crypto.createHash('sha256').update(secret).digest();
};

/**
 * Encrypt sensitive data
 * @param {string} text - Plain text to encrypt
 * @returns {string} - Encrypted data in format: iv:tag:encrypted
 */
export const encrypt = (text) => {
    if (!text) return null;

    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    // Return in format: iv:tag:encrypted
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
};

/**
 * Decrypt sensitive data
 * @param {string} encryptedData - Encrypted data in format: iv:tag:encrypted
 * @returns {string} - Decrypted plain text
 */
export const decrypt = (encryptedData) => {
    if (!encryptedData) return null;

    try {
        const key = getEncryptionKey();
        const parts = encryptedData.split(':');

        if (parts.length !== 3) {
            throw new Error('Invalid encrypted data format');
        }

        const iv = Buffer.from(parts[0], 'hex');
        const tag = Buffer.from(parts[1], 'hex');
        const encrypted = parts[2];

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(tag);

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Decryption failed:', error.message);
        return null;
    }
};

/**
 * Hash sensitive data (one-way, for verification)
 * @param {string} data - Data to hash
 * @returns {string} - SHA-256 hash
 */
export const hashData = (data) => {
    return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Mask sensitive data for logging (show first/last 2 chars)
 * @param {string} data - Data to mask
 * @returns {string} - Masked data
 */
export const maskSensitiveData = (data) => {
    if (!data || data.length < 4) return '***';
    return `${data.substring(0, 2)}***${data.substring(data.length - 2)}`;
};

/**
 * Generate secure random token
 * @param {number} length - Token length in bytes
 * @returns {string} - Random hex token
 */
export const generateSecureToken = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

/**
 * Encrypt object fields (for database storage)
 * @param {object} obj - Object with fields to encrypt
 * @param {array} fields - Array of field names to encrypt
 * @returns {object} - Object with encrypted fields
 */
export const encryptFields = (obj, fields = []) => {
    const encrypted = { ...obj };
    fields.forEach(field => {
        if (encrypted[field]) {
            encrypted[field] = encrypt(encrypted[field]);
        }
    });
    return encrypted;
};

/**
 * Decrypt object fields (from database)
 * @param {object} obj - Object with encrypted fields
 * @param {array} fields - Array of field names to decrypt
 * @returns {object} - Object with decrypted fields
 */
export const decryptFields = (obj, fields = []) => {
    const decrypted = { ...obj };
    fields.forEach(field => {
        if (decrypted[field]) {
            decrypted[field] = decrypt(decrypted[field]);
        }
    });
    return decrypted;
};

// Example usage in models:
// Before saving: user.phoneNumber = encrypt(user.phoneNumber);
// After fetching: user.phoneNumber = decrypt(user.phoneNumber);
