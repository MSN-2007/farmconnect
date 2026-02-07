import React, { useState, useEffect } from 'react';
import { Download, Check, RefreshCw, HardDrive, Wifi, WifiOff } from 'lucide-react';
import { cn } from '../lib/utils';
import offlineDataManager from '../lib/offline-data-manager';

const OfflineDataPacks = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [storageInfo, setStorageInfo] = useState(null);
    const [packs, setPacks] = useState([
        {
            id: 'weather',
            name: 'Weather Forecast',
            description: '15-day weather forecast',
            size: '2 MB',
            version: 1,
            downloaded: false,
            downloading: false,
            icon: '🌤️'
        },
        {
            id: 'pest_disease',
            name: 'Pest & Disease Database',
            description: '500+ pests, diseases, and treatments',
            size: '15 MB',
            version: 1,
            downloaded: false,
            downloading: false,
            icon: '🐛'
        },
        {
            id: 'crop_varieties',
            name: 'Crop Varieties',
            description: 'All crop varieties and info',
            size: '8 MB',
            version: 1,
            downloaded: false,
            downloading: false,
            icon: '🌾'
        },
        {
            id: 'market_prices',
            name: 'Market Prices',
            description: 'Historical price data',
            size: '5 MB',
            version: 1,
            downloaded: false,
            downloading: false,
            icon: '💰'
        },
        {
            id: 'farming_tips',
            name: 'Farming Tips',
            description: 'Offline farming guides',
            size: '3 MB',
            version: 1,
            downloaded: false,
            downloading: false,
            icon: '💡'
        }
    ]);

    useEffect(() => {
        // Monitor online/offline status
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Get storage info
        loadStorageInfo();

        // Check downloaded packs
        checkDownloadedPacks();

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const loadStorageInfo = async () => {
        const info = await offlineDataManager.getStorageInfo();
        setStorageInfo(info);
    };

    const checkDownloadedPacks = async () => {
        const updatedPacks = await Promise.all(packs.map(async (pack) => {
            const needsUpdate = await offlineDataManager.checkPackVersion(pack.id, pack.version);
            return {
                ...pack,
                downloaded: !needsUpdate
            };
        }));
        setPacks(updatedPacks);
    };

    const downloadPack = async (packId) => {
        // Update UI to show downloading
        setPacks(packs.map(p =>
            p.id === packId ? { ...p, downloading: true } : p
        ));

        // Simulate download with mock data
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate mock data based on pack type
        let packData = {};

        if (packId === 'weather') {
            packData = {
                version: 1,
                data: generateWeatherData(15)
            };
            await offlineDataManager.saveWeatherData(packData.data);
        } else if (packId === 'pest_disease') {
            packData = {
                version: 1,
                data: generatePestDatabase()
            };
            await offlineDataManager.savePestDatabase(packData.data);
        } else if (packId === 'crop_varieties') {
            packData = {
                version: 1,
                data: generateCropVarieties()
            };
            await offlineDataManager.saveCropVarieties(packData.data);
        } else if (packId === 'market_prices') {
            packData = {
                version: 1,
                data: generateMarketPrices()
            };
            await offlineDataManager.saveMarketPrices(packData.data);
        }

        // Save pack metadata
        await offlineDataManager.downloadPack(packId, packData);

        // Update UI
        setPacks(packs.map(p =>
            p.id === packId ? { ...p, downloading: false, downloaded: true } : p
        ));

        // Refresh storage info
        loadStorageInfo();
    };

    // Generate mock weather data
    const generateWeatherData = (days) => {
        const data = [];
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            data.push({
                date: date.toISOString().split('T')[0],
                location: 'Current Location',
                temp: 22 + Math.random() * 10,
                rainfall: Math.random() > 0.7 ? Math.random() * 15 : 0,
                humidity: 60 + Math.random() * 30,
                condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)]
            });
        }
        return data;
    };

    // Generate mock pest database
    const generatePestDatabase = () => {
        return [
            {
                name: 'Aphids',
                type: 'pest',
                description: 'Small sap-sucking insects',
                treatment: 'Neem oil spray, insecticidal soap',
                prevention: 'Encourage natural predators, regular monitoring',
                images: []
            },
            {
                name: 'Early Blight',
                type: 'disease',
                description: 'Fungal disease affecting tomatoes',
                treatment: 'Copper-based fungicides, remove infected leaves',
                prevention: 'Crop rotation, proper spacing, mulching',
                images: []
            },
            // Add more entries...
        ];
    };

    // Generate mock crop varieties
    const generateCropVarieties = () => {
        return [
            {
                crop: 'Wheat',
                name: 'HD-2967',
                description: 'High-yielding variety for irrigated areas',
                duration: '140-145 days',
                yield: '50-55 quintals/hectare',
                features: ['Disease resistant', 'Good grain quality']
            },
            {
                crop: 'Rice',
                name: 'Pusa Basmati 1121',
                description: 'Premium basmati variety',
                duration: '145-150 days',
                yield: '45-50 quintals/hectare',
                features: ['Long grain', 'Aromatic', 'Export quality']
            },
            // Add more varieties...
        ];
    };

    // Generate mock market prices
    const generateMarketPrices = () => {
        const crops = ['Wheat', 'Rice', 'Cotton', 'Maize'];
        const data = [];

        for (const crop of crops) {
            for (let i = 0; i < 30; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                data.push({
                    crop,
                    date: date.toISOString().split('T')[0],
                    price: 2000 + Math.random() * 1000,
                    market: 'Local Mandi'
                });
            }
        }

        return data;
    };

    return (
        <div className="max-w-4xl mx-auto py-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">Offline Data Packs</h1>
                    <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
                        isOnline ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                        {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                        {isOnline ? 'Online' : 'Offline'}
                    </div>
                </div>
                <p className="text-gray-600">Download data packs to use FarmConnect offline</p>
            </div>

            {/* Storage Info */}
            {storageInfo && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                        <HardDrive className="h-6 w-6 text-blue-600" />
                        <h3 className="font-bold text-gray-900">Storage Usage</h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Used</span>
                            <span className="font-semibold text-gray-900">
                                {(storageInfo.usage / 1024 / 1024).toFixed(2)} MB
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${storageInfo.percentUsed}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>{storageInfo.percentUsed}% used</span>
                            <span>{(storageInfo.quota / 1024 / 1024 / 1024).toFixed(2)} GB available</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Data Packs */}
            <div className="space-y-4">
                {packs.map(pack => (
                    <div key={pack.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="text-4xl">{pack.icon}</div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{pack.name}</h3>
                                        <p className="text-sm text-gray-600">{pack.description}</p>
                                    </div>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                        {pack.size}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 mt-4">
                                    {pack.downloaded ? (
                                        <>
                                            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                                                <Check className="h-4 w-4" />
                                                Downloaded
                                            </div>
                                            <button
                                                onClick={() => downloadPack(pack.id)}
                                                disabled={!isOnline || pack.downloading}
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <RefreshCw className={cn("h-4 w-4", pack.downloading && "animate-spin")} />
                                                Update
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => downloadPack(pack.id)}
                                            disabled={!isOnline || pack.downloading}
                                            className="flex items-center gap-2 px-4 py-2 bg-nature-600 text-white rounded-lg text-sm font-medium hover:bg-nature-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {pack.downloading ? (
                                                <>
                                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                                    Downloading...
                                                </>
                                            ) : (
                                                <>
                                                    <Download className="h-4 w-4" />
                                                    Download
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Offline Mode Info */}
            {!isOnline && (
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <WifiOff className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-amber-900 mb-2">You're Offline</h3>
                            <p className="text-sm text-amber-800">
                                You can still use downloaded data packs. Connect to internet to download more packs or update existing ones.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfflineDataPacks;
