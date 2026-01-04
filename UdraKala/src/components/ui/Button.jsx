import React from 'react';
import { motion } from 'motion/react';
import { INTERACTIONS } from '../../utils/animations';

const Button = ({ children, variant = 'primary', size = 'md', className = "", ...props }) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]";

    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30 focus:ring-primary-500",
        secondary: "bg-secondary-800 text-white hover:bg-secondary-900 focus:ring-secondary-500",
        outline: "border-2 border-primary-600 text-primary-700 hover:bg-primary-50 focus:ring-primary-500",
        ghost: "bg-transparent text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 dark:text-gray-300 dark:hover:bg-secondary-800 dark:hover:text-white",
        danger: "bg-danger text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/30 focus:ring-danger",
        success: "bg-success text-white hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/30 focus:ring-success",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs tracking-wide uppercase",
        md: "px-5 py-2.5 text-sm",
        lg: "px-8 py-3.5 text-base font-semibold",
        xl: "px-10 py-4 text-lg font-bold",
    };

    return (
        <motion.button
            whileHover={INTERACTIONS.hoverScale}
            whileTap={INTERACTIONS.tapPress}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
