import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MarketPricesWidget = () => {
    const [prices, setPrices] = useState([]);

    // Generate dynamic prices
    useEffect(() => {
        const generatePrices = () => {
            const basePrices = {
                'Wheat': 2150,
                'Rice': 3200,
                'Cotton': 6800,
                'Maize': 1850
            };

            const crops = ['Wheat', 'Rice', 'Cotton'];
            const newPrices = crops.map(crop => {
                const basePrice = basePrices[crop];
                const variation = (Math.random() - 0.5) * 200;
                const price = Math.round(basePrice + variation);
                const trend = Math.random() > 0.5 ? 'up' : 'down';
                const change = (Math.random() * 10).toFixed(1) + '%';

                return {
                    crop,
                    price: price.toLocaleString(),
                    trend,
                    change
                };
            });

            setPrices(newPrices);
        };

        generatePrices();
        // Update prices every 30 seconds
        const interval = setInterval(generatePrices, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 h-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Market Prices</h3>
            <div className="space-y-4">
                {prices.map((item) => (
                    <div key={item.crop} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors px-2 -mx-2 rounded-lg">
                        <span className="font-medium text-gray-700">{item.crop}</span>
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-gray-900">₹{item.price}</span>
                            {item.trend === 'up' ? (
                                <div className="flex items-center text-green-500 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    {item.change || '5.2%'}
                                </div>
                            ) : (
                                <div className="flex items-center text-red-500 text-xs font-medium bg-red-50 px-2 py-1 rounded-full">
                                    <TrendingDown className="h-3 w-3 mr-1" />
                                    {item.change}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketPricesWidget;
