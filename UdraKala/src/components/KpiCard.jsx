import React from 'react';
import * as Icons from 'lucide-react';

const KpiCard = ({ title, value, delta, icon }) => {
    const IconComponent = Icons[icon] || Icons.HelpCircle;

    const deltaString = typeof delta === 'number' ? `${delta > 0 ? '+' : ''}${delta}%` : delta;
    const isPositive = (typeof delta === 'number' && delta > 0) || (typeof delta === 'string' && delta.startsWith('+'));
    const isNegative = (typeof delta === 'number' && delta < 0) || (typeof delta === 'string' && delta.startsWith('-'));

    // Use deltaString for display
    const displayDelta = deltaString;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</h3>
                </div>
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <IconComponent className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
            </div>
            {delta && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={`font-medium ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'}`}>
                        {displayDelta}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">from last month</span>
                </div>
            )}
        </div>
    );
};

export default KpiCard;
