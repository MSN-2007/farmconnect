import React, { useState } from 'react';
import { X, Camera, MapPin, Phone, IndianRupee, Package } from 'lucide-react';
import { cn } from '../lib/utils';

const SimpleSellForm = ({ onClose, onSubmit }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        crop: '',
        quantity: '',
        price: '',
        location: '',
        phone: '',
        image: null
    });

    const commonCrops = [
        { name: 'Wheat', emoji: '🌾', unit: 'Quintal' },
        { name: 'Rice', emoji: '🌾', unit: 'Quintal' },
        { name: 'Tomatoes', emoji: '🍅', unit: 'kg' },
        { name: 'Potatoes', emoji: '🥔', unit: 'kg' },
        { name: 'Onions', emoji: '🧅', unit: 'kg' },
        { name: 'Cotton', emoji: '☁️', unit: 'Quintal' },
        { name: 'Maize', emoji: '🌽', unit: 'Quintal' },
        { name: 'Sugarcane', emoji: '🎋', unit: 'Ton' }
    ];

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (formData.crop && formData.quantity && formData.price && formData.phone) {
            onSubmit(formData);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-nature-600 to-green-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Sell Your Crop</h2>
                            <p className="text-green-100 text-sm">Simple & Quick</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    {/* Progress */}
                    <div className="flex gap-2 mt-4">
                        {[1, 2, 3].map(s => (
                            <div
                                key={s}
                                className={cn(
                                    "h-1 flex-1 rounded-full transition-all",
                                    s <= step ? "bg-white" : "bg-white/30"
                                )}
                            />
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {/* Step 1: Select Crop */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">What do you want to sell?</h3>
                                <p className="text-gray-600">Select your crop</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {commonCrops.map(crop => (
                                    <button
                                        key={crop.name}
                                        onClick={() => {
                                            setFormData({ ...formData, crop: crop.name });
                                            setStep(2);
                                        }}
                                        className={cn(
                                            "p-4 rounded-xl border-2 transition-all",
                                            formData.crop === crop.name
                                                ? "border-nature-600 bg-nature-50"
                                                : "border-gray-200 hover:border-nature-300 hover:bg-gray-50"
                                        )}
                                    >
                                        <div className="text-4xl mb-2">{crop.emoji}</div>
                                        <div className="font-semibold text-gray-900">{crop.name}</div>
                                        <div className="text-xs text-gray-500">per {crop.unit}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Quantity & Price */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <div className="text-4xl mb-2">
                                    {commonCrops.find(c => c.name === formData.crop)?.emoji}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    How much {formData.crop}?
                                </h3>
                                <p className="text-gray-600">Enter quantity and price</p>
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Package className="h-4 w-4" />
                                    Quantity Available
                                </label>
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    placeholder="100"
                                    className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    In {commonCrops.find(c => c.name === formData.crop)?.unit}
                                </p>
                            </div>

                            {/* Price */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <IndianRupee className="h-4 w-4" />
                                    Price per {commonCrops.find(c => c.name === formData.crop)?.unit}
                                </label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="2000"
                                    className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Market price: ₹2,150 (approx)
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    disabled={!formData.quantity || !formData.price}
                                    className="flex-1 px-6 py-3 bg-nature-600 text-white rounded-xl font-semibold hover:bg-nature-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Contact & Photo */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Almost Done!</h3>
                                <p className="text-gray-600">Add your contact details</p>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Phone className="h-4 w-4" />
                                    Your Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+91 98765 43210"
                                    className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Buyers will call you on this number
                                </p>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <MapPin className="h-4 w-4" />
                                    Your Location
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Village, District"
                                    className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent"
                                />
                            </div>

                            {/* Photo (Optional) */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Camera className="h-4 w-4" />
                                    Add Photo (Optional)
                                </label>
                                <label className="block cursor-pointer">
                                    <div className={cn(
                                        "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
                                        formData.image
                                            ? "border-nature-300 bg-nature-50"
                                            : "border-gray-300 hover:border-nature-400 hover:bg-gray-50"
                                    )}>
                                        {formData.image ? (
                                            <div className="space-y-2">
                                                <img src={formData.image} alt="Preview" className="h-32 w-32 object-cover rounded-lg mx-auto" />
                                                <p className="text-sm text-nature-600 font-medium">Photo added ✓</p>
                                            </div>
                                        ) : (
                                            <>
                                                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-gray-600">Tap to add photo</p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(2)}
                                    className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!formData.phone}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-nature-600 to-green-600 text-white rounded-xl font-semibold hover:from-nature-700 hover:to-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                >
                                    Publish Listing
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SimpleSellForm;
