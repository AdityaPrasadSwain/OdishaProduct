import React from 'react';
import { motion } from 'motion/react';
import { VARIANTS } from '../../utils/animations';

const PageTransition = ({ children }) => {
    return (
        <motion.div
            variants={VARIANTS.page}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
