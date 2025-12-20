import React from 'react';
import { motion } from 'motion/react';
import { VARIANTS } from '../../utils/animations';

const ScrollReveal = ({ children, variant = 'fadeInUp', delay = 0, className = '' }) => {
    return (
        <motion.div
            variants={VARIANTS[variant]}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
