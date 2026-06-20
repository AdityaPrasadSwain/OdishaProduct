import React from 'react';
import { motion } from 'motion/react';

const Card = ({ children, title, className = "", action }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className={`bg-bg-surface dark:bg-bg-dark p-6 rounded-2xl shadow-sm dark:shadow-lg dark:shadow-black/50 hover:shadow-xl hover:dark:shadow-2xl hover:dark:shadow-black/60 border border-border dark:border-transparent transition-all duration-300 ${className}`}
        >
            {(title || action) && (
                <div className="flex justify-between items-center mb-4">
                    {title && <h3 className="text-lg font-semibold text-dark dark:text-text-onDark">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </motion.div>
    );
};

export default Card;
