import React from 'react';

const Badge = ({ children, variant = 'primary', className = "" }) => {
    const variants = {
        primary: "bg-primary-light text-primary",
        secondary: "bg-secondary-light text-secondary",
        success: "bg-success-light text-success",
        danger: "bg-danger-light text-danger",
        warning: "bg-warning-light text-warning",
        info: "bg-info-light text-info",
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
