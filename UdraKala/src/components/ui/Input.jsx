import React from 'react';

const Input = ({ label, id, error, className = "", multiline = false, ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-dark dark:text-text-onDark mb-1">
                    {label}
                </label>
            )}
            {multiline ? (
                <textarea
                    id={id}
                    className={`w-full px-4 py-2 bg-bg-surface dark:bg-bg-dark/50 border border-border dark:border-transparent shadow-sm dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] rounded-md text-text-primary dark:text-text-onDark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow ${error ? 'border-danger focus:ring-danger/50' : ''} ${className}`}
                    {...props}
                />
            ) : (
                <input
                    id={id}
                    className={`w-full px-4 py-2 bg-bg-surface dark:bg-bg-dark/50 border border-border dark:border-transparent shadow-sm dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] rounded-md text-text-primary dark:text-text-onDark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow ${error ? 'border-danger focus:ring-danger/50' : ''} ${className}`}
                    {...props}
                />
            )}
            {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        </div>
    );
};

export default Input;
