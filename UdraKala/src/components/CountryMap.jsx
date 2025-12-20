import React from 'react';

const CountryMap = ({ data }) => {
    // Placeholder for map visualization since we don't have a map library installed
    // and implementing a full D3/SVG map is out of scope for a quick fix.

    const stats = data || [
        { country: 'India', value: 75, color: 'bg-blue-500' },
        { country: 'USA', value: 15, color: 'bg-purple-500' },
        { country: 'UK', value: 5, color: 'bg-pink-500' },
        { country: 'Others', value: 5, color: 'bg-gray-500' },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Sales by Country</h3>
            <div className="space-y-4">
                {stats.map((item, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300">{item.country}</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{item.value}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${item.color || 'bg-indigo-600'}`}
                                style={{ width: `${item.value}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Map visualization coming soon</p>
            </div>
        </div>
    );
};

export default CountryMap;
