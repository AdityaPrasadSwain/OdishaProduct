import React from 'react';
import { motion } from 'motion/react';
import { Construction } from 'lucide-react';

const PlaceholderPage = ({ title }) => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-bg-surface dark:bg-bg-dark p-10 rounded-3xl shadow-lg dark:shadow-black/50 border border-border dark:border-border flex flex-col items-center max-w-md w-full"
            >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Construction size={40} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-text-primary dark:text-text-onDark mb-4">{title}</h1>
                <p className="text-text-secondary dark:text-text-secondary leading-relaxed">
                    This page is currently under construction. Check back soon for exciting updates!
                </p>
            </motion.div>
        </div>
    );
};

export default PlaceholderPage;
