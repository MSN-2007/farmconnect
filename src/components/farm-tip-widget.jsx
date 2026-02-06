import React from 'react';
import { Lightbulb } from 'lucide-react';

const FarmTipWidget = () => {
    return (
        <div className="bg-nature-50 p-6 rounded-2xl border border-nature-100 flex gap-4 h-48">
            <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-nature-200 rounded-full flex items-center justify-center text-nature-700">
                    <Lightbulb className="h-6 w-6" />
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-nature-900 mb-2">Today's Farm Tip</h3>
                <p className="text-nature-800 text-sm leading-relaxed">
                    Early morning is the best time for irrigation. Plants absorb water more efficiently when temperatures are cooler, reducing water loss through evaporation.
                </p>
            </div>
        </div>
    );
};

export default FarmTipWidget;
