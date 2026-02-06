import React from 'react';
import FeatureCard from './feature-card';
import {
    Users,
    ShoppingCart,
    TrendingUp,
    Tractor,
    Sprout,
    Calculator,
    Wallet,
    CloudSun,
    BookOpen,
    Stethoscope,
    Megaphone,
    Store
} from 'lucide-react';

const quickAccessItems = [
    { name: 'Community', icon: Users, path: '/community' },
    { name: 'Buy & Sell', icon: ShoppingCart, path: '/buy-sell' },
    { name: 'Market Prices', icon: TrendingUp, path: '/market-prices', className: "bg-nature-700 border-nature-700 text-white hover:bg-nature-800" }, // Special style for active/highlighted
    { name: 'Rentals', icon: Tractor, path: '/rentals' },
    { name: 'Farm Planner', icon: Sprout, path: '/farm-plan' },
    { name: 'Calculator', icon: Calculator, path: '/calculator' },
    { name: 'Expenses', icon: Wallet, path: '/expenses' },
    { name: 'Weather', icon: CloudSun, path: '/weather' },
    { name: 'Courses', icon: BookOpen, path: '/courses' },
    { name: 'Vet', icon: Stethoscope, path: '/vet' },
    { name: 'Events', icon: Megaphone, path: '/events' },
    { name: 'Shops', icon: Store, path: '/shops' },
];

const QuickAccessGrid = () => {
    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Access</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {quickAccessItems.map((item) => (
                    <FeatureCard
                        key={item.name}
                        {...item}
                        isActive={item.name === 'Market Prices'}
                    />
                ))}
            </div>
        </div>
    );
};

export default QuickAccessGrid;
