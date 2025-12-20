import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform, animate } from 'motion/react';
// import { Card } from '../ui/Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCard = ({ title, value, prefix = "", suffix = "", icon: Icon, trend, trendValue, color = "blue" }) => {
    // Count-up animation logic
    const count = useMotionValue(0);
    const rounded = useTransform(count, latest => Math.round(latest));
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
        return controls.stop;
    }, [value]);

    useEffect(() => {
        const unsubscribe = rounded.on("change", v => setDisplayValue(v));
        return unsubscribe;
    }, [rounded]);

    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
        green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
        orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
        purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {prefix}{displayValue.toLocaleString()}{suffix}
                    </h3>
                </div>
                {Icon && (
                    <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                        <Icon size={20} />
                    </div>
                )}
            </div>

            {/* Trend Indicator */}
            {(trend || trendValue) && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={`flex items-center font-medium ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {trend === 'up' ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                        {trendValue}
                    </span>
                    <span className="text-gray-400 ml-2">vs last month</span>
                </div>
            )}
        </motion.div>
    );
};

export default StatsCard;
