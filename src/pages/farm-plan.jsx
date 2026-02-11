import React, { useState, useEffect } from 'react';
import {
    Plus, Calendar, TrendingUp, Sprout, Droplets,
    Sparkles, X, Check, AlertTriangle, Info, Clock,
    DollarSign, MapPin, ClipboardList, PenTool, Layout, WifiOff
} from 'lucide-react';
import { cn } from '../lib/utils';

const FarmPlanPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const manager = (await import('../lib/offline-data-manager')).default;
            const saved = await manager.getPendingSync();
            const planActivities = saved.filter(i => i.type === 'farm_plan');
            if (planActivities.length > 0) {
                setActivities(planActivities.map(i => i.data));
            } else {
                // Default mock data if empty
                setActivities([
                    {
                        id: 1,
                        title: 'Plant Wheat Seeds',
                        icon: '🌱',
                        category: 'planting',
                        status: 'Completed',
                        date: '2026-02-01',
                        crop: 'Wheat',
                        field: 'North Field (5 acres)',
                        cost: 5000,
                        notes: 'Used certified seeds from local cooperative',
                        bgColor: 'bg-green-50',
                        iconBg: 'bg-green-100'
                    }
                ]);
            }
        };
        loadData();
    }, []);

    const [newActivity, setNewActivity] = useState({
        title: '',
        category: 'planting',
        date: '',
        crop: '',
        field: '',
        cost: '',
        notes: ''
    });

    const aiRecommendations = [
        {
            id: 1,
            icon: <Check className="h-5 w-5 text-green-600" />,
            type: 'success',
            title: 'Best day for fertilizer application: Tomorrow',
            description: 'Temperature will be 24-28°C with low humidity - ideal for nutrient absorption.',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        },
        {
            id: 2,
            icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
            type: 'warning',
            title: 'Postpone spraying scheduled for Feb 15',
            description: 'Wind speed expected to exceed 15 km/h. Reschedule for better results.',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200'
        },
        {
            id: 3,
            icon: <Info className="h-5 w-5 text-blue-600" />,
            type: 'info',
            title: 'Delay irrigation - rainfall expected',
            description: '15mm rainfall forecast on Feb 12-13. Save water by delaying irrigation.',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        }
    ];

    const upcomingActivities = activities.filter(a => a.status === 'Upcoming').length;
    const totalPlannedCost = activities.reduce((sum, a) => sum + Number(a.cost), 0);
    const totalSpent = activities.filter(a => a.status === 'Completed').reduce((sum, a) => sum + Number(a.cost), 0);

    const handleAddActivity = async (e) => {
        e.preventDefault();
        const activity = {
            ...newActivity,
            id: Date.now(),
            status: 'Upcoming',
            icon: newActivity.category === 'planting' ? '🌱' : newActivity.category === 'fertilizing' ? '📈' : '💧',
            bgColor: newActivity.category === 'planting' ? 'bg-green-50' : newActivity.category === 'fertilizing' ? 'bg-amber-50' : 'bg-blue-50',
            iconBg: newActivity.category === 'planting' ? 'bg-green-100' : newActivity.category === 'fertilizing' ? 'bg-amber-100' : 'bg-blue-100'
        };

        const manager = (await import('../lib/offline-data-manager')).default;
        await manager.saveUserData('farm_plan', { id: activity.id, data: activity });

        setActivities([activity, ...activities]);
        setShowModal(false);
        setNewActivity({
            title: '',
            category: 'planting',
            date: '',
            crop: '',
            field: '',
            cost: '',
            notes: ''
        });
    };

    return (
        <div className="max-w-7xl mx-auto py-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-black text-nature-900 tracking-tight">Farm Planner</h1>
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-200">
                            <WifiOff className="h-3 w-3" /> Works Offline
                        </span>
                    </div>
                    <p className="text-gray-600 font-medium">Plan your season, track tasks, and optimize with AI</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-nature-700 text-white rounded-2xl font-black text-lg hover:bg-nature-800 transition-all shadow-xl active:scale-95"
                >
                    <Plus className="h-6 w-6" />
                    Schedule Activity
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex items-center justify-between group hover:shadow-lg transition-all">
                    <div>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Upcoming</p>
                        <p className="text-4xl font-black text-nature-900">{upcomingActivities}</p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-2xl group-hover:scale-110 transition-transform">
                        <Calendar className="h-8 w-8 text-amber-600" />
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex items-center justify-between group hover:shadow-lg transition-all">
                    <div>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Budget</p>
                        <p className="text-4xl font-black text-nature-900">₹{totalPlannedCost.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex items-center justify-between group hover:shadow-lg transition-all">
                    <div>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Spent</p>
                        <p className="text-4xl font-black text-nature-900">₹{totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-2xl group-hover:scale-110 transition-transform">
                        <Check className="h-8 w-8 text-green-600" />
                    </div>
                </div>
            </div>

            {/* AI Advisor Panel */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-100 rounded-xl">
                        <Sparkles className="h-6 w-6 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">AI Farming Advisor</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {aiRecommendations.map((rec) => (
                        <div key={rec.id} className={cn(
                            "p-5 rounded-2xl border bg-white shadow-sm flex items-start gap-4 hover:shadow-md transition-all",
                            rec.borderColor
                        )}>
                            <div className="mt-1">{rec.icon}</div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm mb-1">{rec.title}</h3>
                                <p className="text-xs text-gray-600 leading-relaxed font-medium">{rec.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Timeline Section */}
            <div className="space-y-4">
                <h2 className="text-2xl font-black text-gray-900 px-2">Activity Timeline</h2>
                <div className="grid grid-cols-1 gap-4">
                    {activities.map((activity) => (
                        <div key={activity.id} className={cn(
                            "group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-center gap-6",
                            activity.status === 'Completed' ? "border-l-8 border-l-green-600" : "border-l-8 border-l-amber-500"
                        )}>
                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner",
                                activity.iconBg
                            )}>
                                {activity.icon}
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{activity.title}</h3>
                                    <div className="flex gap-2 justify-center">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                            {activity.category}
                                        </span>
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                            activity.status === 'Completed' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                        )}>
                                            {activity.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium text-gray-500">
                                    <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {activity.date}</div>
                                    <div className="flex items-center gap-1"><Sprout className="h-4 w-4" /> {activity.crop}</div>
                                    <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {activity.field}</div>
                                </div>
                                {activity.aiSuggestion && (
                                    <div className={cn(
                                        "mt-4 p-4 rounded-xl flex items-start gap-3 border",
                                        activity.aiWarning ? "bg-red-50 border-red-100 text-red-900" : "bg-purple-50 border-purple-100 text-purple-900"
                                    )}>
                                        <Sparkles className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs font-bold italic">AI Advice: {activity.aiSuggestion}</p>
                                    </div>
                                )}
                            </div>

                            <div className="text-right flex flex-col items-center md:items-end">
                                <div className="text-2xl font-black text-nature-700">₹{Number(activity.cost).toLocaleString()}</div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estimated Cost</div>
                                <button className="mt-4 text-sm font-bold text-nature-600 hover:text-nature-700 flex items-center gap-1 transition-colors">
                                    Edit Details <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Schedule Activity Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900">Schedule Activity</h2>
                                <p className="text-gray-500 font-medium">Add a new task to your farm calendar</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-3 hover:bg-gray-100 rounded-full transition-all active:scale-90"
                            >
                                <X className="h-7 w-7 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <form className="space-y-6" onSubmit={handleAddActivity}>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <PenTool className="h-4 w-4" /> Activity Title
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Harvest Wheat Phase 1"
                                        value={newActivity.title}
                                        onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-nature-500 focus:bg-white transition-all font-bold text-lg"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Layout className="h-4 w-4" /> Category
                                        </label>
                                        <select
                                            value={newActivity.category}
                                            onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-nature-500 focus:bg-white transition-all font-bold"
                                        >
                                            <option value="planting">Planting</option>
                                            <option value="fertilizing">Fertilizing</option>
                                            <option value="irrigation">Irrigation</option>
                                            <option value="spraying">Spraying</option>
                                            <option value="harvesting">Harvesting</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Clock className="h-4 w-4" /> Schedule Date
                                        </label>
                                        <input
                                            required
                                            type="date"
                                            value={newActivity.date}
                                            onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-nature-500 focus:bg-white transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Sprout className="h-4 w-4" /> Target Crop
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. Wheat"
                                            value={newActivity.crop}
                                            onChange={(e) => setNewActivity({ ...newActivity, crop: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-nature-500 focus:bg-white transition-all font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <DollarSign className="h-4 w-4" /> Estimated Cost (₹)
                                        </label>
                                        <input
                                            required
                                            type="number"
                                            placeholder="e.g. 2500"
                                            value={newActivity.cost}
                                            onChange={(e) => setNewActivity({ ...newActivity, cost: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-nature-500 focus:bg-white transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin className="h-4 w-4" /> Field Location
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. North Field"
                                        value={newActivity.field}
                                        onChange={(e) => setNewActivity({ ...newActivity, field: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-nature-500 focus:bg-white transition-all font-bold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <ClipboardList className="h-4 w-4" /> Notes & Custom Advice
                                    </label>
                                    <textarea
                                        rows="3"
                                        placeholder="Add any specific instructions..."
                                        value={newActivity.notes}
                                        onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-nature-500 focus:bg-white transition-all font-bold resize-none"
                                    ></textarea>
                                </div>

                                <div className="flex gap-4 pt-6 sticky bottom-0 bg-white">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-8 py-5 border-2 border-gray-100 text-gray-600 rounded-3xl font-black text-lg hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] px-8 py-5 bg-nature-700 text-white rounded-3xl font-black text-lg hover:bg-nature-800 transition-all shadow-xl shadow-nature-700/20 active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <Sparkles className="h-6 w-6" />
                                        Finalize & Schedule
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ChevronRight = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6" />
    </svg>
);

export default FarmPlanPage;
