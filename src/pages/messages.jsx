import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, ArrowLeft, User, Image as ImageIcon, Clock, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import { cn } from '../lib/utils';
import io from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const MessagesPage = () => {
    const { user, token } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Initialize Socket.io
    useEffect(() => {
        if (!user) return;

        const newSocket = io(API_URL, {
            auth: { token: token || 'placeholder' }
        });

        newSocket.on('connect', () => {
            // Connected to messaging server
        });

        newSocket.on('new_message', (message) => {
            setMessages(prev => [...prev, message]);
            scrollToBottom();
        });

        newSocket.on('user_typing', ({ userId, isTyping }) => {
            if (userId !== user.id) {
                setIsTyping(isTyping);
            }
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }, [user]);

    // Fetch conversations
    useEffect(() => {
        fetchConversations();
    }, []);

    // Fetch messages when conversation changes
    useEffect(() => {
        if (activeConversation) {
            fetchMessages(activeConversation._id);
        }
    }, [activeConversation]);

    const fetchConversations = async () => {
        try {
            const res = await fetch(`${API_URL}/api/conversations`, {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setConversations(data);
            }
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const res = await fetch(`${API_URL}/api/conversations/${conversationId}/messages`, {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data);

                // Join conversation room via socket
                if (socket) {
                    socket.emit('join_conversations', [conversationId]);
                    socket.emit('mark_read', { conversationId });
                }

                scrollToBottom();
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !activeConversation) return;

        const messageData = {
            conversationId: activeConversation._id,
            content: newMessage,
            messageType: 'text'
        };

        // Send via Socket.io for instant delivery
        if (socket) {
            socket.emit('send_message', messageData);
        }

        setNewMessage('');
        setIsTyping(false);
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        if (socket && activeConversation) {
            socket.emit('typing', {
                conversationId: activeConversation._id,
                isTyping: e.target.value.length > 0
            });
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const getOtherParticipant = (conversation) => {
        return conversation.participants?.find(p => p._id !== user?.id);
    };

    if (!user) {
        return (
            <div className="max-w-7xl mx-auto py-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Please login to view messages</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden" style={{ height: '600px' }}>
                <div className="grid grid-cols-3 h-full">
                    {/* Conversations List */}
                    <div className={cn(
                        "border-r border-gray-200 flex flex-col",
                        activeConversation ? "hidden md:flex" : "flex"
                    )}>
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900">Messages</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {conversations.length === 0 ? (
                                <div className="p-6 text-center">
                                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">No conversations yet</p>
                                    <p className="text-gray-400 text-xs mt-1">Start chatting by contacting sellers</p>
                                </div>
                            ) : (
                                conversations.map(conv => {
                                    const otherUser = getOtherParticipant(conv);
                                    const unread = conv.unreadCount?.get?.(user.id) || 0;

                                    return (
                                        <button
                                            key={conv._id}
                                            onClick={() => setActiveConversation(conv)}
                                            className={cn(
                                                "w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left",
                                                activeConversation?._id === conv._id && "bg-nature-50"
                                            )}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="h-12 w-12 rounded-full bg-nature-100 flex items-center justify-center flex-shrink-0">
                                                    <User className="h-6 w-6 text-nature-700" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className="font-medium text-gray-900 truncate">
                                                            {otherUser?.name || 'Unknown User'}
                                                        </h3>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(conv.lastMessageAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm text-gray-600 truncate">
                                                            {conv.lastMessage || 'No messages yet'}
                                                        </p>
                                                        {unread > 0 && (
                                                            <span className="bg-nature-600 text-white text-xs px-2 py-0.5 rounded-full ml-2">
                                                                {unread}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className={cn(
                        "col-span-2 flex flex-col",
                        !activeConversation ? "hidden md:flex" : "flex col-span-3 md:col-span-2"
                    )}>
                        {!activeConversation ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Select a conversation</h3>
                                    <p className="text-gray-500 text-sm">Choose a conversation to start messaging</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                                    <button
                                        onClick={() => setActiveConversation(null)}
                                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </button>
                                    <div className="h-10 w-10 rounded-full bg-nature-100 flex items-center justify-center">
                                        <User className="h-5 w-5 text-nature-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">
                                            {getOtherParticipant(activeConversation)?.name || 'Unknown User'}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {getOtherParticipant(activeConversation)?.phone}
                                        </p>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {messages.map((msg, idx) => {
                                        const isMine = msg.sender?._id === user.id;
                                        return (
                                            <div key={idx} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                                                <div className={cn(
                                                    "max-w-[70%] rounded-lg p-3",
                                                    isMine
                                                        ? "bg-nature-600 text-white"
                                                        : "bg-gray-100 text-gray-900"
                                                )}>
                                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                                    <div className={cn(
                                                        "flex items-center gap-1 mt-1 text-xs",
                                                        isMine ? "text-nature-100" : "text-gray-500"
                                                    )}>
                                                        <Clock className="h-3 w-3" />
                                                        <span>
                                                            {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {isMine && msg.read && (
                                                            <CheckCheck className="h-3 w-3 ml-1" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-gray-100 rounded-lg p-3">
                                                <div className="flex gap-1">
                                                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <div className="p-4 border-t border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={handleTyping}
                                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                            placeholder="Type a message..."
                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500"
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={!newMessage.trim()}
                                            className="px-4 py-2 bg-nature-600 text-white rounded-lg hover:bg-nature-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Send className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
