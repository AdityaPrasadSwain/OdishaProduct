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
        <div className="bg-bg-surface dark:bg-bg-dark p-6 rounded-xl shadow-sm border border-border dark:border-border">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-text-secondary dark:text-text-secondary">{title}</p>
                    <h3 className="text-2xl font-bold text-text-primary dark:text-text-onDark mt-2">{value}</h3>
                </div>
                <div className="p-2 bg-indigo-50 dark:bg-primary-hover/20 rounded-lg">
                    <IconComponent className="w-6 h-6 text-primary dark:text-primary" />
                </div>
            </div>
            {delta && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={`font-medium ${isPositive ? 'text-status-success' : isNegative ? 'text-status-error' : 'text-text-secondary'}`}>
                        {displayDelta}
                    </span>
                    <span className="text-text-secondary dark:text-text-secondary ml-2">from last month</span>
                </div>
            )}
        </div>
    );
};

export default KpiCard;
