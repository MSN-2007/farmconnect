import React, { useState } from 'react';
import { Calendar, MapPin, Users, Bell, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

const EventsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Fairs', 'Workshops', 'Government', 'Exhibitions'];

    const events = [
        {
            id: 1,
            title: 'National Agricultural Fair 2025',
            description: 'Explore the latest farming technologies and connect with agriculture experts',
            category: 'Fair',
            location: 'Delhi, India',
            mode: 'Offline',
            attendees: '5000+',
            date: '2025-12-15',
            daysUntil: 42,
            icon: '📅',
            categoryColor: 'bg-green-700'
        },
        {
            id: 2,
            title: 'Organic Farming Workshop',
            description: 'Learn organic farming techniques and certification process',
            category: 'Workshop',
            location: 'Punjab',
            mode: 'Offline',
            attendees: '150+',
            date: '2025-11-20',
            daysUntil: 17,
            icon: '📅',
            categoryColor: 'bg-green-700'
        },
        {
            id: 3,
            title: 'PM-KISAN Scheme Info Session',
            description: 'Government scheme information and enrollment assistance',
            category: 'Government',
            location: 'Online',
            mode: 'Online',
            attendees: '1000+',
            date: '2025-11-10',
            daysUntil: 7,
            icon: '📅',
            categoryColor: 'bg-green-700'
        },
        {
            id: 4,
            title: 'Kisan Mela 2025',
            description: 'Agricultural exhibition with live demonstrations and product launches',
            category: 'Exhibition',
            location: 'Ludhiana, Punjab',
            mode: 'Offline',
            attendees: '3000+',
            date: '2025-12-01',
            daysUntil: 28,
            icon: '📅',
            categoryColor: 'bg-green-700'
        },
        {
            id: 5,
            title: 'Soil Health Management Workshop',
            description: 'Expert-led session on soil testing, nutrient management, and composting',
            category: 'Workshop',
            location: 'Haryana',
            mode: 'Offline',
            attendees: '200+',
            date: '2025-11-25',
            daysUntil: 22,
            icon: '📅',
            categoryColor: 'bg-green-700'
        },
        {
            id: 6,
            title: 'Digital Agriculture Summit',
            description: 'Learn about AI, IoT, and precision farming technologies',
            category: 'Fair',
            location: 'Bangalore, India',
            mode: 'Hybrid',
            attendees: '2000+',
            date: '2025-12-10',
            daysUntil: 37,
            icon: '📅',
            categoryColor: 'bg-green-700'
        }
    ];

    const filteredEvents = selectedCategory === 'All'
        ? events
        : events.filter(event => event.category === selectedCategory);

    return (
        <div className="max-w-7xl mx-auto py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-nature-900">Events & Announcements</h1>
                    <span className="text-2xl">🎉</span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-nature-700 text-white rounded-lg font-medium hover:bg-nature-800 transition-colors">
                    <Plus className="h-4 w-4" />
                    Create Event
                </button>
            </div>

            {/* Events List */}
            <div className="space-y-4 mb-8">
                {filteredEvents.map((event) => (
                    <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            {/* Left Section */}
                            <div className="flex gap-4 flex-1">
                                {/* Calendar Icon */}
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                        <Calendar className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>

                                {/* Event Details */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                    <p className="text-gray-600 mb-3 leading-relaxed">{event.description}</p>

                                    {/* Event Meta */}
                                    <div className="flex items-center gap-4 flex-wrap">
                                        {/* Category Badge */}
                                        <span className="px-3 py-1 bg-green-700 text-white rounded-full text-xs font-bold">
                                            {event.category}
                                        </span>

                                        {/* Location */}
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            <span>{event.location}</span>
                                        </div>

                                        {/* Attendees */}
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Users className="h-4 w-4 text-gray-400" />
                                            <span>{event.attendees} attending</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Section - Days Until & Actions */}
                            <div className="flex flex-col items-end gap-3 ml-4">
                                {/* Days Until */}
                                <div className="text-right">
                                    <div className="text-4xl font-bold text-gray-900">{event.daysUntil}</div>
                                    <div className="text-xs text-gray-500">days until</div>
                                    <div className="text-sm text-gray-600 mt-1">{event.date}</div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                        <Bell className="h-4 w-4" />
                                        Remind Me
                                    </button>
                                    <button className="px-4 py-2 bg-nature-700 text-white rounded-lg text-sm font-bold hover:bg-nature-800 transition-colors">
                                        Learn More
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Browse by Category */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Fairs', 'Workshops', 'Government', 'Exhibitions'].map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                                "p-6 bg-white rounded-xl border border-gray-200 text-center font-semibold text-gray-900 hover:border-nature-300 hover:bg-nature-50 transition-all",
                                selectedCategory === category && "border-nature-500 bg-nature-50"
                            )}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Empty State */}
            {filteredEvents.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No events found</h3>
                    <p className="text-gray-500">Try selecting a different category</p>
                </div>
            )}
        </div>
    );
};

export default EventsPage;
