import React, { useState, useEffect } from 'react';
import {
    Calculator, Sprout, FlaskConical,
    TrendingUp, Info,
    ArrowLeftRight,
    Sparkles, WifiOff, Grid3X3, Settings, Beaker, Waves
} from 'lucide-react';
import { cn } from '../lib/utils';

const CalculatorPage = () => {
    const [activeTool, setActiveTool] = useState('plant-pop'); // Default to new tool
    const [result, setResult] = useState(null);

    // Common State for Area
    const [area, setArea] = useState('');
    const [unit, setUnit] = useState('Acre');

    // 1. Plant Population State
    const [rowSpacing, setRowSpacing] = useState('');
    const [plantSpacing, setPlantSpacing] = useState('');
    const [spacingUnit, setSpacingUnit] = useState('cm'); // cm, feet, inch, meter
    const [mortality, setMortality] = useState('0'); // %

    // 2. Seed Calculator State
    const [crop, setCrop] = useState('Wheat');

    // 3. Fertilizer Calculator State
    const [fertType, setFertType] = useState('Urea');

    // 4. Water Calculator State
    const [soilType, setSoilType] = useState('Loamy');
    const [irrigationMethod, setIrrigationMethod] = useState('Drip');
    const [temp, setTemp] = useState('Normal');

    // 5. Yield Calculator State
    const [plantHealth, setPlantHealth] = useState('Good');
    const [variety, setVariety] = useState('Hybrid');

    const tools = [
        { id: 'plant-pop', name: 'Plant Population', icon: Grid3X3, color: 'text-indigo-600', bg: 'bg-indigo-50', desc: 'Scientific plant count based on spacing' },
        { id: 'seed', name: 'Seed Rate', icon: Sprout, color: 'text-green-600', bg: 'bg-green-50', desc: 'Calculate seed quantity needed' },
        { id: 'fert', name: 'Fertilizer', icon: FlaskConical, color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Calculate bags of Urea, DAP, MOP' },
        { id: 'water', name: 'Irrigation', icon: Waves, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Water volume & pump runtime' },
        { id: 'yield', name: 'Yield Estimate', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', desc: 'Predict harvest weight (Quintals)' },
        { id: 'area', name: 'Unit Converter', icon: ArrowLeftRight, color: 'text-gray-600', bg: 'bg-gray-50', desc: 'Acre, Hectare, Bigha conversion' },
    ];

    const crops = {
        'Wheat': { seedRate: 40, spacing: '20cm x 10cm' },
        'Rice (Paddy)': { seedRate: 8, spacing: '20cm x 15cm' },
        'Cotton': { seedRate: 2, spacing: '90cm x 60cm' },
        'Maize': { seedRate: 8, spacing: '60cm x 20cm' },
        'Tomato': { seedRate: 0.1, spacing: '60cm x 45cm' },
        'Potato': { seedRate: 1200, spacing: '60cm x 20cm' },
    };

    const ferts = {
        'Urea': { n: 46, p: 0, k: 0, bagSize: 45 },
        'DAP': { n: 18, p: 46, k: 0, bagSize: 50 },
        'MOP': { n: 0, p: 0, k: 60, bagSize: 50 },
        'NPK 19-19-19': { n: 19, p: 19, k: 19, bagSize: 25 },
    };

    // Conversion Factors to Square Meters
    const areaToSqM = {
        'Acre': 4046.86,
        'Hectare': 10000,
        'Bigha (Pucca)': 2529,
        'Bigha (Kaccha)': 1600, // Approx varying
        'Gunta': 101.17,
        'Square Meter': 1,
        'Square Feet': 0.092903
    };

    // Length to Meters
    const lengthToM = {
        'cm': 0.01,
        'feet': 0.3048,
        'inch': 0.0254,
        'meter': 1
    };

    // Calculation Logic
    useEffect(() => {
        if (!area || isNaN(area)) {
            setResult(null);
            return;
        }

        const areaInSqM = parseFloat(area) * (areaToSqM[unit] || 4046.86);

        // 1. Plant Population Tool
        if (activeTool === 'plant-pop') {
            if (!rowSpacing || !plantSpacing) {
                setResult(null);
                return;
            }

            const r = parseFloat(rowSpacing) * lengthToM[spacingUnit];
            const p = parseFloat(plantSpacing) * lengthToM[spacingUnit];
            const areaPerPlant = r * p;

            if (areaPerPlant === 0) return;

            let totalPlants = areaInSqM / areaPerPlant;

            // Adjust for Mortality
            if (mortality) {
                const mortRate = parseFloat(mortality) / 100;
                totalPlants = totalPlants * (1 - mortRate);
            }

            const plantsPerAcre = totalPlants / (areaInSqM / 4046.86);

            setResult({
                main: `${Math.round(totalPlants).toLocaleString()} Plants`,
                label: 'Total Population',
                secondary: `Density: ~${Math.round(plantsPerAcre).toLocaleString()} plants/acre`
            });
        }

        // 2. Seed Tool
        else if (activeTool === 'seed') {
            const cropData = crops[crop];
            // Simple calculation based on acres
            const acres = areaInSqM / 4046.86;
            const neededWeight = (acres * cropData.seedRate).toFixed(2);

            setResult({
                main: `${neededWeight} kg`,
                label: 'Total Seeds Needed',
                secondary: cropData.spacing ? `Recomm. Spacing: ${cropData.spacing}` : null
            });
        }

        // 3. Fertilizer Tool
        else if (activeTool === 'fert') {
            const acres = areaInSqM / 4046.86;
            const fertData = ferts[fertType];
            let doseKg = 50;
            if (fertType === 'Urea') doseKg = 45;

            const totalKg = (acres * doseKg).toFixed(1);
            const bags = (totalKg / fertData.bagSize).toFixed(1);

            setResult({
                main: `${bags} Bags`,
                label: `Total ${fertType} Needed`,
                secondary: `${totalKg} kg total (${fertData.bagSize}kg bag)`
            });
        }

        // 4. Water Tool
        else if (activeTool === 'water') {
            const acres = areaInSqM / 4046.86;
            let baseWater = 25000; // liters per acre
            if (soilType === 'Sandy') baseWater *= 1.3;
            if (temp === 'Hot') baseWater *= 1.4;
            if (irrigationMethod === 'Flood') baseWater *= 2.5;

            const totalLiters = (acres * baseWater).toFixed(0);
            const pumpHours = (totalLiters / 12000).toFixed(1); // 12000L/hr pump

            setResult({
                main: `${parseInt(totalLiters).toLocaleString()} Liters`,
                label: 'Total Water Required',
                secondary: `Pump Runtime: ${pumpHours} hrs (5HP)`
            });
        }

        // 5. Yield Tool
        else if (activeTool === 'yield') {
            const acres = areaInSqM / 4046.86;
            let baseYield = 20; // Quintals
            if (crop === 'Rice (Paddy)') baseYield = 25;
            if (crop === 'Cotton') baseYield = 8;

            if (plantHealth === 'Excellent') baseYield *= 1.2;
            if (variety === 'Hybrid') baseYield *= 1.3;

            const totalYield = (acres * baseYield).toFixed(1);

            setResult({
                main: `${totalYield} Quintals`,
                label: 'Est. Harvest Yield',
                secondary: `~${(totalYield * 100).toLocaleString()} kg`
            });
        }

        // 6. Area Tool
        else if (activeTool === 'area') {
            const sqm = areaInSqM;
            setResult({
                converted: {
                    'Acre': (sqm / 4046.86).toFixed(3),
                    'Hectare': (sqm / 10000).toFixed(3),
                    'Bigha (Pucca)': (sqm / 2529).toFixed(2),
                    'Gunta': (sqm / 101.17).toFixed(1)
                }
            });
        }

    }, [activeTool, area, unit, rowSpacing, plantSpacing, spacingUnit, mortality, crop, fertType, soilType, irrigationMethod, temp, plantHealth, variety]);

    return (
        <div className="max-w-7xl mx-auto py-6 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-nature-700 rounded-2xl shadow-lg">
                    <Calculator className="h-8 w-8 text-white" />
                </div>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-black text-nature-900 tracking-tight">Scientific Calculator</h1>
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-200">
                            <WifiOff className="h-3 w-3" /> Offline Ready
                        </span>
                    </div>
                    <p className="text-gray-500 font-bold">Precision farming tools (Billion Scale Engine)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Navigation */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 px-2">Select Tool</h2>
                        <div className="space-y-3">
                            {tools.map((tool) => {
                                const Icon = tool.icon;
                                return (
                                    <button
                                        key={tool.id}
                                        onClick={() => {
                                            setActiveTool(tool.id);
                                            setResult(null);
                                        }}
                                        className={cn(
                                            "w-full text-left p-4 rounded-3xl transition-all duration-300 flex items-center gap-4 border-2 group",
                                            activeTool === tool.id
                                                ? "bg-nature-900 border-nature-900 text-white shadow-xl scale-[1.02]"
                                                : "bg-white border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-100"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-3 rounded-2xl transition-all",
                                            activeTool === tool.id ? "bg-nature-800" : tool.bg
                                        )}>
                                            <Icon className={cn("h-6 w-6", activeTool === tool.id ? "text-white" : tool.color)} />
                                        </div>
                                        <div>
                                            <p className="font-black text-lg leading-tight">{tool.name}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Input & Result Area */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <Settings className="h-6 w-6 text-gray-400" />
                            <h2 className="text-2xl font-black text-gray-900">Inputs</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* 1. Global Area Input */}
                            {activeTool !== 'area' && (
                                <>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Total Land Area</label>
                                        <input
                                            type="number"
                                            value={area}
                                            onChange={(e) => setArea(e.target.value)}
                                            placeholder="Ex: 5"
                                            className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-nature-500 rounded-3xl font-black text-2xl"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Unit</label>
                                        <select
                                            value={unit}
                                            onChange={(e) => setUnit(e.target.value)}
                                            className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-nature-500 rounded-3xl font-black text-xl appearance-none"
                                        >
                                            {Object.keys(areaToSqM).map(u => <option key={u}>{u}</option>)}
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* 2. Plant Population Specific Inputs */}
                            {activeTool === 'plant-pop' && (
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Measurement Unit</label>
                                        <select
                                            value={spacingUnit}
                                            onChange={(e) => setSpacingUnit(e.target.value)}
                                            className="w-full px-8 py-4 bg-indigo-50 border-2 border-indigo-100 focus:border-indigo-500 rounded-3xl font-bold text-lg appearance-none"
                                        >
                                            <option value="cm">Centimeters (cm)</option>
                                            <option value="feet">Feet (ft)</option>
                                            <option value="inch">Inches (in)</option>
                                            <option value="meter">Meters (m)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Mortality / Gap Rate (%)</label>
                                        <input
                                            type="number"
                                            value={mortality}
                                            onChange={(e) => setMortality(e.target.value)}
                                            placeholder="0"
                                            className="w-full px-8 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 rounded-3xl font-bold text-lg"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Row to Row Gap</label>
                                        <input
                                            type="number"
                                            value={rowSpacing}
                                            onChange={(e) => setRowSpacing(e.target.value)}
                                            placeholder={`Ex: ${spacingUnit === 'cm' ? '60' : '2'}`}
                                            className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-indigo-500 rounded-3xl font-black text-2xl"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Plant to Plant Gap</label>
                                        <input
                                            type="number"
                                            value={plantSpacing}
                                            onChange={(e) => setPlantSpacing(e.target.value)}
                                            placeholder={`Ex: ${spacingUnit === 'cm' ? '30' : '1'}`}
                                            className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-indigo-500 rounded-3xl font-black text-2xl"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* 3. Area Converter Specific Inputs */}
                            {activeTool === 'area' && (
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Amount</label>
                                        <input
                                            type="number"
                                            value={area}
                                            onChange={(e) => setArea(e.target.value)}
                                            placeholder="Enter value"
                                            className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-nature-500 rounded-3xl font-black text-2xl"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">From Unit</label>
                                        <select
                                            value={unit}
                                            onChange={(e) => setUnit(e.target.value)}
                                            className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-nature-500 rounded-3xl font-black text-xl appearance-none"
                                        >
                                            {Object.keys(areaToSqM).map(u => <option key={u}>{u}</option>)}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* 4. Other Tools Inputs (Simplified) */}
                            {['seed', 'fert', 'water', 'yield'].includes(activeTool) && (
                                <div className="md:col-span-2 pt-6 border-t border-gray-100">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {activeTool === 'seed' && (
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Select Crop</label>
                                                <select value={crop} onChange={e => setCrop(e.target.value)} className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold appearance-none border border-gray-200">
                                                    {Object.keys(crops).map(c => <option key={c}>{c}</option>)}
                                                </select>
                                            </div>
                                        )}
                                        {activeTool === 'fert' && (
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Fertilizer Type</label>
                                                <select value={fertType} onChange={e => setFertType(e.target.value)} className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold appearance-none border border-gray-200">
                                                    {Object.keys(ferts).map(f => <option key={f}>{f}</option>)}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Result Card */}
                    {result ? (
                        <div className="bg-nature-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="absolute top-0 right-0 p-8 opacity-20"><Sparkles className="h-32 w-32" /></div>

                            {activeTool !== 'area' ? (
                                <div className="relative z-10">
                                    <p className="text-nature-400 font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <Beaker className="h-5 w-5" /> Calculated Result
                                    </p>
                                    <h3 className="text-6xl font-black mb-4 tracking-tighter">{result.main}</h3>
                                    <p className="text-xl font-bold text-gray-300 opacity-90">{result.label}</p>
                                    {result.secondary && (
                                        <div className="mt-8 pt-8 border-t border-nature-800 flex items-center gap-3 text-nature-300 font-bold">
                                            <Info className="h-5 w-5" /> {result.secondary}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="relative z-10">
                                    <p className="text-nature-400 font-black uppercase tracking-[0.2em] mb-8">Conversions</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                        {Object.entries(result.converted).map(([u, v]) => (
                                            <div key={u}>
                                                <p className="text-nature-500 text-[10px] font-black uppercase">{u}</p>
                                                <p className="text-2xl font-black">{v}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-[40px] p-16 text-center border-2 border-dashed border-gray-200">
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Ready to Calculate</h3>
                            <p className="text-gray-400 font-bold">Enter your metrics above.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalculatorPage;
