import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Volume2, MessageSquare, Sparkles, X, Loader } from 'lucide-react';
import { cn } from '../lib/utils';

const AIAssistantPage = () => {
    const [activeMode, setActiveMode] = useState('chat'); // 'chat' or 'voice'
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'ai',
            text: 'Hello! I\'m your AI farming assistant. I can help you with weather updates, crop advice, market prices, and more. How can I assist you today?',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef(null);

    // Quick action buttons
    const quickActions = [
        { icon: '🌤️', label: 'Weather Today', query: 'What\'s the weather like today?' },
        { icon: '💰', label: 'Wheat Price', query: 'What is the current wheat price?' },
        { icon: '🌾', label: 'Crop Advice', query: 'What crops should I plant this season?' },
        { icon: '💧', label: 'Irrigation Tips', query: 'When should I irrigate my crops?' },
        { icon: '🐛', label: 'Pest Control', query: 'How do I control pests in my field?' },
        { icon: '📊', label: 'Market Trends', query: 'Show me current market trends' }
    ];

    // Mock AI responses
    const getAIResponse = (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('weather')) {
            return 'Today\'s weather: Partly cloudy with a high of 28°C and low of 22°C. Humidity is at 75%. Good conditions for irrigation. No rain expected in the next 3 days.';
        } else if (lowerMessage.includes('wheat') && lowerMessage.includes('price')) {
            return 'Current wheat prices: ₹2,450/quintal in nearby mandis. Prices have increased by 12% this week due to strong demand. This is a good time to sell if you have stock.';
        } else if (lowerMessage.includes('crop') || lowerMessage.includes('plant')) {
            return 'Based on your soil report and current season, I recommend planting Wheat or Maize. Wheat has 95% suitability for your soil with good nitrogen supplementation. Would you like specific planting guidelines?';
        } else if (lowerMessage.includes('irrigat')) {
            return 'Best irrigation time: Early morning (6-8 AM) or late evening (6-8 PM) to minimize water loss. Your soil moisture is at 45%, which is optimal. Next irrigation recommended in 3-4 days.';
        } else if (lowerMessage.includes('pest')) {
            return 'Common pests this season: Aphids and stem borers. Use neem oil spray (5ml/liter water) as organic control. For severe infestation, apply recommended pesticides. Monitor your crops daily for early detection.';
        } else if (lowerMessage.includes('market') || lowerMessage.includes('trend')) {
            return 'Market trends: Cotton prices stable at ₹7,200/quintal. Rice demand increasing. Vegetable prices up 15% due to supply shortage. Export demand for Indian cotton is strong this quarter.';
        } else {
            return 'I understand you\'re asking about farming. Could you please be more specific? I can help with weather, prices, crop recommendations, irrigation, pest control, and market information.';
        }
    };

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle sending message
    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: inputText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsProcessing(true);

        // Simulate AI processing
        setTimeout(() => {
            const aiResponse = {
                id: Date.now() + 1,
                type: 'ai',
                text: getAIResponse(inputText),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsProcessing(false);

            // Auto-speak response if in voice mode
            if (activeMode === 'voice') {
                speakText(aiResponse.text);
            }
        }, 1500);
    };

    // Handle quick action
    const handleQuickAction = (query) => {
        setInputText(query);
        setTimeout(() => handleSendMessage(), 100);
    };

    // Voice input simulation
    const handleVoiceInput = () => {
        if (isListening) {
            setIsListening(false);
            // Simulate voice recognition result
            setTimeout(() => {
                setInputText('What is the weather like today?');
            }, 500);
        } else {
            setIsListening(true);
            // Auto-stop after 3 seconds
            setTimeout(() => {
                setIsListening(false);
                setInputText('What is the weather like today?');
            }, 3000);
        }
    };

    // Text-to-speech simulation
    const speakText = (text) => {
        setIsSpeaking(true);
        // Simulate speaking duration (roughly 100ms per word)
        const duration = text.split(' ').length * 400;
        setTimeout(() => {
            setIsSpeaking(false);
        }, duration);
    };

    return (
        <div className="max-w-5xl mx-auto py-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-8 w-8 text-nature-600" />
                    <h1 className="text-3xl font-bold text-nature-900">AI Farming Assistant</h1>
                </div>
                <p className="text-gray-600">Get instant answers to your farming questions - chat or speak!</p>
            </div>

            {/* Mode Selector */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-6 flex gap-1">
                <button
                    onClick={() => setActiveMode('chat')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all",
                        activeMode === 'chat'
                            ? "bg-nature-700 text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-50"
                    )}
                >
                    <MessageSquare className="h-5 w-5" />
                    Chat Mode
                </button>
                <button
                    onClick={() => setActiveMode('voice')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all",
                        activeMode === 'voice'
                            ? "bg-nature-700 text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-50"
                    )}
                >
                    <Mic className="h-5 w-5" />
                    Voice Mode
                </button>
            </div>

            {/* Chat Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Messages Area */}
                <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                "flex gap-3",
                                message.type === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            {message.type === 'ai' && (
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-nature-600 to-green-600 flex items-center justify-center text-white font-bold">
                                    AI
                                </div>
                            )}
                            <div
                                className={cn(
                                    "max-w-[70%] rounded-2xl px-4 py-3",
                                    message.type === 'user'
                                        ? "bg-nature-700 text-white rounded-br-sm"
                                        : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm shadow-sm"
                                )}
                            >
                                <p className="text-sm leading-relaxed">{message.text}</p>
                                <p className={cn(
                                    "text-xs mt-2",
                                    message.type === 'user' ? "text-nature-200" : "text-gray-400"
                                )}>
                                    {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            {message.type === 'user' && (
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold">
                                    U
                                </div>
                            )}
                        </div>
                    ))}

                    {isProcessing && (
                        <div className="flex gap-3 justify-start">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-nature-600 to-green-600 flex items-center justify-center text-white font-bold">
                                AI
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-4 w-4 text-nature-600" />
                        <span className="text-sm font-semibold text-gray-700">Quick Actions</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuickAction(action.query)}
                                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-nature-300 hover:bg-nature-50 transition-all text-left"
                            >
                                <span className="text-xl">{action.icon}</span>
                                <span className="text-sm font-medium text-gray-700">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-200 p-4 bg-white">
                    {activeMode === 'chat' ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type your question here..."
                                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputText.trim() || isProcessing}
                                className="px-6 py-3 bg-nature-700 text-white rounded-lg font-medium hover:bg-nature-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                <Send className="h-5 w-5" />
                                Send
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Speak or type your question..."
                                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputText.trim() || isProcessing}
                                    className="px-6 py-3 bg-nature-700 text-white rounded-lg font-medium hover:bg-nature-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                >
                                    <Send className="h-5 w-5" />
                                    Send
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={handleVoiceInput}
                                    className={cn(
                                        "relative px-8 py-4 rounded-full font-medium transition-all flex items-center gap-3",
                                        isListening
                                            ? "bg-red-600 text-white shadow-lg scale-110"
                                            : "bg-nature-700 text-white hover:bg-nature-800"
                                    )}
                                >
                                    <Mic className="h-6 w-6" />
                                    {isListening ? 'Listening...' : 'Hold to Speak'}
                                    {isListening && (
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                                        </span>
                                    )}
                                </button>

                                {isSpeaking && (
                                    <div className="flex items-center gap-2 text-nature-700">
                                        <Volume2 className="h-5 w-5 animate-pulse" />
                                        <span className="text-sm font-medium">Speaking...</span>
                                    </div>
                                )}
                            </div>

                            <div className="text-center text-xs text-gray-500">
                                {isListening ? '🎤 Listening to your voice...' : '💡 Click the button and speak your question'}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Features Info */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-blue-900">Chat Mode</h3>
                    </div>
                    <p className="text-sm text-blue-700">Type your questions and get instant text responses</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                        <Mic className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-green-900">Voice Input</h3>
                    </div>
                    <p className="text-sm text-green-700">Speak your questions in your preferred language</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                        <Volume2 className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold text-purple-900">Voice Output</h3>
                    </div>
                    <p className="text-sm text-purple-700">Listen to responses read aloud automatically</p>
                </div>
            </div>
        </div>
    );
};

export default AIAssistantPage;
