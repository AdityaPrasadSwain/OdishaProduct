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
        if (typeof value === 'number') {
            const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
            return controls.stop;
        } else {
            setDisplayValue(value);
        }
    }, [value]);

    useEffect(() => {
        // Only safely subscribe if we are actually animating a number
        if (typeof value === 'number') {
            const unsubscribe = rounded.on("change", v => setDisplayValue(v));
            return unsubscribe;
        }
    }, [rounded, value]);

    const colorClasses = {
        blue: "bg-blue-50 text-primary dark:bg-primary-hover/20 dark:text-primary",
        green: "bg-green-50 text-status-success dark:bg-green-900/20 dark:text-green-400",
        orange: "bg-bg-band text-primary dark:bg-primary-hover/20 dark:text-primary",
        purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-bg-surface dark:bg-bg-dark p-6 rounded-xl border border-border dark:border-transparent shadow-sm dark:shadow-md dark:shadow-black/40 hover:shadow-md hover:dark:shadow-lg hover:dark:shadow-black/60 transition-shadow"
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-text-secondary dark:text-text-secondary mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-text-primary dark:text-text-onDark">
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
                    <span className={`flex items-center font-medium ${trend === 'up' ? 'text-status-success dark:text-green-400' : 'text-status-error dark:text-red-400'}`}>
                        {trend === 'up' ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                        {trendValue}
                    </span>
                    <span className="text-text-secondary ml-2">vs last month</span>
                </div>
            )}
        </motion.div>
    );
};

export default StatsCard;
