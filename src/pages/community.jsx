import React, { useState } from 'react';
import {
    MessageSquare,
    ThumbsUp,
    Share2,
    Image as ImageIcon,
    Plus,
    Globe,
    MapPin,
    CheckCircle,
    X,
    Send
} from 'lucide-react';
import { cn } from '../lib/utils';

const CommunityPage = () => {
    const filters = [
        "All", "Vegetables", "Fruits", "Horticulture",
        "Diseases & Solutions", "Market Prices", "Aquaculture", "Seasonal Talks"
    ];

    const [activeFilter, setActiveFilter] = useState("All");
    const [likedPosts, setLikedPosts] = useState({});
    const [likedComments, setLikedComments] = useState({});

    // New post state
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostCategory, setNewPostCategory] = useState('All');
    const [newPostImage, setNewPostImage] = useState(null);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    // Posts state
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: 'Dr. Amit Patel',
            isExpert: true,
            role: 'Irrigation Expert',
            time: '1 day ago',
            location: 'Gujarat',
            content: "Looking for advice on drip irrigation setup for a 5-acre plot. What's the best approach for cotton?",
            badge: 'All',
            tags: ['#Irrigation', '#Advice', '#Cotton'],
            likes: 18,
            comments: 12,
            initial: 'AP',
            color: 'bg-green-700',
            replies: []
        },
        {
            id: 2,
            author: 'Kavita Sharma',
            isExpert: false,
            time: '3 days ago',
            location: 'Rajasthan',
            content: "Market prices for cumin seeds are rising. Good time to sell!",
            badge: 'Market Prices',
            tags: ['#Market Update', '#Cumin'],
            likes: 34,
            comments: 6,
            initial: 'KS',
            color: 'bg-green-700',
            replies: []
        },
        {
            id: 3,
            author: 'Rajesh Kumar',
            isExpert: false,
            time: '2 hours ago',
            location: 'Punjab',
            content: "My wheat crop is showing yellow spots on leaves. Is this a nitrogen deficiency? Any suggestions?",
            badge: 'Diseases & Solutions',
            tags: ['#Crop Disease', '#Wheat'],
            likes: 24,
            comments: 8,
            initial: 'RK',
            color: 'bg-green-700',
            replies: [
                {
                    id: 301,
                    author: 'Dr. Suresh Verma',
                    isExpert: true,
                    role: 'Plant Pathologist',
                    time: '1 hour ago',
                    content: "Based on the description, it could be nitrogen deficiency. Check if lower leaves are affected first. Apply urea at 50kg/acre and monitor for 7 days.",
                    likes: 12,
                    initial: 'SV',
                    color: 'bg-amber-100 text-amber-800'
                },
                {
                    id: 302,
                    author: 'Mohan Singh',
                    time: '30 mins ago',
                    content: "I had similar issue last season. Dr. Verma's advice worked for me!",
                    likes: 5,
                    initial: 'MS',
                    color: 'bg-gray-200 text-gray-700'
                }
            ]
        },
        {
            id: 4,
            author: 'Priya Singh',
            isExpert: false,
            time: '5 hours ago',
            location: 'Maharashtra',
            content: "Just harvested my organic tomatoes! The yield is amazing this season. Happy to share tips with fellow farmers.",
            image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800",
            badge: 'Vegetables',
            tags: ['#Success Story', '#Organic Farming', '#Tomatoes'],
            likes: 56,
            comments: 15,
            initial: 'PS',
            color: 'bg-green-700',
            replies: [
                {
                    id: 401,
                    author: 'Ramesh Yadav',
                    time: '4 hours ago',
                    content: "Congratulations! What variety did you grow?",
                    likes: 3,
                    initial: 'RY',
                    color: 'bg-amber-100 text-amber-800'
                }
            ]
        }
    ]);

    // Comment input state for each post
    const [commentInputs, setCommentInputs] = useState({});
    const [showCommentInput, setShowCommentInput] = useState({});

    const toggleLike = (postId) => {
        setLikedPosts(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const toggleCommentLike = (commentId) => {
        setLikedComments(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPostImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Create new post
    const handleCreatePost = () => {
        if (!newPostContent.trim()) return;

        const newPost = {
            id: Date.now(),
            author: 'You',
            isExpert: false,
            time: 'Just now',
            location: 'India',
            content: newPostContent,
            badge: newPostCategory,
            tags: extractHashtags(newPostContent),
            likes: 0,
            comments: 0,
            initial: 'YO',
            color: 'bg-blue-600',
            image: newPostImage,
            replies: []
        };

        setPosts([newPost, ...posts]);
        setNewPostContent('');
        setNewPostCategory('All');
        setNewPostImage(null);
    };

    // Extract hashtags from content
    const extractHashtags = (text) => {
        const hashtags = text.match(/#\w+/g);
        return hashtags || [];
    };

    // Add comment to post
    const handleAddComment = (postId) => {
        const commentText = commentInputs[postId];
        if (!commentText || !commentText.trim()) return;

        const newComment = {
            id: Date.now(),
            author: 'You',
            time: 'Just now',
            content: commentText,
            likes: 0,
            initial: 'YO',
            color: 'bg-blue-100 text-blue-800'
        };

        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    replies: [...(post.replies || []), newComment],
                    comments: post.comments + 1
                };
            }
            return post;
        }));

        setCommentInputs({ ...commentInputs, [postId]: '' });
        setShowCommentInput({ ...showCommentInput, [postId]: false });
    };

    // Filter posts
    const filteredPosts = activeFilter === 'All'
        ? posts
        : posts.filter(post => post.badge === activeFilter);

    return (
        <div className="max-w-4xl mx-auto py-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-nature-900">Digital Agri Hub</h1>
                    <Globe className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-gray-200 text-xs font-medium text-gray-600 shadow-sm">
                    <MapPin className="h-3 w-3" />
                    India-wide Network
                </div>
            </div>

            {/* Create Post */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Share your farming experience, ask questions, or help fellow farmers... (Use #hashtags)"
                    className="w-full bg-nature-50/30 rounded-lg p-4 text-gray-700 placeholder:text-gray-400 border-transparent focus:border-nature-300 focus:bg-white focus:ring-0 transition-all resize-none min-h-[100px]"
                />

                {/* Image Preview */}
                {newPostImage && (
                    <div className="relative mt-3 rounded-lg overflow-hidden border border-gray-200">
                        <img src={newPostImage} alt="Upload preview" className="w-full h-48 object-cover" />
                        <button
                            onClick={() => setNewPostImage(null)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                        {/* Image Upload */}
                        <label className="flex items-center gap-2 px-4 py-2 bg-white text-nature-700 rounded-lg text-sm font-medium hover:bg-nature-50 transition-colors border border-gray-200 cursor-pointer">
                            <ImageIcon className="h-4 w-4" />
                            Add Photos
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>

                        {/* Category Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors border border-gray-200"
                            >
                                {newPostCategory}
                                <span className="text-xs">▼</span>
                            </button>
                            {showCategoryDropdown && (
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
                                    {filters.map(category => (
                                        <button
                                            key={category}
                                            onClick={() => {
                                                setNewPostCategory(category);
                                                setShowCategoryDropdown(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleCreatePost}
                        disabled={!newPostContent.trim()}
                        className="flex items-center gap-2 px-6 py-2 bg-nature-700 text-white rounded-lg text-sm font-medium hover:bg-nature-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="h-4 w-4" />
                        Publish Post
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={cn(
                            "px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                            activeFilter === filter
                                ? "bg-gray-200 text-gray-800"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                        )}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Feed */}
            <div className="space-y-4">
                {filteredPosts.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No posts in this category yet</p>
                        <p className="text-gray-400 text-sm">Be the first to share!</p>
                    </div>
                ) : (
                    filteredPosts.map((post) => (
                        <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            {/* Post Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex gap-3">
                                    <div className={cn("h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold text-base shrink-0", post.color)}>
                                        {post.initial}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-gray-900 text-base">{post.author}</h3>
                                            {post.isExpert && (
                                                <span className="bg-white text-orange-600 text-[10px] px-2 py-0.5 rounded font-medium flex items-center gap-1 border border-orange-200">
                                                    <CheckCircle className="h-3 w-3 fill-orange-600" />
                                                    Expert
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                            {post.role && <span>{post.role}</span>}
                                            {post.role && <span>•</span>}
                                            <span>{post.time}</span>
                                            <span>•</span>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {post.location}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {post.badge && (
                                    <span className={cn(
                                        "text-xs px-3 py-1 rounded-full font-medium text-white shrink-0",
                                        "bg-nature-700"
                                    )}>
                                        {post.badge}
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <p className="text-gray-800 text-sm leading-relaxed mb-3">
                                {post.content}
                            </p>

                            {post.image && (
                                <div className="mb-4 rounded-xl overflow-hidden border border-gray-100">
                                    <img src={post.image} alt="Post attachment" className="w-full h-64 object-cover" />
                                </div>
                            )}

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md font-medium hover:bg-gray-200 cursor-pointer transition-colors">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="h-px bg-gray-100 mb-3" />

                            {/* Actions */}
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => toggleLike(post.id)}
                                    className={cn(
                                        "flex items-center gap-2 transition-colors",
                                        likedPosts[post.id] ? "text-green-600" : "text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    <ThumbsUp className={cn("h-4 w-4", likedPosts[post.id] && "fill-green-600")} />
                                    <span className="text-sm font-medium">{post.likes + (likedPosts[post.id] ? 1 : 0)}</span>
                                </button>
                                <button
                                    onClick={() => setShowCommentInput({ ...showCommentInput, [post.id]: !showCommentInput[post.id] })}
                                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <MessageSquare className="h-4 w-4" />
                                    <span className="text-sm font-medium">{post.comments}</span>
                                </button>
                                <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors ml-auto">
                                    <Share2 className="h-4 w-4" />
                                    <span className="text-sm font-medium">Share</span>
                                </button>
                            </div>

                            {/* Comment Input */}
                            {showCommentInput[post.id] && (
                                <div className="mt-4 flex gap-2">
                                    <input
                                        type="text"
                                        value={commentInputs[post.id] || ''}
                                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                        placeholder="Write a comment..."
                                        className="flex-1 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent text-sm"
                                    />
                                    <button
                                        onClick={() => handleAddComment(post.id)}
                                        className="px-4 py-2 bg-nature-700 text-white rounded-lg hover:bg-nature-800 transition-colors"
                                    >
                                        <Send className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            {/* Replies */}
                            {post.replies && post.replies.length > 0 && (
                                <div className="mt-4 space-y-3">
                                    {post.replies.map(reply => (
                                        <div key={reply.id} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
                                            <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0", reply.color)}>
                                                {reply.initial}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-bold text-gray-900">{reply.author}</span>
                                                    {reply.isExpert && (
                                                        <span className="bg-white text-orange-600 text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-orange-200">
                                                            <CheckCircle className="h-2.5 w-2.5 fill-orange-600" />
                                                            Expert
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-gray-400">{reply.time}</span>
                                                </div>
                                                {reply.role && (
                                                    <p className="text-xs text-gray-500 mb-1">{reply.role}</p>
                                                )}
                                                <p className="text-gray-700 text-sm leading-relaxed mb-2">{reply.content}</p>
                                                <button
                                                    onClick={() => toggleCommentLike(reply.id)}
                                                    className={cn(
                                                        "flex items-center gap-1 text-xs transition-colors",
                                                        likedComments[reply.id] ? "text-green-600" : "text-gray-400 hover:text-gray-600"
                                                    )}
                                                >
                                                    <ThumbsUp className={cn("h-3 w-3", likedComments[reply.id] && "fill-green-600")} />
                                                    <span className="font-medium">{reply.likes + (likedComments[reply.id] ? 1 : 0)}</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommunityPage;
