import React, { useState, useRef } from 'react';
import { Camera, Upload, AlertCircle, History, Download, X, Loader } from 'lucide-react';
import { cn } from '../lib/utils';

const AILensPage = () => {
    const [activeTab, setActiveTab] = useState('scan');
    const [aiModelLoaded, setAiModelLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [scanHistory, setScanHistory] = useState([]);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const handleLoadModel = () => {
        setIsLoading(true);
        // Simulate AI model loading
        setTimeout(() => {
            setAiModelLoaded(true);
            setIsLoading(false);
        }, 2000);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result);
                analyzeImage(reader.result, file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCameraCapture = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result);
                analyzeImage(reader.result, 'Camera Capture');
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeImage = (imageData, fileName) => {
        setIsLoading(true);

        // Simulate AI analysis with multiple detection types
        setTimeout(() => {
            // Randomly select detection type for demo
            const detectionTypes = ['disease', 'pest', 'weed', 'crop'];
            const randomType = detectionTypes[Math.floor(Math.random() * detectionTypes.length)];

            let mockResults = [];

            if (randomType === 'disease') {
                mockResults = [
                    {
                        type: 'Disease',
                        name: 'Early Blight',
                        confidence: 92,
                        severity: 'Moderate',
                        description: 'Fungal disease affecting tomato plants, characterized by dark spots with concentric rings on leaves.',
                        treatment: [
                            'Remove affected leaves immediately',
                            'Apply copper-based fungicide (2g/liter water)',
                            'Ensure proper spacing for air circulation',
                            'Water at the base to keep foliage dry'
                        ],
                        prevention: [
                            'Rotate crops annually',
                            'Use disease-resistant varieties',
                            'Mulch around plants to prevent soil splash',
                            'Avoid overhead watering'
                        ]
                    },
                    {
                        type: 'Disease',
                        name: 'Leaf Spot',
                        confidence: 78,
                        severity: 'Low',
                        description: 'Bacterial infection causing small brown spots on leaves.',
                        treatment: [
                            'Prune infected areas',
                            'Apply neem oil spray (5ml/liter)',
                            'Improve drainage'
                        ],
                        prevention: [
                            'Maintain plant hygiene',
                            'Avoid wetting leaves during watering'
                        ]
                    }
                ];
            } else if (randomType === 'pest') {
                mockResults = [
                    {
                        type: 'Pest',
                        name: 'Aphids',
                        confidence: 95,
                        severity: 'High',
                        description: 'Small sap-sucking insects that cluster on new growth and undersides of leaves, causing yellowing and stunted growth.',
                        treatment: [
                            'Spray with strong water jet to dislodge aphids',
                            'Apply neem oil solution (5ml/liter water)',
                            'Use insecticidal soap spray',
                            'Introduce natural predators like ladybugs'
                        ],
                        prevention: [
                            'Plant companion plants (marigolds, garlic)',
                            'Regular monitoring of plants',
                            'Maintain plant health with proper nutrition',
                            'Remove weeds that harbor aphids'
                        ]
                    },
                    {
                        type: 'Pest',
                        name: 'Whiteflies',
                        confidence: 82,
                        severity: 'Moderate',
                        description: 'Tiny white flying insects that feed on plant sap and excrete honeydew, leading to sooty mold.',
                        treatment: [
                            'Use yellow sticky traps',
                            'Apply neem oil or insecticidal soap',
                            'Remove heavily infested leaves',
                            'Use reflective mulches'
                        ],
                        prevention: [
                            'Check new plants before introducing',
                            'Use row covers for young plants',
                            'Encourage beneficial insects'
                        ]
                    }
                ];
            } else if (randomType === 'weed') {
                mockResults = [
                    {
                        type: 'Weed',
                        name: 'Crabgrass',
                        confidence: 89,
                        severity: 'Moderate',
                        description: 'Annual grass weed that spreads rapidly, competing with crops for nutrients, water, and sunlight.',
                        treatment: [
                            'Hand-pull young plants before seed formation',
                            'Apply pre-emergent herbicide in early spring',
                            'Use post-emergent herbicide for established weeds',
                            'Mulch heavily to suppress growth'
                        ],
                        prevention: [
                            'Maintain dense crop canopy',
                            'Proper irrigation to favor crops over weeds',
                            'Regular field monitoring',
                            'Crop rotation'
                        ]
                    },
                    {
                        type: 'Weed',
                        name: 'Pigweed',
                        confidence: 85,
                        severity: 'High',
                        description: 'Fast-growing broadleaf weed that can produce thousands of seeds, highly competitive with crops.',
                        treatment: [
                            'Remove before flowering and seed production',
                            'Apply selective herbicide',
                            'Cultivate soil to disrupt weed growth',
                            'Use cover crops to suppress'
                        ],
                        prevention: [
                            'Clean equipment between fields',
                            'Use weed-free seeds',
                            'Timely cultivation',
                            'Maintain soil fertility for crop competitiveness'
                        ]
                    }
                ];
            } else { // crop identification
                mockResults = [
                    {
                        type: 'Crop',
                        name: 'Wheat (Triticum aestivum)',
                        confidence: 94,
                        severity: null,
                        description: 'Healthy wheat crop at vegetative growth stage. Plants show good vigor with dark green leaves.',
                        treatment: [
                            'Current growth stage: Tillering',
                            'Recommended: Apply nitrogen fertilizer (30 kg/ha)',
                            'Monitor for rust diseases',
                            'Ensure adequate soil moisture'
                        ],
                        prevention: [
                            'Optimal planting time: October-November',
                            'Seed rate: 100 kg/ha',
                            'Row spacing: 20-22 cm',
                            'Expected harvest: March-April'
                        ]
                    }
                ];
            }

            const result = {
                id: Date.now(),
                fileName,
                imageData,
                timestamp: new Date().toLocaleString(),
                detections: mockResults
            };

            setAnalysisResult(result);
            setScanHistory(prev => [result, ...prev]);
            setIsLoading(false);
        }, 3000);
    };

    const clearAnalysis = () => {
        setUploadedImage(null);
        setAnalysisResult(null);
    };

    return (
        <div className="max-w-5xl mx-auto py-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-nature-900 mb-2">AI Lens</h1>
                <p className="text-gray-600">Scan plants to detect diseases and pests offline</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('scan')}
                    className={cn(
                        "px-6 py-3 font-medium text-sm transition-all relative",
                        activeTab === 'scan'
                            ? "text-gray-900 border-b-2 border-nature-700"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Scan Plant
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={cn(
                        "px-6 py-3 font-medium text-sm transition-all relative flex items-center gap-2",
                        activeTab === 'history'
                            ? "text-gray-900 border-b-2 border-nature-700"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    History
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                        {scanHistory.length}
                    </span>
                </button>
            </div>

            {/* Scan Plant Tab */}
            {activeTab === 'scan' && (
                <div className="space-y-6">
                    {/* AI Status */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="h-5 w-5 text-gray-600" />
                            <h2 className="text-lg font-bold text-gray-900">Offline AI Status</h2>
                        </div>

                        {!aiModelLoaded ? (
                            <button
                                onClick={handleLoadModel}
                                disabled={isLoading}
                                className="px-6 py-2.5 bg-nature-700 text-white rounded-lg font-medium hover:bg-nature-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader className="h-4 w-4 animate-spin" />
                                        Loading AI Model...
                                    </>
                                ) : (
                                    'Load AI Model'
                                )}
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 text-green-700">
                                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="font-medium">AI Model Ready</span>
                            </div>
                        )}
                    </div>

                    {/* Capture or Upload */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-2">Capture or Upload Image</h2>
                        <p className="text-gray-600 text-sm mb-6">Take a photo or upload an image of the affected plant</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Open Camera */}
                            <button
                                onClick={() => cameraInputRef.current?.click()}
                                disabled={!aiModelLoaded}
                                className="flex flex-col items-center justify-center gap-3 p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-nature-300 hover:bg-nature-50/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Camera className="h-8 w-8 text-gray-600" />
                                <span className="font-medium text-gray-900">Open Camera</span>
                            </button>
                            <input
                                ref={cameraInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleCameraCapture}
                                className="hidden"
                            />

                            {/* Upload Image */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={!aiModelLoaded}
                                className="flex flex-col items-center justify-center gap-3 p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-nature-300 hover:bg-nature-50/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Upload className="h-8 w-8 text-gray-600" />
                                <span className="font-medium text-gray-900">Upload Image</span>
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && uploadedImage && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <div className="flex flex-col items-center justify-center gap-4">
                                <Loader className="h-12 w-12 text-nature-700 animate-spin" />
                                <p className="text-gray-600 font-medium">Analyzing image with AI...</p>
                            </div>
                        </div>
                    )}

                    {/* Analysis Results */}
                    {analysisResult && !isLoading && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900">Analysis Results</h2>
                                <button
                                    onClick={clearAnalysis}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-600" />
                                </button>
                            </div>

                            {/* Uploaded Image */}
                            <div className="mb-6">
                                <img
                                    src={uploadedImage}
                                    alt="Analyzed plant"
                                    className="w-full max-h-80 object-contain rounded-lg border border-gray-200"
                                />
                            </div>

                            {/* Detections */}
                            <div className="space-y-4">
                                {analysisResult.detections.map((detection, index) => (
                                    <div key={index} className="border border-gray-200 rounded-xl p-5">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={cn(
                                                        "text-xs px-2.5 py-1 rounded-full font-bold",
                                                        detection.type === 'Disease' && "bg-red-100 text-red-700",
                                                        detection.type === 'Pest' && "bg-orange-100 text-orange-700",
                                                        detection.type === 'Weed' && "bg-yellow-100 text-yellow-700",
                                                        detection.type === 'Crop' && "bg-green-100 text-green-700"
                                                    )}>
                                                        {detection.type}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                    {detection.name}
                                                </h3>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm text-gray-600">
                                                        Confidence: <span className="font-bold text-nature-700">{detection.confidence}%</span>
                                                    </span>
                                                    {detection.severity && (
                                                        <span className={cn(
                                                            "text-xs px-2.5 py-1 rounded-full font-medium",
                                                            detection.severity === 'High' && "bg-red-100 text-red-700",
                                                            detection.severity === 'Moderate' && "bg-orange-100 text-orange-700",
                                                            detection.severity === 'Low' && "bg-yellow-100 text-yellow-700"
                                                        )}>
                                                            {detection.severity} Severity
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-gray-700 mb-4 leading-relaxed">{detection.description}</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className={cn(
                                                "rounded-lg p-4",
                                                detection.type === 'Crop' ? "bg-blue-50" : "bg-red-50"
                                            )}>
                                                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                                    <span className={cn(
                                                        "h-1.5 w-1.5 rounded-full",
                                                        detection.type === 'Crop' ? "bg-blue-500" : "bg-red-500"
                                                    )} />
                                                    {detection.type === 'Crop' ? 'Growing Info' : 'Treatment'}
                                                </h4>
                                                <ul className="space-y-1.5">
                                                    {detection.treatment.map((step, i) => (
                                                        <li key={i} className="text-sm text-gray-700 flex gap-2">
                                                            <span className={cn(
                                                                "font-bold",
                                                                detection.type === 'Crop' ? "text-blue-500" : "text-red-500"
                                                            )}>•</span>
                                                            {step}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="bg-green-50 rounded-lg p-4">
                                                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                                    <span className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                                                    {detection.type === 'Crop' ? 'Best Practices' : 'Prevention'}
                                                </h4>
                                                <ul className="space-y-1.5">
                                                    {detection.prevention.map((step, i) => (
                                                        <li key={i} className="text-sm text-gray-700 flex gap-2">
                                                            <span className="text-green-500 font-bold">•</span>
                                                            {step}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Scan History</h2>

                    {scanHistory.length === 0 ? (
                        <div className="text-center py-12">
                            <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No scans yet</p>
                            <p className="text-gray-400 text-sm">Your scan history will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {scanHistory.map((scan) => (
                                <div key={scan.id} className="border border-gray-200 rounded-xl p-4 hover:border-nature-300 transition-colors">
                                    <div className="flex gap-4">
                                        <img
                                            src={scan.imageData}
                                            alt={scan.fileName}
                                            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 mb-1">{scan.fileName}</h3>
                                            <p className="text-sm text-gray-500 mb-2">{scan.timestamp}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {scan.detections.map((detection, i) => (
                                                    <span key={i} className="text-xs bg-nature-100 text-nature-700 px-2.5 py-1 rounded-full font-medium">
                                                        {detection.name} ({detection.confidence}%)
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AILensPage;
