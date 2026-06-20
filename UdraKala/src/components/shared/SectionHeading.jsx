import React from 'react';
import { motion } from 'motion/react';

const SectionHeading = ({ title, subtitle, accentWord }) => {
    // Helper to highlight a specific word if accentWord is provided
    const renderTitle = () => {
        if (!accentWord) return title;
        
        const parts = title.split(new RegExp(`(${accentWord})`, 'gi'));
        return (
            <>
                {parts.map((part, i) => 
                    part.toLowerCase() === accentWord.toLowerCase() ? (
                        <span key={i} className="text-primary">{part}</span>
                    ) : (
                        <span key={i}>{part}</span>
                    )
                )}
            </>
        );
    };

    return (
        <div className="mb-10 sm:mb-12">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sans tracking-tight text-text-primary dark:text-text-onDark mb-3 leading-tight"
            >
                {renderTitle()}
            </motion.h2>
            {subtitle && (
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-text-secondary max-w-2xl"
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );
};

export default SectionHeading;
