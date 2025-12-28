import React from 'react';

const reasons = [
    { id: 'DAMAGED', label: 'Product Damaged', icon: '💔' },
    { id: 'WRONG_PRODUCT', label: 'Wrong Product Received', icon: '📦' },
    { id: 'QUALITY_ISSUE', label: 'Quality Issue', icon: '🧶' },
    { id: 'NOT_AS_DESCRIBED', label: 'Not as Described', icon: '📜' },
    { id: 'MISSING_PARTS', label: 'Missing Items', icon: '🧩' },
    { id: 'OTHER', label: 'Other', icon: '📝' },
];

const StepReasonSelection = ({ formData, updateFormData }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {reasons.map((r) => (
                    <div
                        key={r.id}
                        onClick={() => updateFormData('reason', r.id)}
                        className={`cursor-pointer p-4 rounded-xl border transition-all text-center
                            ${formData.reason === r.id
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm'
                                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        <div className="text-3xl mb-3">{r.icon}</div>
                        <div className={`font-medium text-sm ${formData.reason === r.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}`}>
                            {r.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Warning for Proof */}
            {(formData.reason === 'DAMAGED' || formData.reason === 'WRONG_PRODUCT') && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
                    <span className="text-amber-500 mr-2">⚠️</span>
                    <p className="text-sm text-amber-800">
                        For <strong>{reasons.find(r => r.id === formData.reason)?.label}</strong>, you will be required to upload a proof image in the next step.
                    </p>
                </div>
            )}
        </div>
    );
};

export default StepReasonSelection;
