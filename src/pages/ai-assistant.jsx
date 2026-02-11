import React, { useState, useRef, useEffect } from 'react';
import {
    Mic, Send, Volume2, MessageSquare, Sparkles, X, Loader,
    Zap, Brain, Shield, Info, ArrowRight, User, Bot,
    Cloud, Sprout, TrendingUp, AlertTriangle, Languages,
    Headphones, PlayCircle, StopCircle, Droplets, Leaf, Database, Footprints
} from 'lucide-react';
import { cn } from '../lib/utils';
import { getAIResponse } from '../lib/ai-gateway';

const AIAssistantPage = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'ai',
            text: 'Namaste! I am your Advanced Farming Assistant. I am currently connected to multiple AI models (Gemini, GPT-4, Llama-3) with automatic failover support. \n\nHow can I empower your farm today?',
            timestamp: new Date(),
            sender: 'Kisan AI (Multi-Key Active)'
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeMode, setActiveMode] = useState('chat'); // 'chat', 'voice'
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    // Advanced Local Knowledge Base
    const KNOWLEDGE_BASE = {
        weather: {
            keywords: ['weather', 'rain', 'temperature', 'forecast', 'climate', 'monsoon', 'storm', 'wind', 'humidity'],
            response: "Current Forecast for Punjab/Haryana: Partly cloudy with 15% humidity. High: 28°C, Low: 22°C. \nNext 7 days: Dry spell continuing. \nAdvice: Ideal for intensive fertilizer application and weeding. Check soil moisture before next irrigation as evaporation rates are slightly higher today."
        },
        prices: {
            keywords: ['price', 'rate', 'mandi', 'market', 'cost', 'wheat', 'rice', 'paddy', 'cotton', 'mustard', 'potato', 'onion'],
            response: "Latest Mandi Rates (Feb 8, 2026):\n• Wheat: ₹2,450/q (Bullish trend due to low arrivals)\n• Basmati: ₹3,800/q (Stable demand)\n• Cotton: ₹7,100/q (Volatile due to global trade)\n• Mustard: ₹5,400/q (Firming up)\nStrategic Advice: If you have dry storage, hold Wheat stocks. We expect price to hit ₹2,600 by early March based on current procurement trends."
        },
        pests: {
            keywords: ['pest', 'insect', 'disease', 'fungus', 'leaf', 'yellow', 'bug', 'worm', 'control', 'rust', 'aphid', 'blight', 'whitefly'],
            response: "Agricultural Specialist Alert:\n1. Yellow Rust (Wheat): Spray Propiconazole 25% EC (200ml/acre) in 200L water. Repeat after 15 days if yellow streaks persist.\n2. Whitefly (Cotton/Veg): Apply Neem Oil (5ml/L) or Acetamiprid 20% SP (100g/acre).\n3. Early Blight (Potato): Use Mancozeb 75% WP (600g/acre) at first sign of spots."
        },
        fertilizer: {
            keywords: ['fertilizer', 'urea', 'dap', 'npk', 'soil', 'nutrient', 'nitrogen', 'potash', 'manure', 'compost', 'zinc', 'boron'],
            response: "Precision Fertilizer Plan:\n• Top Dressing: Apply 45kg Urea/acre for Wheat at 2nd irrigation (65-70 days).\n• Deficiency Correction: If leaves show purple edges, apply 50kg MOP (Potash). \n• Micro-nutrients: For high yield, spray Zinc Sulphate (0.5%) mixed with 1kg Urea in 100L water per acre."
        },
        seeds: {
            keywords: ['seed', 'variety', 'sow', 'wheat variety', 'best seed', 'hybrid', 'bt cotton', 'certified'],
            response: "Top Performing Varieties for 2026:\n1. Wheat: DBW 187 (Karan Vandana) - High heat tolerance, yield up to 30 quintals/acre.\n2. Mustard: Pusa Karishma - Low erucic acid, high oil content.\n3. Paddy: PR 126 for short duration (125 days).\nAlways treat seeds with Beejamrut or Thiram (3g/kg) to prevent soil-borne diseases."
        },
        subsidy: {
            keywords: ['subsidy', 'scheme', 'paisa', 'money', 'government', 'loan', 'pm kisan', 'claim', 'registration'],
            response: "Government Financial Support:\n• PM-Kisan: 16th installment verified for March disbursement.\n• Micro-Irrigation: Up to 80% subsidy for Drip/Sprinkler systems for small farmers.\n• Machinery: 50% subsidy on Super Seeder and Mulchers under CRM scheme.\nAction Required: Update your e-KYC on the PM-Kisan portal to avoid payment delays."
        },
        irrigation: {
            keywords: ['irrigation', 'water', 'drip', 'sprinkler', 'canal', 'borewell', 'tubewell', 'timing', 'moisture'],
            response: "Water Management Guide:\n• Critical Stages: For Wheat, Ensure irrigation at 'Crown Root Initiation' (21 days) and 'Flowering' (80 days).\n• Efficiency: Afternoon irrigation leads to 30% water loss via evaporation. Water early morning or late evening.\n• Tech: Switch to Drip for vegetables to save 60% water and increase yield by 20%."
        },
        livestock: {
            keywords: ['cow', 'buffalo', 'milk', 'fodder', 'cattle', 'veterinary', 'animal', 'feed', 'yield', 'disease'],
            response: "Livestock Management:\n• Milk Yield: Add 50g Mineral Mixture daily to cattle feed to improve calcium levels and increase yield.\n• Summer Care: Ensure cross-ventilation in sheds. Provide cold water 4-5 times a day.\n• Fodder: Mix Berseem with dry straw (Bhusa) in 1:3 ratio for balanced nutrition."
        },
        organic: {
            keywords: ['organic', 'natural', 'chemical free', 'jeevamrut', 'cow dung', 'pest repellant', 'compost', 'vermicompost'],
            response: "Organic Farming Protocol:\n• Natural Fertilizer: Prepare Jeevamrut (Cow dung + Urine + Jaggery + Pulse flour). Apply through irrigation water.\n• Pest Control: Use 'Dashparni Arka' or Neem leaf extract for broad-spectrum pest control.\n• Certification: Register with NPOP for export-grade organic certification and 40% premium pricing."
        },
        storage: {
            keywords: ['storage', 'warehouse', 'cold store', 'grain', 'moisture level', 'rat', 'safety', 'bags'],
            response: "Post-Harvest Strategy:\n• Moisture Check: Dry grains to <12% moisture before bagging to prevent fungal growth.\n• Storage: Use galvanized steel bins or plastic silos instead of jute bags to prevent rodent damage.\n• Pests: Use Aluminum Phosphide tablets (only in air-tight silos) or Neem leaves in domestic storage."
        }
    };

    const smartResponse = async (query) => {
        const lower = query.toLowerCase();

        // 1. First, attempt to get response from the Real AI Gateway (with key rotation)
        const liveResponse = await getAIResponse(query);
        if (liveResponse) {
            console.log(`AI Gateway Response (Provider: ${liveResponse.provider}):`, liveResponse.text);
            return liveResponse.text;
        }

        // 2. Fallback to Local Knowledge Base if API is offline or keys missing
        for (const category in KNOWLEDGE_BASE) {
            if (KNOWLEDGE_BASE[category].keywords.some(k => lower.includes(k))) {
                console.log("Fallback to Local Knowledge Base.");
                return KNOWLEDGE_BASE[category].response;
            }
        }

        // Default or complex response
        if (lower.length < 5) {
            console.log("Default short query response.");
            return "I'm listening. Please ask a specific farming question like 'What is the wheat price today?' or 'How to control aphids?'";
        }

        console.log("Default complex query response.");
        return "I've analyzed your question about '" + query + "'. While I have extensive data on Weather, Mandi Prices, Pests, Fertilizer, Seeds, Irrigation, Livestock, Organic Farming, and Storage, this specific query requires more context. \n\nI recommend checking our specialized modules like 'Farm Plan' for personalized scheduling, or I can connect you with a specialized Krishi Vigyan Kendra expert. Would you like me to find the nearest expert for you?";
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg = {
            id: Date.now(),
            type: 'user',
            text: inputText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsProcessing(true);

        try {
            // Get AI Response (now real async)
            const responseText = await smartResponse(userMsg.text);

            const aiMsg = {
                id: Date.now() + 1,
                type: 'ai',
                text: responseText,
                timestamp: new Date(),
                sender: 'Kisan AI (Gateway Mode)'
            };
            setMessages(prev => [...prev, aiMsg]);

            if (activeMode === 'voice') {
                speak(responseText);
            }
        } catch (error) {
            console.error("Error getting response:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            setIsSpeaking(true);
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            if (recognitionRef.current) recognitionRef.current.stop();
            setIsListening(false);
        } else {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognitionRef.current = recognition;
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-IN'; // Default to Indian English context

                recognition.onstart = () => setIsListening(true);

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    setInputText(transcript);
                    // Automatic send on successful voice capture is often good UX
                    setTimeout(() => {
                        // trigger handleSend manually or just let user click? 
                        // For now, let's just populate. User can verify and click send.
                    }, 500);
                };

                recognition.onerror = (event) => {
                    console.error("Speech recognition error", event.error);
                    setIsListening(false);
                };

                recognition.onend = () => setIsListening(false);

                recognition.start();
            } else {
                // Fallback for browsers without support
                alert("Voice recognition is not supported in this browser.");
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 lg:px-0">
            {/* Super Premium Header */}
            <div className="relative mb-10 p-10 rounded-[40px] bg-gradient-to-br from-nature-900 to-green-950 text-white overflow-hidden shadow-2xl">
                <div className="absolute right-0 top-0 opacity-10 -translate-y-1/2 translate-x-1/4">
                    <Brain className="w-[400px] h-[400px]" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                            <Zap className="h-4 w-4 text-amber-400" />
                            <span className="text-xs font-black uppercase tracking-widest text-white/80">Hyper-Accurate Kisan AI</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tight leading-none text-white">
                            Your Personal <br /><span className="text-nature-400">AI Agronomist</span>
                        </h1>
                        <p className="text-nature-100 font-bold max-w-md text-lg opacity-80">
                            Providing scientific, data-driven answers to all your farming challenges in seconds.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-3xl border border-white/10 flex items-center gap-4">
                            <div className="p-3 bg-nature-500 rounded-2xl">
                                <Shield className="h-6 w-6 text-black" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-nature-400 uppercase">System Status</p>
                                <p className="font-bold text-white">Precision Mode: High</p>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-3xl border border-white/10 flex items-center gap-4">
                            <div className="p-3 bg-blue-500 rounded-2xl">
                                <Languages className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-blue-400 uppercase">Support</p>
                                <p className="font-bold text-white">English / Hindi / Punjabi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[700px]">
                {/* Left Panel: Knowledge Dashboard */}
                <div className="lg:col-span-4 space-y-4 hidden lg:block">
                    <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Expertise Areas</h2>
                        <div className="space-y-3">
                            {[
                                { name: 'Soil & Nutrition', icon: Sprout, color: 'text-green-600', bg: 'bg-green-50' },
                                { name: 'Mandi Intelligence', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
                                { name: 'Weather Logistics', icon: Cloud, color: 'text-blue-600', bg: 'bg-blue-50' },
                                { name: 'Disease Specialist', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
                                { name: 'Water Management', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
                                { name: 'Livestock Care', icon: Footprints, color: 'text-orange-600', bg: 'bg-orange-50' },
                                { name: 'Organic Protocol', icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                { name: 'Storage Safety', icon: Database, color: 'text-gray-600', bg: 'bg-gray-100' }
                            ].map((area, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-3xl transition-all cursor-pointer group">
                                    <div className={cn("p-3 rounded-2xl group-hover:scale-110 transition-transform flex-shrink-0", area.bg)}>
                                        <area.icon className={cn("h-5 w-5", area.color)} />
                                    </div>
                                    <span className="font-black text-gray-700 text-sm">{area.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-nature-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
                        <Sparkles className="absolute -right-4 -top-4 h-24 w-24 text-nature-800 opacity-50 group-hover:scale-125 transition-transform" />
                        <h3 className="text-xl font-black mb-2">Voice Activated</h3>
                        <p className="text-nature-200 text-sm font-bold opacity-80 leading-relaxed mb-6">
                            Switch to voice mode to talk naturally to the assistant while working in your field.
                        </p>
                        <button
                            onClick={() => setActiveMode('voice')}
                            className="w-full py-4 bg-white text-nature-900 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                        >
                            <Mic className="h-4 w-4" /> Start Speaking
                        </button>
                    </div>
                </div>

                {/* Main Chat Interface */}
                <div className="lg:col-span-8 flex flex-col bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden relative">
                    {/* Chat Header */}
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-2xl bg-nature-700 flex items-center justify-center text-white shadow-lg">
                                    <Bot className="h-6 w-6" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div>
                                <p className="font-black text-gray-900">Kisan AI Pro</p>
                                <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Active Intelligence</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveMode('chat')}
                                className={cn("p-3 rounded-xl transition-all", activeMode === 'chat' ? "bg-nature-100 text-nature-700 scale-110" : "text-gray-400 hover:bg-gray-50")}
                            >
                                <MessageSquare className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setActiveMode('voice')}
                                className={cn("p-3 rounded-xl transition-all relative", activeMode === 'voice' ? "bg-nature-100 text-nature-700 scale-110" : "text-gray-400 hover:bg-gray-50")}
                            >
                                <Mic className="h-5 w-5" />
                                {activeMode === 'voice' && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                            </button>
                        </div>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={cn(
                                    "flex gap-4 animate-in slide-in-from-bottom-4 duration-500",
                                    message.type === 'user' ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md",
                                    message.type === 'user' ? "bg-blue-600 text-white" : "bg-nature-700 text-white"
                                )}>
                                    {message.type === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                                </div>

                                <div className={cn(
                                    "max-w-[80%] space-y-1",
                                    message.type === 'user' ? "items-end" : "items-start"
                                )}>
                                    <p className={cn(
                                        "text-[10px] font-black uppercase tracking-widest text-gray-400 px-2",
                                        message.type === 'user' ? "text-right" : "text-left"
                                    )}>
                                        {message.type === 'user' ? 'You' : 'Kisan AI'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <div className={cn(
                                        "p-5 rounded-3xl shadow-sm text-sm font-bold leading-relaxed whitespace-pre-line",
                                        message.type === 'user'
                                            ? "bg-blue-600 text-white rounded-tr-none"
                                            : "bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100"
                                    )}>
                                        {message.text}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isProcessing && (
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-nature-700 text-white flex items-center justify-center">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div className="bg-gray-50 border border-gray-100 rounded-3xl rounded-tl-none p-5 shadow-sm">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-nature-700 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-nature-700 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-nature-700 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Bottom Controls */}
                    <div className="p-8 bg-white border-t border-gray-50">
                        {activeMode === 'chat' ? (
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask anything (e.g. Current wheat price?)"
                                    className="w-full pl-8 pr-16 py-6 bg-gray-50 border-2 border-transparent focus:border-nature-700 focus:bg-white rounded-3xl font-bold text-lg transition-all shadow-inner outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputText.trim() || isProcessing}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-nature-700 text-white rounded-2xl hover:bg-nature-900 transition-all active:scale-90 disabled:opacity-50 disabled:grayscale"
                                >
                                    <Send className="h-6 w-6" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-6 py-4 animate-in fade-in slide-in-from-bottom-8">
                                <div className="flex items-center gap-12">
                                    <button
                                        className="p-4 bg-gray-100 text-gray-400 rounded-full hover:bg-gray-200 transition-all"
                                        onClick={() => window.speechSynthesis.cancel()}
                                    >
                                        <StopCircle className="h-8 w-8" />
                                    </button>

                                    <button
                                        onClick={toggleListening}
                                        className={cn(
                                            "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl relative",
                                            isListening
                                                ? "bg-red-600 scale-125 ripple-animation"
                                                : "bg-nature-700 hover:bg-nature-800"
                                        )}
                                    >
                                        <Mic className={cn("h-10 w-10 text-white", isListening && "animate-pulse")} />
                                        {isListening && (
                                            <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-50"></div>
                                        )}
                                    </button>

                                    <button
                                        className={cn(
                                            "p-4 rounded-full transition-all",
                                            isSpeaking ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-400"
                                        )}
                                    >
                                        <Volume2 className={cn("h-8 w-8", isSpeaking && "animate-bounce")} />
                                    </button>
                                </div>
                                <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">
                                    {isListening ? "Listening to your voice..." : "Tap to speak your query"}
                                </p>
                            </div>
                        )}

                        {/* Suggestions Bar */}
                        <div className="mt-8 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                            {[
                                "Today's Wheat Rate?",
                                "Treatment for Yellow Rust?",
                                "Next PM Kisan date?",
                                "Best fertilizer for Cotton?",
                                "Improve buffalo milk yield?",
                                "Drip irrigation subsidy?",
                                "How to make Jeevamrut?",
                                "Wheat seeds for high yield?"
                            ].map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setInputText(s); setTimeout(handleSend, 100); }}
                                    className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-black text-gray-500 hover:border-nature-700 hover:text-nature-700 whitespace-nowrap transition-all shadow-sm"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
                .ripple-animation::after {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border: 4px solid #EF4444;
                    border-radius: 50%;
                    animation: ripple 2s infinite;
                }
                @keyframes ripple {
                    0% { transform: scale(1); opacity: 0.8; }
                    100% { transform: scale(2); opacity: 0; }
                }
            `}} />
        </div>
    );
};

export default AIAssistantPage;
