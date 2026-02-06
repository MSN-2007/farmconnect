import React, { useState } from 'react';
import { BookOpen, Users, Award, Video, Clock, FileText, Star } from 'lucide-react';
import { cn } from '../lib/utils';

const CoursesPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = [
        'All',
        'Organic Farming',
        'Technology',
        'Water Management',
        'Crop Protection',
        'Soil Science',
        'Livestock',
        'Business'
    ];

    const courses = [
        {
            id: 1,
            title: 'Modern Organic Farming Techniques',
            instructor: 'Dr. Rajesh Kumar',
            description: 'Learn sustainable organic farming methods, soil health management, and natural pest control.',
            icon: '🌱',
            price: 'Free',
            duration: '6 weeks',
            modules: 12,
            students: 1234,
            rating: 4.8,
            level: 'Beginner',
            category: 'Organic Farming',
            tags: ['Beginner', 'Organic Farming']
        },
        {
            id: 2,
            title: 'Precision Agriculture & Technology',
            instructor: 'Prof. Sunita Reddy',
            description: 'Master GPS technology, drone mapping, IoT sensors, and data-driven farming decisions.',
            icon: '🚜',
            price: 2999,
            duration: '8 weeks',
            modules: 16,
            students: 856,
            rating: 4.9,
            level: 'Advanced',
            category: 'Technology',
            tags: ['Advanced', 'Technology']
        },
        {
            id: 3,
            title: 'Water Management & Irrigation',
            instructor: 'Dr. Anil Sharma',
            description: 'Efficient irrigation systems, drip irrigation, water conservation, and rainwater harvesting.',
            icon: '💧',
            price: 'Free',
            duration: '4 weeks',
            modules: 10,
            students: 2103,
            rating: 4.7,
            level: 'Intermediate',
            category: 'Water Management',
            tags: ['Intermediate', 'Water Management']
        },
        {
            id: 4,
            title: 'Integrated Pest Management',
            instructor: 'Dr. Priya Singh',
            description: 'Biological pest control, IPM strategies, and reducing chemical pesticide dependence.',
            icon: '🐛',
            price: 1499,
            duration: '5 weeks',
            modules: 14,
            students: 1567,
            rating: 4.6,
            level: 'Intermediate',
            category: 'Crop Protection',
            tags: ['Intermediate', 'Crop Protection']
        },
        {
            id: 5,
            title: 'Soil Health & Fertility Management',
            instructor: 'Prof. Mohan Das',
            description: 'Understanding soil testing, nutrient management, composting, and soil regeneration.',
            icon: '🌾',
            price: 'Free',
            duration: '6 weeks',
            modules: 11,
            students: 1890,
            rating: 4.8,
            level: 'Beginner',
            category: 'Soil Science',
            tags: ['Beginner', 'Soil Science']
        },
        {
            id: 6,
            title: 'Dairy Farming & Management',
            instructor: 'Dr. Kavita Patel',
            description: 'Complete dairy farm setup, animal health, breeding, milk production, and quality control.',
            icon: '🐄',
            price: 1999,
            duration: '7 weeks',
            modules: 15,
            students: 945,
            rating: 4.7,
            level: 'Beginner',
            category: 'Livestock',
            tags: ['Beginner', 'Livestock']
        },
        {
            id: 7,
            title: 'Greenhouse & Protected Cultivation',
            instructor: 'Dr. Ramesh Verma',
            description: 'Design and manage greenhouses, hydroponics, climate control, and year-round production.',
            icon: '🏠',
            price: 2499,
            duration: '5 weeks',
            modules: 13,
            students: 678,
            rating: 4.8,
            level: 'Advanced',
            category: 'Crop Protection',
            tags: ['Advanced', 'Protected Farming']
        },
        {
            id: 8,
            title: 'Marketing & Selling Farm Produce',
            instructor: 'Prof. Anita Desai',
            description: 'Learn pricing strategies, market access, online selling, and farmer-to-consumer models.',
            icon: '📊',
            price: 'Free',
            duration: '4 weeks',
            modules: 9,
            students: 1456,
            rating: 4.5,
            level: 'Beginner',
            category: 'Business',
            tags: ['Beginner', 'Business']
        }
    ];

    const filteredCourses = selectedCategory === 'All'
        ? courses
        : courses.filter(course => course.category === selectedCategory);

    return (
        <div className="max-w-7xl mx-auto py-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-nature-900">Agriculture Courses</h1>
                    <span className="text-2xl">📚</span>
                </div>
                <p className="text-gray-600">Learn from experts and grow your farming knowledge</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <BookOpen className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">45+</p>
                            <p className="text-sm text-gray-600">Courses</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">12K+</p>
                            <p className="text-sm text-gray-600">Students</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-50 rounded-lg">
                            <Award className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">25+</p>
                            <p className="text-sm text-gray-600">Experts</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <Video className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">500+</p>
                            <p className="text-sm text-gray-600">Videos</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="bg-gray-100 rounded-xl p-1 mb-6 flex gap-1 overflow-x-auto scrollbar-hide">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={cn(
                            "px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                            selectedCategory === category
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        {/* Icon and Price */}
                        <div className="p-6 pb-4">
                            <div className="flex items-start justify-between mb-4">
                                <div className="text-5xl">{course.icon}</div>
                                {course.price === 'Free' ? (
                                    <span className="px-3 py-1 bg-green-700 text-white rounded-full text-xs font-bold">
                                        Free
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold">
                                        ₹{course.price.toLocaleString()}
                                    </span>
                                )}
                            </div>

                            {/* Title and Instructor */}
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                {course.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">by {course.instructor}</p>

                            {/* Description */}
                            <p className="text-sm text-gray-700 mb-4 line-clamp-2 leading-relaxed">
                                {course.description}
                            </p>

                            {/* Course Info */}
                            <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FileText className="h-3.5 w-3.5" />
                                    <span>{course.modules} modules</span>
                                </div>
                            </div>

                            {/* Students and Rating */}
                            <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                                <div className="flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5" />
                                    <span>{course.students.toLocaleString()} students</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium text-gray-900">{course.rating}</span>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex gap-2 mb-4">
                                {course.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className={cn(
                                            "px-2.5 py-1 rounded-full text-xs font-medium",
                                            index === 0
                                                ? "bg-gray-100 text-gray-700 border border-gray-200"
                                                : "bg-green-50 text-green-700 border border-green-200"
                                        )}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Action Button */}
                            <button className="w-full py-3 bg-nature-700 text-white rounded-lg font-semibold hover:bg-nature-800 transition-colors">
                                {course.price === 'Free' ? 'Enroll Now' : 'Buy Course'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No courses found</h3>
                    <p className="text-gray-500">Try selecting a different category</p>
                </div>
            )}
        </div>
    );
};

export default CoursesPage;
