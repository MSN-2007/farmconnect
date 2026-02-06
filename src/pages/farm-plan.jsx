import React, { useState } from 'react';
import { Plus, Calendar, TrendingUp, Sprout, Droplets, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

const FarmPlanPage = () => {
    const [activities] = useState([
        {
            id: 1,
            title: 'Plant Wheat Seeds',
            icon: '🌱',
            category: 'planting',
            status: 'Completed',
            date: '2025-11-20',
            crop: 'Wheat',
            field: 'North Field (5 acres)',
            cost: 5000,
            notes: 'Used certified seeds from local cooperative',
            bgColor: 'bg-green-50',
            iconBg: 'bg-green-100'
        },
        {
            id: 2,
            title: 'Apply NPK Fertilizer',
            icon: '📈',
            category: 'fertilizing',
            status: 'Upcoming',
            date: '2025-11-25',
            crop: 'Wheat',
            field: 'North Field (5 acres)',
            cost: 8000,
            notes: 'Basal dose - 120kg NPK 10:26:26',
            aiSuggestion: 'Weather optimal for application. Temperature 22-28°C expected.',
            bgColor: 'bg-amber-50',
            iconBg: 'bg-amber-100'
        },
        {
            id: 3,
            title: 'Spray Herbicide',
            icon: '💧',
            category: 'spraying',
            status: 'Upcoming',
            date: '2025-11-27',
            crop: 'Wheat',
            field: 'North Field (5 acres)',
            cost: 2000,
            notes: 'Pre-emergence weed control',
            aiSuggestion: 'High wind forecast. Consider postponing by 2 days.',
            aiWarning: true,
            bgColor: 'bg-blue-50',
            iconBg: 'bg-blue-100'
        },
        {
            id: 4,
            title: 'Irrigation Round 1',
            icon: '💧',
            category: 'irrigation',
            status: 'Upcoming',
            date: '2025-12-05',
            crop: 'Wheat',
            field: 'North Field (5 acres)',
            cost: 1500,
            notes: 'Critical growth stage',
            aiSuggestion: 'Delay irrigation - rainfall (15mm) expected on Dec 3-4.',
            bgColor: 'bg-cyan-50',
            iconBg: 'bg-cyan-100'
        }
    ]);

    const aiRecommendations = [
        {
            id: 1,
            icon: '✅',
            type: 'success',
            title: 'Best day for fertilizer application: Tomorrow',
            description: 'Temperature will be 24-28°C with low humidity - ideal for nutrient absorption.',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        },
        {
            id: 2,
            icon: '⚠️',
            type: 'warning',
            title: 'Postpone spraying scheduled for Nov 27',
            description: 'Wind speed expected to exceed 15 km/h. Reschedule to Nov 29 for better results.',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200'
        },
        {
            id: 3,
            icon: '💧',
            type: 'info',
            title: 'Delay irrigation - rainfall expected',
            description: '15mm rainfall forecast on Dec 3-4. Save water and money by delaying irrigation by 3 days.',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        }
    ];

    const upcomingActivities = activities.filter(a => a.status === 'Upcoming').length;
    const plannedInvestment = activities.reduce((sum, a) => sum + a.cost, 0);
    const totalSpent = activities.filter(a => a.status === 'Completed').reduce((sum, a) => sum + a.cost, 0);

    return (
        <div className="max-w-7xl mx-auto py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-nature-900">Farm Planner</h1>
                    <span className="text-2xl">🌾</span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-nature-700 text-white rounded-lg font-medium hover:bg-nature-800 transition-colors">
                    <Plus className="h-4 w-4" />
                    Schedule Activity
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Upcoming Activities */}
                <div className="bg-amber-50 rounded-xl shadow-sm border border-amber-100 p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-amber-700 font-medium mb-1">Upcoming Activities</p>
                            <p className="text-4xl font-bold text-amber-900">{upcomingActivities}</p>
                        </div>
                        <div className="p-3 bg-amber-100 rounded-lg">
                            <Calendar className="h-6 w-6 text-amber-600" />
                        </div>
                    </div>
                </div>

                {/* Planned Investment */}
                <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium mb-1">Planned Investment</p>
                            <p className="text-4xl font-bold text-gray-900">₹{plannedInvestment.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-gray-600" />
                        </div>
                    </div>
                </div>

                {/* Total Spent */}
                <div className="bg-green-50 rounded-xl shadow-sm border border-green-100 p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-green-700 font-medium mb-1">Total Spent</p>
                            <p className="text-4xl font-bold text-green-900">₹{totalSpent.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Farming Recommendations */}
            <div className="bg-amber-50 rounded-xl shadow-sm border-2 border-amber-200 p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-amber-600" />
                    <h2 className="text-xl font-bold text-gray-900">AI Farming Recommendations</h2>
                </div>
                <div className="space-y-3">
                    {aiRecommendations.map((rec) => (
                        <div key={rec.id} className={cn(
                            "p-4 rounded-lg border",
                            rec.bgColor,
                            rec.borderColor
                        )}>
                            <div className="flex items-start gap-3">
                                <span className="text-xl">{rec.icon}</span>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900 mb-1">{rec.title}</p>
                                    <p className="text-sm text-gray-700">{rec.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Activity Timeline */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Activity Timeline</h2>
                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div key={activity.id} className={cn(
                            "rounded-xl shadow-sm border p-6",
                            activity.bgColor,
                            activity.status === 'Completed' ? 'border-green-200' : 'border-gray-200'
                        )}>
                            <div className="flex items-start justify-between mb-4">
                                {/* Left Section */}
                                <div className="flex gap-4 flex-1">
                                    {/* Icon */}
                                    <div className={cn(
                                        "w-12 h-12 rounded-lg flex items-center justify-center text-2xl",
                                        activity.iconBg
                                    )}>
                                        {activity.icon}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{activity.title}</h3>

                                        {/* Status Badges */}
                                        <div className="flex gap-2 mb-3">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-xs font-bold",
                                                activity.status === 'Completed'
                                                    ? "bg-green-700 text-white"
                                                    : "bg-amber-100 text-amber-700"
                                            )}>
                                                {activity.category}
                                            </span>
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-xs font-bold",
                                                activity.status === 'Completed'
                                                    ? "bg-green-700 text-white"
                                                    : "bg-gray-100 text-gray-700"
                                            )}>
                                                {activity.status}
                                            </span>
                                        </div>

                                        {/* Activity Info */}
                                        <div className="text-sm text-gray-700 space-y-1">
                                            <p><span className="font-semibold">Date:</span> {activity.date} • <span className="font-semibold">Crop:</span> {activity.crop} • <span className="font-semibold">Field:</span> {activity.field}</p>
                                            <p className="text-gray-600">{activity.notes}</p>
                                        </div>

                                        {/* AI Suggestion */}
                                        {activity.aiSuggestion && (
                                            <div className={cn(
                                                "mt-3 p-3 rounded-lg flex items-start gap-2",
                                                activity.aiWarning ? "bg-orange-100 border border-orange-200" : "bg-purple-100 border border-purple-200"
                                            )}>
                                                <Sparkles className={cn(
                                                    "h-4 w-4 mt-0.5 flex-shrink-0",
                                                    activity.aiWarning ? "text-orange-600" : "text-purple-600"
                                                )} />
                                                <p className={cn(
                                                    "text-sm font-medium",
                                                    activity.aiWarning ? "text-orange-900" : "text-purple-900"
                                                )}>
                                                    AI Suggestion: {activity.aiSuggestion}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Section - Cost */}
                                <div className="text-right ml-4">
                                    <p className="text-2xl font-bold text-gray-900">₹{activity.cost.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Offline Mode Notice */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-start gap-3">
                <div className="text-gray-500">☀️</div>
                <p className="text-sm text-gray-700">
                    <span className="font-semibold">Offline Mode:</span> All activities and data are stored locally. Changes will sync automatically when you're back online.
                </p>
            </div>
        </div>
    );
};

export default FarmPlanPage;
