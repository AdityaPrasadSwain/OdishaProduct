import React from 'react';
import { motion } from 'motion/react';

const Card = ({ children, title, className = "", action }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.3 }}
            className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-card border border-gray-200 dark:border-gray-700 ${className}`}
        >
            {(title || action) && (
                <div className="flex justify-between items-center mb-4">
                    {title && <h3 className="text-lg font-semibold text-dark dark:text-white">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </motion.div>
    );
};

export default Card;
