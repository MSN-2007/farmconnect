import React from 'react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const FeatureCard = ({ name, icon: Icon, path, className, isActive }) => {
    return (
        <Link
            to={path}
            className={cn(
                "p-6 rounded-xl shadow-sm border flex flex-col items-center justify-center gap-4 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg",
                isActive
                    ? "bg-nature-700 border-nature-700 text-white"
                    : "bg-white border-gray-100 hover:border-nature-300",
                className
            )}
        >
            <div className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center transition-colors",
                isActive
                    ? "bg-white/20 text-white"
                    : "bg-nature-50 text-nature-600 group-hover:bg-nature-100"
            )}>
                <Icon className="h-6 w-6" />
            </div>
            <span className={cn(
                "font-medium group-hover:text-nature-700",
                isActive ? "text-white group-hover:text-white" : "text-gray-700"
            )}>{name}</span>
        </Link>
    );
};

export default FeatureCard;
