import React from 'react';
import { motion } from 'motion/react';
import { INTERACTIONS } from '../../utils/animations';

const Button = ({ children, variant = 'primary', size = 'md', className = "", ...props }) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary text-white hover:bg-blue-600 focus:ring-primary shadow-md shadow-primary/20",
        secondary: "bg-secondary text-white hover:bg-sky-500 focus:ring-secondary",
        outline: "border border-primary text-primary hover:bg-primary-light",
        danger: "bg-danger text-white hover:bg-red-500 focus:ring-danger",
        success: "bg-success text-white hover:bg-teal-500 focus:ring-success",
        ghost: "bg-transparent text-dark hover:bg-gray-100 dark:text-white dark:hover:bg-dark-light",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
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
