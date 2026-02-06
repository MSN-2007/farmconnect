import React from 'react';
import { Newspaper, TrendingUp, Sprout, AlertTriangle, Award } from 'lucide-react';

const DailyNewsWidget = () => {
    const news = [
        {
            id: 1,
            category: 'Market',
            icon: TrendingUp,
            title: 'Wheat Prices Surge by 12% in Major Mandis',
            description: 'Strong demand and reduced supply push wheat prices to ₹2,450/quintal across Punjab and Haryana markets.',
            time: '2 hours ago',
            color: 'green'
        },
        {
            id: 2,
            category: 'Agriculture',
            icon: Sprout,
            title: 'New Organic Farming Subsidy Announced',
            description: 'Government announces 50% subsidy on organic fertilizers and bio-pesticides for registered farmers.',
            time: '5 hours ago',
            color: 'blue'
        },
        {
            id: 3,
            category: 'Alert',
            icon: AlertTriangle,
            title: 'Heavy Rainfall Warning for Next 3 Days',
            description: 'IMD issues orange alert for Maharashtra and Karnataka. Farmers advised to postpone harvesting activities.',
            time: '6 hours ago',
            color: 'amber'
        },
        {
            id: 4,
            category: 'Technology',
            icon: Award,
            title: 'Drone Subsidy Program Extended Until March',
            description: 'Ministry of Agriculture extends drone subsidy scheme. Farmers can now get up to 75% subsidy on agricultural drones.',
            time: '1 day ago',
            color: 'purple'
        },
        {
            id: 5,
            category: 'Market',
            icon: TrendingUp,
            title: 'Cotton Export Demand Increases',
            description: 'International buyers show strong interest in Indian cotton. Prices expected to remain stable at ₹7,200/quintal.',
            time: '1 day ago',
            color: 'green'
        },
        {
            id: 6,
            category: 'Agriculture',
            icon: Sprout,
            title: 'Free Soil Testing Camps This Weekend',
            description: 'Agriculture department organizing free soil testing camps in 50+ districts. Register online or visit nearest Krishi Vigyan Kendra.',
            time: '2 days ago',
            color: 'blue'
        }
    ];

    const getColorClasses = (color) => {
        const colors = {
            green: 'bg-green-100 text-green-700 border-green-200',
            blue: 'bg-blue-100 text-blue-700 border-blue-200',
            amber: 'bg-amber-100 text-amber-700 border-amber-200',
            purple: 'bg-purple-100 text-purple-700 border-purple-200'
        };
        return colors[color] || colors.green;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Newspaper className="h-6 w-6 text-nature-600" />
                <h2 className="text-xl font-bold text-gray-900">Daily Agriculture News</h2>
                <span className="ml-auto text-xs text-gray-500">Updated today</span>
            </div>

            <div className="space-y-4">
                {news.map((item) => (
                    <div
                        key={item.id}
                        className="group p-4 rounded-lg border border-gray-100 hover:border-nature-300 hover:shadow-md transition-all cursor-pointer"
                    >
                        <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${getColorClasses(item.color)}`}>
                                <item.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getColorClasses(item.color)}`}>
                                        {item.category}
                                    </span>
                                    <span className="text-xs text-gray-500">{item.time}</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-nature-700 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 py-2 text-sm font-medium text-nature-700 hover:text-nature-800 hover:bg-nature-50 rounded-lg transition-colors">
                View All News →
            </button>
        </div>
    );
};

export default DailyNewsWidget;
