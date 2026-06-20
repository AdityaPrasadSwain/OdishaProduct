import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ChevronUp, ChevronDown, CheckSquare, Square } from 'lucide-react';

export const GlassTableWrapper = ({ children, className = '' }) => (
    <div className={`bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-lg shadow-black/5 dark:shadow-2xl dark:shadow-black/40 overflow-hidden ${className}`}>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                {children}
            </table>
        </div>
    </div>
);

export const GlassThead = ({ children, className = '' }) => (
    <thead>
        <tr className={`bg-white/40 dark:bg-black/20 backdrop-blur-md ${className}`}>
            {children}
        </tr>
    </thead>
);

export const GlassTh = ({ children, sortable, sortDirection, onClick, className = '' }) => (
    <th 
        onClick={sortable ? onClick : undefined}
        className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-text-secondary/80 border-b border-white/20 dark:border-white/5 ${sortable ? 'cursor-pointer hover:text-text-primary dark:hover:text-white transition-colors select-none' : ''} ${className}`}
    >
        <div className="flex items-center gap-1.5">
            {children}
            {sortable && (
                <div className="flex flex-col">
                    <ChevronUp size={12} className={sortDirection === 'asc' ? 'text-primary' : 'opacity-30'} />
                    <ChevronDown size={12} className={sortDirection === 'desc' ? 'text-primary' : 'opacity-30 -mt-1'} />
                </div>
            )}
        </div>
    </th>
);

export const GlassTbody = ({ children, className = '' }) => (
    <tbody className={`divide-y divide-white/20 dark:divide-white/5 ${className}`}>
        {children}
    </tbody>
);

const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
};

export const GlassTr = ({ children, index = 0, className = '' }) => (
    <Motion.tr
        initial="hidden"
        animate="visible"
        variants={rowVariants}
        transition={{ duration: 0.2, delay: index * 0.05, ease: "easeOut" }}
        className={`group hover:bg-white/40 dark:hover:bg-white/10 transition-all duration-200 ${index % 2 === 0 ? 'bg-transparent' : 'bg-white/20 dark:bg-white/5'} ${className}`}
    >
        {children}
    </Motion.tr>
);

export const GlassTd = ({ children, className = '' }) => (
    <td className={`px-6 py-4 text-sm text-text-primary dark:text-white/90 ${className}`}>
        {children}
    </td>
);

export const GlassBadge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
        warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
        danger: 'bg-red-500/15 text-red-600 dark:text-red-400',
        primary: 'bg-primary/15 text-primary',
        default: 'bg-gray-500/15 text-gray-600 dark:text-gray-300'
    };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variants[variant] || variants.default} ${className}`}>
            {children}
        </span>
    );
};

export const GlassIconButton = ({ icon: Icon, onClick, colorClass = 'text-text-secondary hover:text-primary dark:hover:text-white', className = '' }) => (
    <button
        onClick={onClick}
        className={`p-2 rounded-full bg-white/20 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/20 border border-transparent hover:border-white/40 dark:hover:border-white/10 shadow-sm transition-all duration-200 ${colorClass} ${className}`}
    >
        <Icon size={16} />
    </button>
);
