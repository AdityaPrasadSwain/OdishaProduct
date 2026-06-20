import React from 'react';

const CountryMap = ({ data }) => {
    // Placeholder for map visualization since we don't have a map library installed
    // and implementing a full D3/SVG map is out of scope for a quick fix.

    const stats = data || [
        { country: 'India', value: 75, color: 'bg-primary' },
        { country: 'USA', value: 15, color: 'bg-purple-500' },
        { country: 'UK', value: 5, color: 'bg-pink-500' },
        { country: 'Others', value: 5, color: 'bg-bg-dark' },
    ];

    return (
        <div className="bg-bg-surface dark:bg-bg-dark p-6 rounded-xl shadow-sm border border-border dark:border-border">
            <h3 className="text-lg font-semibold text-text-primary dark:text-text-onDark mb-6">Sales by Country</h3>
            <div className="space-y-4">
                {stats.map((item, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary dark:text-text-secondary">{item.country}</span>
                            <span className="font-semibold text-text-primary dark:text-text-onDark">{item.value}%</span>
                        </div>
                        <div className="w-full bg-bg-band dark:bg-bg-dark rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${item.color || 'bg-primary'}`}
                                style={{ width: `${item.value}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 p-4 bg-bg-page dark:bg-bg-dark/50 rounded-lg text-center">
                <p className="text-sm text-text-secondary dark:text-text-secondary">Map visualization coming soon</p>
            </div>
        </div>
    );
};

export default CountryMap;
