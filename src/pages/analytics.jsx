import React, { useState } from 'react';
import { Plus, X, TrendingUp, TrendingDown, DollarSign, Wheat, Upload, FileText, Sparkles, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

import { smartFetch } from '../lib/api-config';
import { useAuth } from '../context/auth-context'; // Import Auth

const AnalyticsPage = () => {
    const { user } = useAuth(); // Get auth user
    const [activeTab, setActiveTab] = useState('Income');
    const [showAddMetricModal, setShowAddMetricModal] = useState(false);
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reportAnalysis, setReportAnalysis] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        cropType: '',
        areaPlanted: '',
        yieldAmount: '',
        income: '',
        expenses: ''
    });

    // Fetch Metrics on Load
    useEffect(() => {
        const fetchMetrics = async () => {
            if (!user) return; // Wait for auth
            try {
                const data = await smartFetch('analytics');
                if (Array.isArray(data)) {
                    setMetrics(data);
                }
            } catch (error) {
                console.error("Failed to load metrics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, [user]);

    // Calculate totals
    const totalIncome = metrics.reduce((sum, m) => sum + (parseFloat(m.income) || 0), 0);
    const totalExpenses = metrics.reduce((sum, m) => sum + (parseFloat(m.expenses) || 0), 0);
    const netProfit = totalIncome - totalExpenses;
    const totalYield = metrics.reduce((sum, m) => sum + (parseFloat(m.yieldAmount) || 0), 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddMetric = async (e) => {
        e.preventDefault();
        try {
            const newMetricPayload = {
                ...formData,
                income: parseFloat(formData.income) || 0,
                expenses: parseFloat(formData.expenses) || 0,
                yieldAmount: parseFloat(formData.yieldAmount) || 0,
                areaPlanted: parseFloat(formData.areaPlanted) || 0
            };

            // Save to Backend
            const savedMetric = await smartFetch('analytics', newMetricPayload, 'POST');

            if (savedMetric) {
                setMetrics(prev => [...prev, savedMetric]);
                setFormData({
                    date: new Date().toISOString().split('T')[0],
                    cropType: '',
                    areaPlanted: '',
                    yieldAmount: '',
                    income: '',
                    expenses: ''
                });
                setShowAddMetricModal(false);
            }
        } catch (error) {
            alert("Failed to save metric. Please try again.");
        }
    };

    // Handle report upload and analysis
    const handleReportUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedFile(file);
            // Simulate AI analysis
            setTimeout(() => {
                const mockAnalysis = {
                    reportType: file.name.toLowerCase().includes('soil') ? 'Soil' : 'Water',
                    nutrients: {
                        nitrogen: { value: 180, status: 'Low', optimal: '280-560 kg/ha' },
                        phosphorus: { value: 25, status: 'Optimal', optimal: '22-56 kg/ha' },
                        potassium: { value: 150, status: 'Medium', optimal: '280-560 kg/ha' },
                        pH: { value: 6.8, status: 'Optimal', optimal: '6.0-7.5' },
                        organicMatter: { value: 1.8, status: 'Low', optimal: '2.5-5.0%' }
                    },
                    recommendations: [
                        {
                            crop: 'Wheat',
                            suitability: 95,
                            reason: 'Excellent pH and phosphorus levels. Nitrogen can be supplemented.',
                            actions: ['Apply 100 kg/ha Urea before sowing', 'Add compost to improve organic matter']
                        },
                        {
                            crop: 'Rice',
                            suitability: 88,
                            reason: 'Good water retention. Requires nitrogen supplementation.',
                            actions: ['Apply 120 kg/ha Urea in split doses', 'Maintain water level at 5-10 cm']
                        },
                        {
                            crop: 'Maize',
                            suitability: 82,
                            reason: 'Suitable pH. Needs potassium boost for better yield.',
                            actions: ['Apply 60 kg/ha Potash', 'Use balanced NPK fertilizer']
                        },
                        {
                            crop: 'Cotton',
                            suitability: 75,
                            reason: 'Moderate suitability. Requires soil amendment.',
                            actions: ['Improve organic matter with FYM', 'Apply micronutrients (Zinc, Boron)']
                        }
                    ],
                    deficiencies: [
                        { nutrient: 'Nitrogen', severity: 'High', solution: 'Apply 100-120 kg/ha Urea or Ammonium Sulfate' },
                        { nutrient: 'Organic Matter', severity: 'Medium', solution: 'Add 5-10 tons/ha Farm Yard Manure or compost' }
                    ]
                };
                setReportAnalysis(mockAnalysis);
            }, 1500);
        }
    };

    // Group metrics by month for Income Over Time
    const getIncomeOverTime = () => {
        const monthlyData = {};
        metrics.forEach(m => {
            const month = new Date(m.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            if (!monthlyData[month]) {
                monthlyData[month] = 0;
            }
            monthlyData[month] += m.income;
        });
        return Object.entries(monthlyData).map(([month, income]) => ({ month, income }));
    };

    // Group expenses by category
    const getExpensesByCategory = () => {
        const categories = {
            'Seeds': 0,
            'Fertilizers': 0,
            'Labor': 0,
            'Equipment': 0,
            'Other': 0
        };

        // Distribute expenses (simplified - in real app, you'd track categories)
        metrics.forEach(m => {
            const expense = m.expenses;
            categories['Seeds'] += expense * 0.25;
            categories['Fertilizers'] += expense * 0.30;
            categories['Labor'] += expense * 0.25;
            categories['Equipment'] += expense * 0.15;
            categories['Other'] += expense * 0.05;
        });

        return Object.entries(categories).map(([category, amount]) => ({ category, amount }));
    };

    // Get crop yields
    const getCropYields = () => {
        const cropData = {};
        metrics.forEach(m => {
            if (!cropData[m.cropType]) {
                cropData[m.cropType] = 0;
            }
            cropData[m.cropType] += m.yieldAmount;
        });
        return Object.entries(cropData).map(([crop, yieldAmount]) => ({ crop, yieldAmount }));
    };

    // Get crop distribution by area
    const getCropDistribution = () => {
        const cropArea = {};
        metrics.forEach(m => {
            if (!cropArea[m.cropType]) {
                cropArea[m.cropType] = 0;
            }
            cropArea[m.cropType] += m.areaPlanted;
        });
        return Object.entries(cropArea).map(([crop, area]) => ({ crop, area }));
    };

    const tabs = ['Income', 'Expenses', 'Yields', 'Crops', 'Report Analysis'];

    return (
        <div className="max-w-7xl mx-auto py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-nature-900">Analytics Dashboard</h1>
                <button
                    onClick={() => setShowAddMetricModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-nature-700 text-white rounded-lg font-medium hover:bg-nature-800 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Metric
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        Total Income
                    </div>
                    <div className="text-2xl font-bold text-green-700">₹{totalIncome.toLocaleString()}</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        Total Expenses
                    </div>
                    <div className="text-2xl font-bold text-red-700">₹{totalExpenses.toLocaleString()}</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <TrendingUp className="h-4 w-4 text-orange-600" />
                        Net Profit
                    </div>
                    <div className={cn(
                        "text-2xl font-bold",
                        netProfit >= 0 ? "text-orange-600" : "text-red-600"
                    )}>
                        ₹{netProfit.toLocaleString()}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Wheat className="h-4 w-4 text-gray-600" />
                        Total Yield
                    </div>
                    <div className="text-2xl font-bold text-gray-700">{totalYield.toLocaleString()} kg</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-gray-100 rounded-xl p-1 mb-6 flex gap-1">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                            activeTab === tab
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {/* Income Tab */}
                {activeTab === 'Income' && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Income Over Time</h2>
                        {getIncomeOverTime().length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <p className="mb-2">No income data yet</p>
                                <p className="text-sm">Add metrics to see your income trends</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Simple Bar Chart */}
                                <div className="h-64 flex items-end gap-4 border-b border-l border-gray-200 pb-2 pl-2">
                                    {getIncomeOverTime().map((data, index) => {
                                        const maxIncome = Math.max(...getIncomeOverTime().map(d => d.income));
                                        const height = (data.income / maxIncome) * 100;
                                        return (
                                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                                <div className="text-xs font-medium text-green-700">
                                                    ₹{data.income.toLocaleString()}
                                                </div>
                                                <div
                                                    className="w-full bg-green-500 rounded-t transition-all hover:bg-green-600"
                                                    style={{ height: `${height}%` }}
                                                />
                                                <div className="text-xs text-gray-600 font-medium">{data.month}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Expenses Tab */}
                {activeTab === 'Expenses' && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Expenses by Category</h2>
                        {getExpensesByCategory().filter(d => d.amount > 0).length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <p className="mb-2">No expense data yet</p>
                                <p className="text-sm">Add metrics to see your expense breakdown</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Horizontal Bar Chart */}
                                {getExpensesByCategory().filter(d => d.amount > 0).map((data, index) => {
                                    const maxExpense = Math.max(...getExpensesByCategory().map(d => d.amount));
                                    const width = (data.amount / maxExpense) * 100;
                                    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-purple-500'];
                                    return (
                                        <div key={index}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">{data.category}</span>
                                                <span className="text-sm font-bold text-gray-900">₹{data.amount.toLocaleString()}</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-8 overflow-hidden">
                                                <div
                                                    className={cn("h-full rounded-full transition-all", colors[index % colors.length])}
                                                    style={{ width: `${width}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Yields Tab */}
                {activeTab === 'Yields' && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Crop Yields</h2>
                        {getCropYields().length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <p className="mb-2">No yield data yet</p>
                                <p className="text-sm">Add metrics to see your crop yields</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Bar Chart for Yields */}
                                <div className="h-64 flex items-end gap-4 border-b border-l border-gray-200 pb-2 pl-2">
                                    {getCropYields().map((data, index) => {
                                        const maxYield = Math.max(...getCropYields().map(d => d.yieldAmount));
                                        const height = (data.yieldAmount / maxYield) * 100;
                                        return (
                                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                                <div className="text-xs font-medium text-nature-700">
                                                    {data.yieldAmount.toLocaleString()} kg
                                                </div>
                                                <div
                                                    className="w-full bg-nature-500 rounded-t transition-all hover:bg-nature-600"
                                                    style={{ height: `${height}%` }}
                                                />
                                                <div className="text-xs text-gray-600 font-medium">{data.crop}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Crops Tab */}
                {activeTab === 'Crops' && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Crop Distribution (by Area)</h2>
                        {getCropDistribution().length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <p className="mb-2">No crop data yet</p>
                                <p className="text-sm">Add metrics to see your crop distribution</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Pie Chart Representation */}
                                <div className="flex items-center justify-center">
                                    <div className="relative w-64 h-64">
                                        {getCropDistribution().map((data, index) => {
                                            const totalArea = getCropDistribution().reduce((sum, d) => sum + d.area, 0);
                                            const percentage = ((data.area / totalArea) * 100).toFixed(1);
                                            const colors = ['#16a34a', '#ca8a04', '#dc2626', '#2563eb', '#9333ea'];
                                            return (
                                                <div
                                                    key={index}
                                                    className="absolute inset-0 flex items-center justify-center"
                                                    style={{
                                                        background: `conic-gradient(${colors[index % colors.length]} ${percentage}%, transparent 0)`,
                                                        transform: `rotate(${getCropDistribution().slice(0, index).reduce((sum, d) => {
                                                            const total = getCropDistribution().reduce((s, dd) => s + dd.area, 0);
                                                            return sum + (d.area / total) * 360;
                                                        }, 0)}deg)`
                                                    }}
                                                />
                                            );
                                        })}
                                        <div className="absolute inset-8 bg-white rounded-full" />
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="flex flex-col justify-center space-y-3">
                                    {getCropDistribution().map((data, index) => {
                                        const totalArea = getCropDistribution().reduce((sum, d) => sum + d.area, 0);
                                        const percentage = ((data.area / totalArea) * 100).toFixed(1);
                                        const colors = ['bg-green-600', 'bg-yellow-600', 'bg-red-600', 'bg-blue-600', 'bg-purple-600'];
                                        return (
                                            <div key={index} className="flex items-center gap-3">
                                                <div className={cn("w-4 h-4 rounded", colors[index % colors.length])} />
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">{data.crop}</div>
                                                    <div className="text-sm text-gray-600">
                                                        {data.area} hectares ({percentage}%)
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Report Analysis Tab */}
                {activeTab === 'Report Analysis' && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Soil & Water Report Analysis</h2>

                        {!reportAnalysis ? (
                            <div className="text-center py-16">
                                <div className="max-w-md mx-auto">
                                    <div className="mb-6">
                                        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            Upload Your Soil or Water Test Report
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-6">
                                            Our AI will analyze your report and recommend the best crops for your soil, along with specific actions to improve soil health.
                                        </p>
                                    </div>

                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={handleReportUpload}
                                            className="hidden"
                                        />
                                        <div className="flex items-center justify-center gap-2 px-6 py-3 bg-nature-700 text-white rounded-lg font-medium hover:bg-nature-800 transition-colors">
                                            <Upload className="h-5 w-5" />
                                            {uploadedFile ? 'Analyzing...' : 'Upload Report (PDF/Image)'}
                                        </div>
                                    </label>

                                    {uploadedFile && (
                                        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                                            <div className="animate-spin h-4 w-4 border-2 border-nature-600 border-t-transparent rounded-full"></div>
                                            Analyzing {uploadedFile.name}...
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Report Header */}
                                <div className="bg-gradient-to-r from-nature-50 to-green-50 rounded-lg p-4 border border-nature-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Sparkles className="h-6 w-6 text-nature-600" />
                                            <div>
                                                <h3 className="font-bold text-gray-900">{reportAnalysis.reportType} Report Analysis Complete</h3>
                                                <p className="text-sm text-gray-600">AI-powered recommendations based on your soil composition</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setReportAnalysis(null);
                                                setUploadedFile(null);
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-nature-700 hover:bg-white rounded-lg transition-colors"
                                        >
                                            Upload New Report
                                        </button>
                                    </div>
                                </div>

                                {/* Nutrient Analysis */}
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-nature-600" />
                                        Nutrient Analysis
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(reportAnalysis.nutrients).map(([nutrient, data]) => (
                                            <div key={nutrient} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-semibold text-gray-700 capitalize">
                                                        {nutrient.replace(/([A-Z])/g, ' $1').trim()}
                                                    </span>
                                                    <span className={cn(
                                                        "px-2 py-1 text-xs font-bold rounded-full",
                                                        data.status === 'Optimal' && "bg-green-100 text-green-700",
                                                        data.status === 'Low' && "bg-red-100 text-red-700",
                                                        data.status === 'Medium' && "bg-yellow-100 text-yellow-700",
                                                        data.status === 'High' && "bg-blue-100 text-blue-700"
                                                    )}>
                                                        {data.status}
                                                    </span>
                                                </div>
                                                <div className="text-2xl font-bold text-gray-900 mb-1">{data.value}{nutrient === 'pH' ? '' : nutrient === 'organicMatter' ? '%' : ' kg/ha'}</div>
                                                <div className="text-xs text-gray-500">Optimal: {data.optimal}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Deficiencies */}
                                {reportAnalysis.deficiencies.length > 0 && (
                                    <div className="bg-amber-50 rounded-lg border border-amber-200 p-6">
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <AlertCircle className="h-5 w-5 text-amber-600" />
                                            Detected Deficiencies
                                        </h3>
                                        <div className="space-y-3">
                                            {reportAnalysis.deficiencies.map((def, index) => (
                                                <div key={index} className="bg-white rounded-lg p-4 border border-amber-200">
                                                    <div className="flex items-start gap-3">
                                                        <div className={cn(
                                                            "px-2 py-1 text-xs font-bold rounded-full flex-shrink-0",
                                                            def.severity === 'High' && "bg-red-100 text-red-700",
                                                            def.severity === 'Medium' && "bg-yellow-100 text-yellow-700",
                                                            def.severity === 'Low' && "bg-green-100 text-green-700"
                                                        )}>
                                                            {def.severity}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-gray-900 mb-1">{def.nutrient} Deficiency</div>
                                                            <div className="text-sm text-gray-700">
                                                                <span className="font-medium">Solution:</span> {def.solution}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Crop Recommendations */}
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-nature-600" />
                                        Recommended Crops for Your Soil
                                    </h3>
                                    <div className="space-y-4">
                                        {reportAnalysis.recommendations.map((rec, index) => (
                                            <div key={index} className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h4 className="text-lg font-bold text-gray-900">{rec.crop}</h4>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                    <div
                                                                        className={cn(
                                                                            "h-full rounded-full",
                                                                            rec.suitability >= 90 ? "bg-green-600" :
                                                                                rec.suitability >= 75 ? "bg-green-500" :
                                                                                    rec.suitability >= 60 ? "bg-yellow-500" : "bg-orange-500"
                                                                        )}
                                                                        style={{ width: `${rec.suitability}%` }}
                                                                    />
                                                                </div>
                                                                <span className={cn(
                                                                    "text-sm font-bold",
                                                                    rec.suitability >= 90 ? "text-green-700" :
                                                                        rec.suitability >= 75 ? "text-green-600" :
                                                                            rec.suitability >= 60 ? "text-yellow-600" : "text-orange-600"
                                                                )}>
                                                                    {rec.suitability}% Suitable
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-700 mb-3">{rec.reason}</p>
                                                        <div className="space-y-2">
                                                            <div className="text-sm font-semibold text-gray-900">Recommended Actions:</div>
                                                            <ul className="space-y-1">
                                                                {rec.actions.map((action, i) => (
                                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                                        <span className="text-green-600 mt-0.5">✓</span>
                                                                        {action}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Download Report Button */}
                                <div className="flex justify-center">
                                    <button className="px-6 py-3 bg-nature-700 text-white rounded-lg font-medium hover:bg-nature-800 transition-colors flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Download Detailed Report (PDF)
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Add Metric Modal */}
            {showAddMetricModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-xl font-bold text-gray-900">Add Farm Metric</h2>
                            <button
                                onClick={() => setShowAddMetricModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>

                        <form onSubmit={handleAddMetric} className="p-6 space-y-5">
                            {/* Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-white border-2 border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 transition-all"
                                />
                            </div>

                            {/* Crop Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Crop Type</label>
                                <input
                                    type="text"
                                    name="cropType"
                                    value={formData.cropType}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Wheat, Rice, Corn"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Area Planted */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Area Planted (hectares)</label>
                                <input
                                    type="number"
                                    name="areaPlanted"
                                    value={formData.areaPlanted}
                                    onChange={handleInputChange}
                                    placeholder="Enter area"
                                    step="0.01"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Yield */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Yield (kg)</label>
                                <input
                                    type="number"
                                    name="yieldAmount"
                                    value={formData.yieldAmount}
                                    onChange={handleInputChange}
                                    placeholder="Enter yield"
                                    step="0.01"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Income */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Income (₹)</label>
                                <input
                                    type="number"
                                    name="income"
                                    value={formData.income}
                                    onChange={handleInputChange}
                                    placeholder="Enter income"
                                    step="0.01"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Expenses */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Expenses (₹)</label>
                                <input
                                    type="number"
                                    name="expenses"
                                    value={formData.expenses}
                                    onChange={handleInputChange}
                                    placeholder="Enter expenses"
                                    step="0.01"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full py-3.5 bg-nature-700 text-white rounded-lg font-semibold hover:bg-nature-800 transition-colors"
                            >
                                Add Metric
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsPage;
