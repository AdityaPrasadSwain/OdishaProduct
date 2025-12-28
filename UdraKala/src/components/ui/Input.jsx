import React from 'react';

const Input = ({ label, id, error, className = "", multiline = false, ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-dark dark:text-white mb-1">
                    {label}
                </label>
            )}
            {multiline ? (
                <textarea
                    id={id}
                    className={`w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow ${error ? 'border-danger focus:ring-danger/50' : ''} ${className}`}
                    {...props}
                />
            ) : (
                <input
                    id={id}
                    className={`w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow ${error ? 'border-danger focus:ring-danger/50' : ''} ${className}`}
                    {...props}
                />
            )}
            {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        </div>
    );
};

export default Input;
