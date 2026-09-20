import React from 'react';
import { motion } from 'motion/react';
import { INTERACTIONS } from '../../utils/animations';

const Button = ({ children, variant = 'primary', size = 'md', className = "", ...props }) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]";

    const variants = {
        primary: "bg-primary text-text-onPrimary hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/30 focus:ring-primary",
        secondary: "bg-secondary text-text-onPrimary hover:bg-secondary-hover focus:ring-secondary",
        outline: "border-2 border-primary text-primary hover:bg-primary-light focus:ring-primary",
        ghost: "bg-transparent text-text-secondary hover:bg-bg-muted hover:text-text-primary",
        danger: "bg-status-error text-text-onPrimary hover:bg-red-800 hover:shadow-lg hover:shadow-red-500/30 focus:ring-status-error",
        success: "bg-status-success text-text-onPrimary hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/30 focus:ring-status-success",
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
