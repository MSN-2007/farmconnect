import React, { useState } from 'react';
import { Video, MessageSquare, Calendar, Pill, Star, X } from 'lucide-react';
import { cn } from '../lib/utils';

const VetPage = () => {
    const [activeTab, setActiveTab] = useState('Experts');
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedExpert, setSelectedExpert] = useState(null);
    const [bookingData, setBookingData] = useState({
        date: '',
        type: 'Video Call',
        notes: ''
    });

    const [experts, setExperts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchExperts = async () => {
            const { smartFetch } = await import('../lib/api-config');
            try {
                const data = await smartFetch('experts');
                if (data) setExperts(data);
            } catch (err) {
                console.error("Failed to fetch experts:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchExperts();
    }, []);

    const handleBookConsultation = (expert) => {
        setSelectedExpert(expert);
        setShowBookingModal(true);
    };

    const handleConfirmBooking = () => {
        // Handle booking confirmation
        // Booking confirmed - could send to backend here
        setShowBookingModal(false);
        setBookingData({ date: '', type: 'Video Call', notes: '' });
    };

    return (
        <div className="max-w-7xl mx-auto py-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <h1 className="text-3xl font-bold text-nature-900">Vet & Agri Doctor</h1>
                <span className="text-2xl">🩺</span>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {['Experts', 'My Appointments', 'Prescriptions'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                            activeTab === tab
                                ? "bg-amber-100 text-amber-900 border border-amber-200"
                                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'Experts' && (
                <>
                    {/* Get Expert Consultation Section */}
                    <div className="bg-amber-50 rounded-xl shadow-sm border border-amber-100 p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Get Expert Consultation</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Connect with verified agriculture experts for crop disease, soil health, and pest management advice
                        </p>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-nature-700 text-white rounded-lg font-medium hover:bg-nature-800 transition-colors">
                                <Video className="h-4 w-4" />
                                Video Consultation
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                <MessageSquare className="h-4 w-4" />
                                Chat Consultation
                            </button>
                        </div>
                    </div>

                    {/* Experts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {experts.map((expert) => (
                            <div key={expert.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                <div className="flex gap-4">
                                    {/* Avatar */}
                                    <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0", expert.color)}>
                                        {expert.initials}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{expert.name}</h3>
                                                <p className="text-sm text-gray-600">{expert.qualification}</p>
                                            </div>
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-xs font-bold",
                                                expert.status === 'Available'
                                                    ? "bg-green-700 text-white"
                                                    : "bg-amber-100 text-amber-700"
                                            )}>
                                                {expert.status}
                                            </span>
                                        </div>

                                        {/* Specialization */}
                                        <div className="flex items-center gap-1 text-sm text-amber-700 mb-2">
                                            <span>🏆</span>
                                            <span>{expert.specialization} • {expert.experience}</span>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1 mb-3">
                                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                            <span className="text-sm font-bold text-gray-900">
                                                {expert.rating} ({expert.consultations} consultations)
                                            </span>
                                        </div>

                                        {/* Languages */}
                                        <div className="flex gap-2 mb-4">
                                            {expert.languages.map((lang) => (
                                                <span key={lang} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                                    {lang}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleBookConsultation(expert)}
                                                disabled={expert.status === 'Busy'}
                                                className={cn(
                                                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold transition-colors",
                                                    expert.status === 'Available'
                                                        ? "bg-nature-700 text-white hover:bg-nature-800"
                                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                )}
                                            >
                                                <Calendar className="h-4 w-4" />
                                                Book Consultation
                                            </button>
                                            <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                                View Profile
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {activeTab === 'My Appointments' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-20 text-center">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No appointments yet</h3>
                    <p className="text-gray-500">Book a consultation with an expert to get started</p>
                </div>
            )}

            {activeTab === 'Prescriptions' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-20 text-center">
                    <Pill className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No prescriptions yet</h3>
                    <p className="text-gray-500">Your prescriptions will appear here after consultations</p>
                </div>
            )}

            {/* Booking Modal */}
            {showBookingModal && selectedExpert && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                Book Consultation with {selectedExpert.name}
                            </h2>
                            <button
                                onClick={() => setShowBookingModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                            {/* Date & Time */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Appointment Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={bookingData.date}
                                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-green-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-500"
                                />
                            </div>

                            {/* Consultation Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Consultation Type
                                </label>
                                <select
                                    value={bookingData.type}
                                    onChange={(e) => setBookingData({ ...bookingData, type: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-500"
                                >
                                    <option>Video Call</option>
                                    <option>Chat</option>
                                    <option>Phone Call</option>
                                </select>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={bookingData.notes}
                                    onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                                    placeholder="Describe your concern..."
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-500 resize-none"
                                />
                            </div>

                            {/* Confirm Button */}
                            <button
                                onClick={handleConfirmBooking}
                                className="w-full py-3 bg-nature-700 text-white rounded-xl font-bold hover:bg-nature-800 transition-colors"
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VetPage;
