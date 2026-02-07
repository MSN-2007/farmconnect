// Offline Data Manager for FarmConnect
// Handles caching, offline storage, and data synchronization

class OfflineDataManager {
    constructor() {
        this.dbName = 'FarmConnectDB';
        this.dbVersion = 1;
        this.db = null;
        this.init();
    }

    // Initialize IndexedDB
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Weather data store
                if (!db.objectStoreNames.contains('weather')) {
                    const weatherStore = db.createObjectStore('weather', { keyPath: 'id' });
                    weatherStore.createIndex('date', 'date', { unique: false });
                    weatherStore.createIndex('location', 'location', { unique: false });
                }

                // Pest & Disease database
                if (!db.objectStoreNames.contains('pestDatabase')) {
                    const pestStore = db.createObjectStore('pestDatabase', { keyPath: 'id' });
                    pestStore.createIndex('name', 'name', { unique: false });
                    pestStore.createIndex('type', 'type', { unique: false });
                }

                // Crop varieties database
                if (!db.objectStoreNames.contains('cropVarieties')) {
                    const varietyStore = db.createObjectStore('cropVarieties', { keyPath: 'id' });
                    varietyStore.createIndex('crop', 'crop', { unique: false });
                }

                // Market prices cache
                if (!db.objectStoreNames.contains('marketPrices')) {
                    const priceStore = db.createObjectStore('marketPrices', { keyPath: 'id' });
                    priceStore.createIndex('crop', 'crop', { unique: false });
                    priceStore.createIndex('date', 'date', { unique: false });
                }

                // User data (posts, listings, etc.)
                if (!db.objectStoreNames.contains('userData')) {
                    db.createObjectStore('userData', { keyPath: 'id', autoIncrement: true });
                }

                // Download packs metadata
                if (!db.objectStoreNames.contains('downloadPacks')) {
                    const packStore = db.createObjectStore('downloadPacks', { keyPath: 'id' });
                    packStore.createIndex('type', 'type', { unique: false });
                    packStore.createIndex('version', 'version', { unique: false });
                }
            };
        });
    }

    // Save weather data for offline use
    async saveWeatherData(weatherData) {
        const transaction = this.db.transaction(['weather'], 'readwrite');
        const store = transaction.objectStore('weather');

        for (const day of weatherData) {
            await store.put({
                id: `weather_${day.date}_${day.location}`,
                ...day,
                cachedAt: new Date().toISOString()
            });
        }

        return transaction.complete;
    }

    // Get cached weather data
    async getWeatherData(location, days = 15) {
        const transaction = this.db.transaction(['weather'], 'readonly');
        const store = transaction.objectStore('weather');
        const index = store.index('location');

        const results = await index.getAll(location);
        return results.slice(0, days);
    }

    // Save pest & disease database
    async savePestDatabase(pestData) {
        const transaction = this.db.transaction(['pestDatabase'], 'readwrite');
        const store = transaction.objectStore('pestDatabase');

        for (const pest of pestData) {
            await store.put({
                id: `pest_${pest.name.toLowerCase().replace(/\s+/g, '_')}`,
                ...pest,
                downloadedAt: new Date().toISOString()
            });
        }

        return transaction.complete;
    }

    // Get pest/disease info offline
    async getPestInfo(name) {
        const transaction = this.db.transaction(['pestDatabase'], 'readonly');
        const store = transaction.objectStore('pestDatabase');
        const index = store.index('name');

        return await index.get(name);
    }

    // Search pests by type (disease, pest, weed)
    async searchPestsByType(type) {
        const transaction = this.db.transaction(['pestDatabase'], 'readonly');
        const store = transaction.objectStore('pestDatabase');
        const index = store.index('type');

        return await index.getAll(type);
    }

    // Save crop varieties
    async saveCropVarieties(varieties) {
        const transaction = this.db.transaction(['cropVarieties'], 'readwrite');
        const store = transaction.objectStore('cropVarieties');

        for (const variety of varieties) {
            await store.put({
                id: `variety_${variety.crop}_${variety.name}`,
                ...variety,
                downloadedAt: new Date().toISOString()
            });
        }

        return transaction.complete;
    }

    // Get crop varieties offline
    async getCropVarieties(crop) {
        const transaction = this.db.transaction(['cropVarieties'], 'readonly');
        const store = transaction.objectStore('cropVarieties');
        const index = store.index('crop');

        return await index.getAll(crop);
    }

    // Save market prices
    async saveMarketPrices(prices) {
        const transaction = this.db.transaction(['marketPrices'], 'readwrite');
        const store = transaction.objectStore('marketPrices');

        for (const price of prices) {
            await store.put({
                id: `price_${price.crop}_${price.date}`,
                ...price,
                cachedAt: new Date().toISOString()
            });
        }

        return transaction.complete;
    }

    // Get cached market prices
    async getMarketPrices(crop) {
        const transaction = this.db.transaction(['marketPrices'], 'readonly');
        const store = transaction.objectStore('marketPrices');
        const index = store.index('crop');

        return await index.getAll(crop);
    }

    // Save user data for offline access
    async saveUserData(type, data) {
        const transaction = this.db.transaction(['userData'], 'readwrite');
        const store = transaction.objectStore('userData');

        await store.put({
            ...data,
            type,
            savedAt: new Date().toISOString(),
            synced: false
        });

        return transaction.complete;
    }

    // Get pending user data to sync
    async getPendingSync() {
        const transaction = this.db.transaction(['userData'], 'readonly');
        const store = transaction.objectStore('userData');

        const allData = await store.getAll();
        return allData.filter(item => !item.synced);
    }

    // Mark data as synced
    async markAsSynced(id) {
        const transaction = this.db.transaction(['userData'], 'readwrite');
        const store = transaction.objectStore('userData');

        const data = await store.get(id);
        if (data) {
            data.synced = true;
            data.syncedAt = new Date().toISOString();
            await store.put(data);
        }

        return transaction.complete;
    }

    // Download data pack
    async downloadPack(packType, packData) {
        const transaction = this.db.transaction(['downloadPacks'], 'readwrite');
        const store = transaction.objectStore('downloadPacks');

        await store.put({
            id: `pack_${packType}`,
            type: packType,
            data: packData,
            version: packData.version || 1,
            downloadedAt: new Date().toISOString(),
            size: JSON.stringify(packData).length
        });

        return transaction.complete;
    }

    // Check if pack needs update
    async checkPackVersion(packType, currentVersion) {
        const transaction = this.db.transaction(['downloadPacks'], 'readonly');
        const store = transaction.objectStore('downloadPacks');

        const pack = await store.get(`pack_${packType}`);
        if (!pack) return true; // Need to download

        return pack.version < currentVersion; // Need update
    }

    // Get storage usage
    async getStorageInfo() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            return {
                usage: estimate.usage,
                quota: estimate.quota,
                percentUsed: (estimate.usage / estimate.quota * 100).toFixed(2)
            };
        }
        return null;
    }

    // Clear old cache (older than 30 days)
    async clearOldCache() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const stores = ['weather', 'marketPrices'];

        for (const storeName of stores) {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const allData = await store.getAll();

            for (const item of allData) {
                const cachedDate = new Date(item.cachedAt);
                if (cachedDate < thirtyDaysAgo) {
                    await store.delete(item.id);
                }
            }
        }
    }
}

// Export singleton instance
const offlineDataManager = new OfflineDataManager();
export default offlineDataManager;
