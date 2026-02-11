import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../lib/utils';

const SearchBarWithAutocomplete = ({
    value,
    onChange,
    placeholder = "Search...",
    suggestions = [],
    onSuggestionClick,
    className = ""
}) => {
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        onChange(newValue);
        setShowSuggestions(newValue.length >= 2 && suggestions.length > 0);
    };

    const handleSuggestionSelect = (suggestion) => {
        if (onSuggestionClick) {
            onSuggestionClick(suggestion);
        } else {
            onChange(suggestion);
        }
        setShowSuggestions(false);
    };

    const handleClear = () => {
        onChange('');
        setShowSuggestions(false);
    };

    return (
        <div className={cn("relative", className)}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(value.length >= 2 && suggestions.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder={placeholder}
                className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all"
            />

            {/* Clear button */}
            {value && (
                <button
                    onClick={handleClear}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <X className="h-4 w-4 text-gray-400" />
                </button>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionSelect(suggestion)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 flex items-center gap-3"
                        >
                            <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <div className="flex-1">
                                <div className="text-gray-900 font-medium">
                                    {typeof suggestion === 'string' ? suggestion : suggestion.name}
                                </div>
                                {typeof suggestion === 'object' && suggestion.description && (
                                    <div className="text-xs text-gray-500 mt-0.5">
                                        {suggestion.description}
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBarWithAutocomplete;
