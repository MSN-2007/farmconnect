import React, { useState, useEffect, useMemo } from 'react';
import {
    Calendar, MapPin, Users, Bell, Plus,
    Globe, Laptop, Trees, Carrot, Wheat,
    ArrowRight, Sparkles, Filter, Search,
    Clock, Tag, Share2, Bookmark, CheckCircle2,
    CalendarDays, Award, Zap
} from 'lucide-react';
import { cn } from '../lib/utils';

const EventsPage = () => {
    const [selectedMode, setSelectedMode] = useState('All'); // All, Online, Offline
    const [selectedScale, setSelectedScale] = useState('All'); // All, National, International
    const [selectedType, setSelectedType] = useState('All'); // All, Fruits, Vegetables, Grains, Tech
    const [searchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Dynamic Event Data (Simulating an auto-updating feed)
    const [events, setEvents] = useState([
        {
            id: 1,
            title: 'Global Fruit Logistics Summit 2026',
            description: 'The world\'s leading trade fair for the international fruit and vegetable industry.',
            type: 'Fruits',
            scale: 'International',
            mode: 'Offline',
            location: 'Berlin, Germany',
            date: '2026-03-12',
            time: '09:00 AM',
            attendees: '12,500+',
            organizer: 'Fresh Produce Global',
            image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=400',
            price: 'Free for Farmers',
            tags: ['Export', 'Logistics', 'Trade']
        },
        {
            id: 2,
            title: 'National Pulse & Grain Conclave',
            description: 'A dedicated session for Indian pulse growers to discuss MSP and export potential.',
            type: 'Grains',
            scale: 'National',
            mode: 'Offline',
            location: 'New Delhi, India',
            date: '2026-02-25',
            time: '10:30 AM',
            attendees: '4,200+',
            organizer: 'AgriMinistry India',
            image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400',
            price: '₹500',
            tags: ['MSP', 'Government', 'Pulses']
        },
        {
            id: 3,
            title: 'Hydroponics for Beginners (Masterclass)',
            description: 'Learn how to grow exotic vegetables in small spaces using water-based systems.',
            type: 'Vegetables',
            scale: 'International',
            mode: 'Online',
            location: 'Zoom/Global',
            date: '2026-02-15',
            time: '04:00 PM',
            attendees: '850+',
            organizer: 'Ag-Tech Institute',
            image: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=400',
            price: 'Free',
            tags: ['Hydroponics', 'Modern Farming', 'Tech']
        },
        {
            id: 4,
            title: 'Agri-Tech Startup Expo',
            description: 'Showcasing the latest drones, IoT sensors, and AI tools for precision farming.',
            type: 'Tech',
            scale: 'National',
            mode: 'Online',
            location: 'Virtual Platform',
            date: '2026-03-05',
            time: '11:00 AM',
            attendees: '3,000+',
            organizer: 'Digital India Agri',
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400',
            price: 'Free',
            tags: ['AI', 'Drones', 'IoT']
        },
        {
            id: 5,
            title: 'Sustainable Mango Farming 2026',
            description: 'Workshop on high-density mango plantation and organic pest control.',
            type: 'Fruits',
            scale: 'National',
            mode: 'Offline',
            location: 'Ratnagiri, MH',
            date: '2026-04-10',
            time: '08:00 AM',
            attendees: '1,200+',
            organizer: 'Fruit Growers Association',
            image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400',
            price: '₹200',
            tags: ['Mango', 'Sustainability', 'Pest Control']
        }
    ]);

    // Simulating Automatic Updates (Every 10 seconds, calculate "Days to Go")
    const now = new Date();

    const calculateDaysLeft = (dateStr) => {
        const eventDate = new Date(dateStr);
        const diffTime = eventDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Simulate a network fetch
        setTimeout(() => setIsRefreshing(false), 1500);
    };

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const matchesMode = selectedMode === 'All' || event.mode === selectedMode;
            const matchesScale = selectedScale === 'All' || event.scale === selectedScale;
            const matchesType = selectedType === 'All' || event.type === selectedType;
            const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesMode && matchesScale && matchesType && matchesSearch;
        });
    }, [selectedMode, selectedScale, selectedType, searchQuery, events]);

    return (
        <div className="max-w-7xl mx-auto py-8 space-y-8 animate-in fade-in duration-700">
            {/* Super Premium Header */}
            <div className="relative p-12 rounded-[48px] bg-gradient-to-br from-nature-900 via-green-950 to-black text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <CalendarDays className="w-[300px] h-[300px] -rotate-12" />
                </div>

                <div className="relative z-10 space-y-6 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                        <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Global Agri-Feed</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none">
                        Agri Events <br />
                        <span className="text-nature-400">Discovery Hub</span>
                    </h1>
                    <p className="text-lg font-bold text-nature-100/70 leading-relaxed">
                        Join 25,000+ farmers in national and international events.
                        Stay ahead with workshops, trade fairs, and specialized masterclasses.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <div className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                            <Users className="h-5 w-5 text-nature-400" />
                            <span className="font-bold">Next Event in 8 Days</span>
                        </div>
                        <button
                            onClick={handleRefresh}
                            className={cn(
                                "flex items-center gap-2 bg-nature-500 hover:bg-nature-400 text-black px-6 py-3 rounded-2xl font-black transition-all active:scale-95",
                                isRefreshing && "animate-pulse"
                            )}
                        >
                            <Clock className={cn("h-5 w-5", isRefreshing && "animate-spin")} />
                            {isRefreshing ? "Syncing..." : "Sync Events"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Smart Filters Bar */}
            <div className="sticky top-4 z-40 bg-white/80 backdrop-blur-xl border border-gray-100 shadow-lg rounded-[32px] p-6 flex flex-col lg:flex-row items-center gap-6">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-nature-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search events, topics, or organizers..."
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-nature-500 rounded-2xl font-bold text-sm transition-all outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto no-scrollbar pb-2 lg:pb-0">
                    <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
                        {['All', 'Online', 'Offline'].map(mode => (
                            <button
                                key={mode}
                                onClick={() => setSelectedMode(mode)}
                                className={cn(
                                    "px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                    selectedMode === mode ? "bg-nature-900 text-white shadow-md" : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>

                    <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
                        {['All', 'National', 'International'].map(scale => (
                            <button
                                key={scale}
                                onClick={() => setSelectedScale(scale)}
                                className={cn(
                                    "px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                    selectedScale === scale ? "bg-nature-900 text-white shadow-md" : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                {scale}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Specialized Category Pills */}
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {[
                    { id: 'All', name: 'Explore All', icon: Globe },
                    { id: 'Fruits', name: 'Fruits', icon: Trees },
                    { id: 'Vegetables', name: 'Vegetables', icon: Carrot },
                    { id: 'Grains', name: 'Grains & Seeds', icon: Wheat },
                    { id: 'Tech', name: 'Digital & Tech', icon: Laptop }
                ].map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedType(cat.id)}
                        className={cn(
                            "flex items-center gap-3 px-8 py-5 rounded-[28px] border-2 transition-all whitespace-nowrap group",
                            selectedType === cat.id
                                ? "bg-nature-100 border-nature-600 text-nature-900 scale-105"
                                : "bg-white border-gray-100 text-gray-500 hover:border-gray-300"
                        )}
                    >
                        <cat.icon className={cn("h-6 w-6 group-hover:scale-125 transition-transform", selectedType === cat.id ? "text-nature-700" : "text-gray-400")} />
                        <span className="font-black text-sm uppercase tracking-widest">{cat.name}</span>
                    </button>
                ))}
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event) => {
                    const daysLeft = calculateDaysLeft(event.date);
                    return (
                        <div key={event.id} className="group flex flex-col bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
                            {/* Image & Badge overlay */}
                            <div className="relative h-64 overflow-hidden">
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                <div className="absolute top-6 left-6 flex flex-col gap-2">
                                    <span className="px-4 py-2 bg-nature-500/90 backdrop-blur-md text-black text-[10px] font-black rounded-full uppercase tracking-widest">
                                        {event.type}
                                    </span>
                                    <span className="px-4 py-2 bg-white/20 backdrop-blur-md text-white text-[10px] font-black rounded-full uppercase tracking-widest border border-white/20">
                                        {event.scale}
                                    </span>
                                </div>

                                <div className="absolute top-6 right-6">
                                    <button className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white hover:bg-white hover:text-black transition-all">
                                        <Bookmark className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                                    <div className="text-white">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-nature-400">Date</p>
                                        <p className="font-black text-xl">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="text-[40px] font-black text-white leading-none">{daysLeft}</p>
                                        <p className="text-[10px] font-black uppercase text-nature-400">Days To Go</p>
                                    </div>
                                </div>
                            </div>

                            {/* Event Details Content */}
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <Users className="h-3 w-3" />
                                        {event.attendees} Registered
                                    </div>
                                    <div className={cn(
                                        "flex items-center gap-1 text-[10px] font-black uppercase px-3 py-1 rounded-full",
                                        event.mode === 'Online' ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                                    )}>
                                        {event.mode === 'Online' ? <Laptop className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                                        {event.mode}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-gray-900 mb-4 leading-tight group-hover:text-nature-700 transition-colors">
                                    {event.title}
                                </h3>

                                <p className="text-gray-500 font-bold text-sm leading-relaxed mb-6 line-clamp-2">
                                    {event.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {event.tags.map(tag => (
                                        <span key={tag} className="text-[10px] font-black text-gray-400 border border-gray-100 px-3 py-1 rounded-lg">#{tag}</span>
                                    ))}
                                </div>

                                <div className="mt-auto space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-gray-100">
                                                <Award className="h-5 w-5 text-nature-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Organizer</p>
                                                <p className="text-sm font-black text-gray-900">{event.organizer}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fee</p>
                                            <p className="text-sm font-black text-nature-700">{event.price}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button className="flex-1 py-4 bg-nature-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-xl shadow-nature-900/10">
                                            Register Now <ArrowRight className="h-4 w-4" />
                                        </button>
                                        <button className="p-4 bg-white border-2 border-gray-100 text-gray-400 rounded-2xl hover:border-nature-500 hover:text-nature-500 transition-all">
                                            <Share2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredEvents.length === 0 && (
                <div className="text-center py-32 bg-gray-50 rounded-[48px] border-4 border-dashed border-gray-100 animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                        <Calendar className="h-10 w-10 text-gray-200" />
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-2">No matches found</h3>
                    <p className="text-gray-400 font-bold max-w-sm mx-auto mb-8">
                        Try adjusting your filters or search terms to find relevant farming events.
                    </p>
                    <button
                        onClick={() => { setSelectedMode('All'); setSelectedScale('All'); setSelectedType('All'); setSearchQuery(''); }}
                        className="px-10 py-5 bg-nature-900 text-white rounded-3xl font-black hover:bg-black transition-all shadow-xl"
                    >
                        Reset All Filters
                    </button>
                </div>
            )}

            {/* Bottom Info Section */}
            <div className="bg-nature-100 rounded-[48px] p-12 border border-nature-200 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-white rounded-[32px] flex items-center justify-center shadow-sm">
                        <Bell className="h-10 w-10 text-nature-600 animate-bounce" />
                    </div>
                    <div>
                        <h4 className="text-3xl font-black text-gray-900 tracking-tight">Never miss a deadline</h4>
                        <p className="text-gray-600 font-bold text-lg">Subscribe to get instant alerts for regional farming government scheme events.</p>
                    </div>
                </div>
                <button className="px-12 py-6 bg-nature-900 text-white rounded-3xl font-black text-lg hover:bg-black transition-all shadow-2xl active:scale-95">
                    Enable Notifications
                </button>
            </div>

        </div>
    );
};

export default EventsPage;
