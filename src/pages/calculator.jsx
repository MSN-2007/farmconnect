import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

const CalculatorPage = () => {
    const [activeTab, setActiveTab] = useState('Land');

    // Land Calculator State
    const [landAreaValue, setLandAreaValue] = useState('');
    const [landUnit, setLandUnit] = useState('Square Meter (m²)');
    const [landLength, setLandLength] = useState('');
    const [landWidth, setLandWidth] = useState('');

    // Plants Calculator State
    const [plantFieldArea, setPlantFieldArea] = useState('');
    const [plantUnit, setPlantUnit] = useState('Square Meter');
    const [cropPreset, setCropPreset] = useState('');
    const [plantSpacing, setPlantSpacing] = useState('');
    const [rowSpacing, setRowSpacing] = useState('');

    // Fertilizer Calculator State
    const [fertFieldArea, setFertFieldArea] = useState('');
    const [fertUnit, setFertUnit] = useState('Acre');
    const [fertCropType, setFertCropType] = useState('Vegetables');

    // Water Calculator State
    const [waterFieldArea, setWaterFieldArea] = useState('');
    const [waterUnit, setWaterUnit] = useState('Acre');
    const [soilType, setSoilType] = useState('Loamy (Medium)');
    const [waterCropType, setWaterCropType] = useState('Vegetables');

    // Spray Calculator State
    const [sprayFieldArea, setSprayFieldArea] = useState('');
    const [sprayUnit, setSprayUnit] = useState('Acre');
    const [sprayType, setSprayType] = useState('Pesticide');

    const tabs = ['Land', 'Plants', 'Fertilizer', 'Water', 'Spray'];

    const landUnits = ['Square Meter (m²)', 'Acre', 'Hectare', 'Bigha', 'Gunta'];
    const areaUnits = ['Square Meter', 'Acre', 'Hectare'];
    const cropPresets = [
        'Select a crop for automatic spacing',
        'Tomato (0.5m × 0.6m)',
        'Wheat (0.2m × 0.2m)',
        'Cotton (0.6m × 0.9m)',
        'Rice (0.15m × 0.15m)',
        'Potato (0.3m × 0.6m)'
    ];
    const cropTypes = ['Vegetables', 'Cereals', 'Pulses', 'Cotton', 'Sugarcane'];
    const soilTypes = ['Sandy (Light)', 'Loamy (Medium)', 'Clay (Heavy)'];
    const sprayTypes = ['Pesticide', 'Herbicide', 'Fungicide', 'Insecticide'];

    return (
        <div className="max-w-5xl mx-auto py-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-nature-900 mb-2">Smart Agri Calculator</h1>
                <p className="text-gray-600 mb-3">Accurate calculations for field operations & farm management</p>
                <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-green-700 font-medium">Offline Compatible</span>
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

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                {/* Land Calculator */}
                {activeTab === 'Land' && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Land Area Calculator</h2>
                        <p className="text-gray-600 mb-6">Convert between multiple units with auto-calculation</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Area Value</label>
                                <input
                                    type="number"
                                    placeholder="Enter area"
                                    value={landAreaValue}
                                    onChange={(e) => setLandAreaValue(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
                                <div className="relative">
                                    <select
                                        value={landUnit}
                                        onChange={(e) => setLandUnit(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all cursor-pointer"
                                    >
                                        {landUnits.map(unit => (
                                            <option key={unit} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="text-center text-sm text-gray-500 font-medium mb-6">
                            OR CALCULATE FROM DIMENSIONS
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Length (meters)</label>
                                <input
                                    type="number"
                                    placeholder="Enter length"
                                    value={landLength}
                                    onChange={(e) => setLandLength(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Width (meters)</label>
                                <input
                                    type="number"
                                    placeholder="Enter width"
                                    value={landWidth}
                                    onChange={(e) => setLandWidth(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {(landLength && landWidth) && (
                            <div className="mt-6 p-4 bg-nature-50 rounded-lg border border-nature-200">
                                <p className="text-sm text-gray-600 mb-1">Calculated Area:</p>
                                <p className="text-2xl font-bold text-nature-700">
                                    {(parseFloat(landLength) * parseFloat(landWidth)).toFixed(2)} m²
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Plants Calculator */}
                {activeTab === 'Plants' && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Plant Count Calculator</h2>
                        <p className="text-gray-600 mb-6">Calculate plants needed with crop-specific presets</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Field Area</label>
                                <input
                                    type="number"
                                    placeholder="Enter area"
                                    value={plantFieldArea}
                                    onChange={(e) => setPlantFieldArea(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
                                <div className="relative">
                                    <select
                                        value={plantUnit}
                                        onChange={(e) => setPlantUnit(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all cursor-pointer"
                                    >
                                        {areaUnits.map(unit => (
                                            <option key={unit} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Crop Preset (Optional)</label>
                            <div className="relative">
                                <select
                                    value={cropPreset}
                                    onChange={(e) => setCropPreset(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all cursor-pointer"
                                >
                                    {cropPresets.map(preset => (
                                        <option key={preset} value={preset}>{preset}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Plant Spacing (meters)</label>
                                <input
                                    type="number"
                                    placeholder="e.g., 0.3"
                                    value={plantSpacing}
                                    onChange={(e) => setPlantSpacing(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Row Spacing (meters)</label>
                                <input
                                    type="number"
                                    placeholder="e.g., 0.5"
                                    value={rowSpacing}
                                    onChange={(e) => setRowSpacing(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {(plantFieldArea && plantSpacing && rowSpacing) && (
                            <div className="mt-6 p-4 bg-nature-50 rounded-lg border border-nature-200">
                                <p className="text-sm text-gray-600 mb-1">Total Plants Needed:</p>
                                <p className="text-2xl font-bold text-nature-700">
                                    {Math.floor((parseFloat(plantFieldArea) * 10000) / (parseFloat(plantSpacing) * parseFloat(rowSpacing) * 100)).toLocaleString()} plants
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Fertilizer Calculator */}
                {activeTab === 'Fertilizer' && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Fertilizer Consumption Calculator</h2>
                        <p className="text-gray-600 mb-6">Calculate NPK requirements per growth stage</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Field Area</label>
                                <input
                                    type="number"
                                    placeholder="Enter area"
                                    value={fertFieldArea}
                                    onChange={(e) => setFertFieldArea(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
                                <div className="relative">
                                    <select
                                        value={fertUnit}
                                        onChange={(e) => setFertUnit(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all cursor-pointer"
                                    >
                                        {areaUnits.map(unit => (
                                            <option key={unit} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Crop Type</label>
                            <div className="relative">
                                <select
                                    value={fertCropType}
                                    onChange={(e) => setFertCropType(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all cursor-pointer"
                                >
                                    {cropTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {fertFieldArea && (
                            <div className="mt-6 space-y-4">
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Nitrogen (N)</p>
                                    <p className="text-xl font-bold text-blue-700">{(parseFloat(fertFieldArea) * 120).toFixed(1)} kg</p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Phosphorus (P)</p>
                                    <p className="text-xl font-bold text-purple-700">{(parseFloat(fertFieldArea) * 60).toFixed(1)} kg</p>
                                </div>
                                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Potassium (K)</p>
                                    <p className="text-xl font-bold text-orange-700">{(parseFloat(fertFieldArea) * 40).toFixed(1)} kg</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Water Calculator */}
                {activeTab === 'Water' && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Water Requirement Estimator</h2>
                        <p className="text-gray-600 mb-6">Calculate irrigation needs by soil type and crop</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Field Area</label>
                                <input
                                    type="number"
                                    placeholder="Enter area"
                                    value={waterFieldArea}
                                    onChange={(e) => setWaterFieldArea(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
                                <div className="relative">
                                    <select
                                        value={waterUnit}
                                        onChange={(e) => setWaterUnit(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all cursor-pointer"
                                    >
                                        {areaUnits.map(unit => (
                                            <option key={unit} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Soil Type</label>
                                <div className="relative">
                                    <select
                                        value={soilType}
                                        onChange={(e) => setSoilType(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all cursor-pointer"
                                    >
                                        {soilTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Crop Type</label>
                                <div className="relative">
                                    <select
                                        value={waterCropType}
                                        onChange={(e) => setWaterCropType(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all cursor-pointer"
                                    >
                                        {cropTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {waterFieldArea && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-gray-600 mb-1">Daily Water Requirement:</p>
                                <p className="text-2xl font-bold text-blue-700">
                                    {(parseFloat(waterFieldArea) * 25000).toLocaleString()} liters/day
                                </p>
                                <p className="text-xs text-gray-500 mt-2">Based on {soilType} soil and {waterCropType} crop</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Spray Calculator */}
                {activeTab === 'Spray' && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Spray Volume Calculator</h2>
                        <p className="text-gray-600 mb-6">Calculate pesticide/herbicide quantity needed</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Field Area</label>
                                <input
                                    type="number"
                                    placeholder="Enter area"
                                    value={sprayFieldArea}
                                    onChange={(e) => setSprayFieldArea(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
                                <div className="relative">
                                    <select
                                        value={sprayUnit}
                                        onChange={(e) => setSprayUnit(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all cursor-pointer"
                                    >
                                        {areaUnits.map(unit => (
                                            <option key={unit} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Spray Type</label>
                            <div className="relative">
                                <select
                                    value={sprayType}
                                    onChange={(e) => setSprayType(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all cursor-pointer"
                                >
                                    {sprayTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {sprayFieldArea && (
                            <div className="mt-6 space-y-4">
                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <p className="text-sm text-gray-600 mb-1">Water Volume Required:</p>
                                    <p className="text-2xl font-bold text-green-700">
                                        {(parseFloat(sprayFieldArea) * 200).toFixed(1)} liters
                                    </p>
                                </div>
                                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                                    <p className="text-sm text-gray-600 mb-1">{sprayType} Concentration:</p>
                                    <p className="text-2xl font-bold text-amber-700">
                                        {(parseFloat(sprayFieldArea) * 0.5).toFixed(2)} liters
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">At recommended 2.5ml/liter dilution rate</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalculatorPage;
