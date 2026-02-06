import React from 'react';
import { CloudSun, Droplets, Wind } from 'lucide-react';

const WeatherWidget = () => {
    return (
        <div className="bg-orange-50 p-6 rounded-2xl flex flex-col justify-between h-48 border border-orange-100">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm font-medium">Today's Weather</p>
                    <div className="flex items-center gap-3 mt-2">
                        <h2 className="text-4xl font-bold text-gray-800">28°C</h2>
                        <CloudSun className="h-8 w-8 text-orange-400" />
                    </div>
                    <p className="text-gray-600 mt-1">Partly Cloudy</p>
                </div>

                <div className="text-right space-y-2">
                    <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
                        <span>75%</span>
                        <Droplets className="h-4 w-4 text-orange-400" />
                    </div>
                    <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
                        <span>12 km/h</span>
                        <Wind className="h-4 w-4 text-orange-400" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
