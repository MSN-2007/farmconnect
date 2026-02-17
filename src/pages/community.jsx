import React, { useState, useEffect } from 'react';
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
    Send,
    Search,
    Users,
    Sprout,
    Apple,
    Fish,
    Tractor,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import SearchBarWithAutocomplete from '../components/search-bar-autocomplete';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CommunityPage = () => {
    // Enhanced categories with icons and descriptions
    const communities = [
        {
            id: 'all',
            name: 'All Communities',
            icon: Globe,
            color: 'bg-gray-100 text-gray-700',
            description: 'View all posts'
        },
        {
            id: 'vegetables',
            name: 'Vegetables',
            icon: Sprout,
            color: 'bg-green-100 text-green-700',
            description: 'Vegetable farming discussions'
        },
        {
            id: 'fruits',
            name: 'Fruits',
            icon: Apple,
            color: 'bg-red-100 text-red-700',
            description: 'Fruit cultivation & orchard management'
        },
        {
            id: 'animal-culture',
            name: 'Animal Culture',
            icon: Users,
            color: 'bg-amber-100 text-amber-700',
            description: 'Dairy, poultry & livestock'
        },
        {
            id: 'aquaculture',
            name: 'Aquaculture',
            icon: Fish,
            color: 'bg-blue-100 text-blue-700',
            description: 'Fish farming & aquatic crops'
        },
        {
            id: 'farm-equipment',
            name: 'Farm Equipment',
            icon: Tractor,
            color: 'bg-purple-100 text-purple-700',
            description: 'Machinery & tools discussion'
        },
        {
            id: 'market-prices',
            name: 'Market Prices',
            icon: TrendingUp,
            color: 'bg-emerald-100 text-emerald-700',
            description: 'Price updates & market trends'
        },
        {
            id: 'diseases',
            name: 'Diseases & Solutions',
            icon: AlertCircle,
            color: 'bg-orange-100 text-orange-700',
            description: 'Crop diseases & pest control'
        }
    ];

    const [activeCommunity, setActiveCommunity] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [likedPosts, setLikedPosts] = useState({});
    const [likedComments, setLikedComments] = useState({});
    const [csrfToken, setCsrfToken] = useState('');

    // New post state
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostCommunity, setNewPostCommunity] = useState('vegetables');
    const [newPostImage, setNewPostImage] = useState(null);
    const [newPostImageFile, setNewPostImageFile] = useState(null); // File object
    const [showNewPostModal, setShowNewPostModal] = useState(false);

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch CSRF token on mount
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const res = await fetch(`${API_URL}/api/csrf-token`, { credentials: 'include' });
                const data = await res.json();
                setCsrfToken(data.csrfToken);
            } catch (error) {
                console.error('Failed to fetch CSRF token:', error);
            }
        };
        fetchCsrfToken();
    }, []);

    // Fetch posts on load and when community changes
    useEffect(() => {
        fetchPosts();
    }, [activeCommunity]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/posts?community=${activeCommunity}`);
            const data = await res.json();

            // Check if data is an array (successful response)
            if (Array.isArray(data)) {
                setPosts(data);
            } else {
                // API returned error object, use sample data
                console.error('API error:', data);
                setPosts([
                    {
                        _id: '1',
                        author: 'Sample Farmer',
                        content: 'Welcome to the FarmConnect community! Share your farming experiences here.',
                        community: 'General',
                        tags: ['welcome', 'farming'],
                        likes: 10,
                        comments: [],
                        createdAt: new Date().toISOString()
                    },
                    {
                        _id: '2',
                        author: 'Crop Expert',
                        content: 'Great harvest season this year! What crops are you growing?',
                        community: 'Crops',
                        tags: ['crops', 'harvest'],
                        likes: 5,
                        comments: [],
                        createdAt: new Date().toISOString()
                    }
                ]);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            // FALLBACK: Use sample data if API fails
            setPosts([
                {
                    _id: '1',
                    author: 'Sample Farmer',
                    content: 'Welcome to the FarmConnect community! Share your farming experiences here.',
                    community: 'General',
                    tags: ['welcome', 'farming'],
                    likes: 10,
                    comments: [],
                    createdAt: new Date().toISOString()
                },
                {
                    _id: '2',
                    author: 'Crop Expert',
                    content: 'Great harvest season this year! What crops are you growing?',
                    community: 'Crops',
                    tags: ['crops', 'harvest'],
                    likes: 5,
                    comments: [],
                    createdAt: new Date().toISOString()
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Get search suggestions
    const getSearchSuggestions = () => {
        if (searchQuery.length < 2) return [];
        const suggestions = new Set();
        posts.forEach(post => {
            if (post.author.toLowerCase().includes(searchQuery.toLowerCase())) suggestions.add(post.author);
            if (post.tags) post.tags.forEach(tag => {
                if (tag.toLowerCase().includes(searchQuery.toLowerCase())) suggestions.add(tag);
            });
        });
        return Array.from(suggestions).slice(0, 5);
    };

    const searchSuggestions = getSearchSuggestions();

    // Filter posts by community and search query
    const filteredPosts = posts.filter(post => {
        const communityMatch = activeCommunity === 'all' || post.community === activeCommunity;
        const searchMatch = searchQuery === '' ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
        return communityMatch && searchMatch;
    });

    // Handle new post
    const handleCreatePost = async () => {
        if (!newPostContent.trim()) return;

        const formData = new FormData();
        formData.append('content', newPostContent);
        formData.append('community', newPostCommunity);

        if (newPostImageFile) {
            formData.append('image', newPostImageFile);
        }

        try {
            const res = await fetch(`${API_URL}/api/posts`, {
                method: 'POST',
                credentials: 'include',  // Send httpOnly cookie
                headers: {
                    'X-CSRF-Token': csrfToken
                },
                body: formData
            });

            if (res.ok) {
                const newPost = await res.json();
                setPosts([newPost, ...posts]);
                setNewPostContent('');
                setNewPostImage(null);
                setNewPostImageFile(null);
                setShowNewPostModal(false);
            }
        } catch (error) {
            console.error('Failed to create post:', error);
            alert('Failed to post.');
        }
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewPostImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPostImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Toggle like
    const toggleLike = async (postId) => {
        // Optimistic UI update
        const alreadyLiked = likedPosts[postId];
        if (alreadyLiked) return; // Prevent double like

        setLikedPosts(prev => ({ ...prev, [postId]: true }));
        setPosts(posts.map(p => p._id === postId ? { ...p, likes: p.likes + 1 } : p));

        try {
            await fetch(`${API_URL}/api/posts/${postId}/like`, {
                method: 'POST',
                credentials: 'include',  // Send httpOnly cookie
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                }
            });
        } catch (error) {
            console.error('Failed to like post:', error);
            // Revert on error
            setLikedPosts(prev => ({ ...prev, [postId]: false }));
            setPosts(posts.map(p => p._id === postId ? { ...p, likes: p.likes - 1 } : p));
        }
    };

    // Get community info
    const getCurrentCommunity = () => {
        return communities.find(c => c.id === activeCommunity) || communities[0];
    };

    return (
        <div className="max-w-7xl mx-auto py-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-nature-900 mb-2">Community</h1>
                <p className="text-gray-600">Connect with farmers, share knowledge, and grow together</p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <SearchBarWithAutocomplete
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search posts, authors, or topics..."
                    suggestions={searchSuggestions}
                    className="max-w-2xl"
                />
            </div>

            {/* Communities Grid */}
            <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Communities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                    {communities.map(community => {
                        const Icon = community.icon;
                        const isActive = activeCommunity === community.id;
                        const postCount = posts.filter(p => community.id === 'all' || p.community === community.id).length;

                        return (
                            <button
                                key={community.id}
                                onClick={() => setActiveCommunity(community.id)}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                    isActive
                                        ? "border-nature-600 bg-nature-50 shadow-md"
                                        : "border-gray-200 bg-white hover:border-nature-300 hover:shadow-sm"
                                )}
                            >
                                <div className={cn(
                                    "p-3 rounded-lg",
                                    isActive ? "bg-nature-600 text-white" : community.color
                                )}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div className="text-center">
                                    <div className={cn(
                                        "text-sm font-semibold",
                                        isActive ? "text-nature-900" : "text-gray-900"
                                    )}>
                                        {community.name}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5">
                                        {postCount} posts
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Active Community Info */}
            <div className="mb-6 bg-gradient-to-r from-nature-600 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-lg">
                            {React.createElement(getCurrentCommunity().icon, { className: "h-8 w-8" })}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{getCurrentCommunity().name}</h2>
                            <p className="text-green-100">{getCurrentCommunity().description}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowNewPostModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-nature-700 rounded-lg font-semibold hover:bg-green-50 transition-colors shadow-lg"
                    >
                        <Plus className="h-5 w-5" />
                        New Post
                    </button>
                </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
                {filteredPosts.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No posts found</h3>
                        <p className="text-gray-600 mb-4">
                            {searchQuery ? 'Try a different search term' : 'Be the first to post in this community!'}
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setShowNewPostModal(true);
                            }}
                            className="px-6 py-2 bg-nature-700 text-white rounded-lg font-medium hover:bg-nature-800 transition-colors"
                        >
                            Create Post
                        </button>
                    </div>
                ) : (
                    filteredPosts.map(post => {
                        const postCommunity = communities.find(c => c.id === post.community);
                        const authorName = post.author?.name || 'Unknown User';
                        const authorInitial = authorName.charAt(0).toUpperCase();

                        return (
                            <div key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                {/* Post Header */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-nature-600")}>
                                        {authorInitial}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-gray-900">{authorName}</h3>
                                            {post.author?.role === 'expert' && (
                                                <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                                    <CheckCircle className="h-3 w-3" />
                                                    Expert
                                                </div>
                                            )}
                                            {postCommunity && (
                                                <div className={cn("px-2 py-0.5 rounded-full text-xs font-medium", postCommunity.color)}>
                                                    {postCommunity.name}
                                                </div>
                                            )}
                                        </div>
                                        {post.author?.role && <p className="text-sm text-gray-600 mb-1">{post.author.role}</p>}
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {post.location || 'Unknown'}
                                            </span>
                                            <span>•</span>
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Post Content */}
                                <p className="text-gray-800 mb-3">{post.content}</p>

                                {/* Post Image */}
                                {post.image && (
                                    <img src={post.image} alt="Post" className="w-full rounded-lg mb-3" />
                                )}

                                {/* Tags */}
                                {post.tags && post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {post.tags.map((tag, idx) => (
                                            <span key={idx} className="text-sm text-nature-700 hover:text-nature-800 cursor-pointer">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Post Actions */}
                                <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => toggleLike(post._id)}
                                        className={cn(
                                            "flex items-center gap-2 text-sm font-medium transition-colors",
                                            likedPosts[post._id] ? "text-nature-700" : "text-gray-600 hover:text-nature-700"
                                        )}
                                    >
                                        <ThumbsUp className={cn("h-4 w-4", likedPosts[post._id] && "fill-current")} />
                                        {post.likes + (likedPosts[post._id] ? 1 : 0)}
                                    </button>
                                    <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-nature-700 transition-colors">
                                        <MessageSquare className="h-4 w-4" />
                                        {post.comments?.length || 0}
                                    </button>
                                    <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-nature-700 transition-colors">
                                        <Share2 className="h-4 w-4" />
                                        Share
                                    </button>
                                </div>

                                {/* Replies */}
                                {post.replies && post.replies.length > 0 && (
                                    <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-3">
                                        {post.replies.map(reply => (
                                            <div key={reply.id} className="flex items-start gap-3">
                                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold", reply.color)}>
                                                    {reply.initial}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold text-sm text-gray-900">{reply.author}</span>
                                                        {reply.isExpert && (
                                                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                                                <CheckCircle className="h-2.5 w-2.5" />
                                                                Expert
                                                            </div>
                                                        )}
                                                        <span className="text-xs text-gray-500">{reply.time}</span>
                                                    </div>
                                                    {reply.role && <p className="text-xs text-gray-600 mb-1">{reply.role}</p>}
                                                    <p className="text-sm text-gray-700">{reply.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* New Post Modal */}
            {showNewPostModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Create Post</h2>
                            <button
                                onClick={() => {
                                    setShowNewPostModal(false);
                                    setNewPostImage(null);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Community Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Community</label>
                                <select
                                    value={newPostCommunity}
                                    onChange={(e) => setNewPostCommunity(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500"
                                >
                                    {communities.filter(c => c.id !== 'all').map(community => (
                                        <option key={community.id} value={community.id}>{community.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Post Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">What's on your mind?</label>
                                <textarea
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="Share your thoughts, ask questions, or provide advice..."
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 resize-none"
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Add Image (Optional)</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex-1 flex flex-col items-center justify-center px-4 py-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                        <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-600">Click to upload image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                    {newPostImage && (
                                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-nature-500">
                                            <img src={newPostImage} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => setNewPostImage(null)}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleCreatePost}
                                disabled={!newPostContent.trim()}
                                className="w-full px-6 py-3 bg-nature-700 text-white rounded-lg font-semibold hover:bg-nature-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Send className="h-4 w-4" />
                                Post to Community
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityPage;
