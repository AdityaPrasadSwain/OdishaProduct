import React from 'react';
import { ArrowPathIcon, BanknotesIcon } from '@heroicons/react/24/outline';

const StepTypeSelection = ({ formData, updateFormData }) => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Return Option */}
                <div
                    onClick={() => updateFormData('type', 'RETURN')}
                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden group
                        ${formData.type === 'RETURN'
                            ? 'border-primary bg-indigo-50 dark:bg-primary-hover/20'
                            : 'border-border dark:border-border hover:border-primary hover:shadow-md'}`}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${formData.type === 'RETURN' ? 'bg-primary text-text-onDark' : 'bg-bg-band dark:bg-bg-dark text-text-secondary dark:text-text-secondary'}`}>
                            <BanknotesIcon className="w-8 h-8" />
                        </div>
                        {formData.type === 'RETURN' && (
                            <div className="bg-primary text-text-onDark text-xs px-2 py-1 rounded-full">
                                Selected
                            </div>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-text-primary dark:text-text-onDark mb-2">Return Product</h3>
                    <p className="text-text-secondary dark:text-text-secondary text-sm">
                        Return the product and get a full refund to your original payment method, bank account, or wallet.
                    </p>
                </div>

                {/* Replace Option */}
                <div
                    onClick={() => updateFormData('type', 'REPLACE')}
                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden group
                        ${formData.type === 'REPLACE'
                            ? 'border-primary bg-indigo-50 dark:bg-primary-hover/20'
                            : 'border-border dark:border-border hover:border-primary hover:shadow-md'}`}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${formData.type === 'REPLACE' ? 'bg-primary text-text-onDark' : 'bg-bg-band dark:bg-bg-dark text-text-secondary dark:text-text-secondary'}`}>
                            <ArrowPathIcon className="w-8 h-8" />
                        </div>
                        {formData.type === 'REPLACE' && (
                            <div className="bg-primary text-text-onDark text-xs px-2 py-1 rounded-full">
                                Selected
                            </div>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-text-primary dark:text-text-onDark mb-2">Replace Product</h3>
                    <p className="text-text-secondary dark:text-text-secondary text-sm">
                        Exchange the product for a different size, color, or a fresh piece if damaged.
                    </p>
                </div>
            </div>

            {!formData.type && (
                <p className="text-status-error text-sm mt-4 text-center">Please select an option to proceed.</p>
            )}
        </div>
    );
};

export default StepTypeSelection;
