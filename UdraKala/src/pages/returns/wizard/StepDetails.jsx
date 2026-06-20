import React from 'react';

const StepDetails = ({ formData, updateFormData, order }) => {
    return (
        <div className="space-y-6">
            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-2">
                    Description / Comments
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    rows="4"
                    className="w-full p-3 border border-border dark:border-border rounded-xl bg-bg-surface dark:bg-bg-dark text-text-primary dark:text-text-onDark focus:ring-2 focus:ring-primary transition"
                    placeholder="Please explain the issue in detail..."
                ></textarea>
            </div>

            {/* Refund Method (Only for RETURN) */}
            {formData.type === 'RETURN' && (
                <div>
                    <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-3">
                        Refund Method
                    </label>
                    <div className="space-y-3">
                        {['UPI', 'BANK_TRANSFER', 'WALLET'].map((method) => (
                            <div
                                key={method}
                                onClick={() => updateFormData('refundMethod', method)}
                                className={`flex items-center p-4 border rounded-xl cursor-pointer transition
                                    ${formData.refundMethod === method
                                        ? 'border-primary bg-indigo-50 dark:bg-primary-hover/20'
                                        : 'border-border dark:border-border'}`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                                     ${formData.refundMethod === method ? 'border-primary' : 'border-border'}`}>
                                    {formData.refundMethod === method && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                                </div>
                                <div>
                                    <span className="font-medium text-text-primary dark:text-text-onDark block">
                                        {method === 'UPI' ? 'UPI (GooglePay / PhonePe)' :
                                            method === 'BANK_TRANSFER' ? 'Bank Transfer' : 'Wallet / Store Credit'}
                                    </span>
                                    {method === 'WALLET' && <span className="text-xs text-status-success">Instant Refund</span>}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dynamic Inputs for Refund Details */}
                    {formData.refundMethod === 'UPI' && (
                        <div className="mt-4">
                            <label className="block text-xs font-medium text-text-secondary mb-1">UPI ID</label>
                            <input
                                type="text"
                                placeholder="example@okaxis"
                                value={formData.refundDetails}
                                onChange={(e) => updateFormData('refundDetails', e.target.value)}
                                className="w-full p-2 border rounded-lg dark:bg-bg-dark dark:border-border dark:text-text-onDark"
                            />
                        </div>
                    )}
                    {formData.refundMethod === 'BANK_TRANSFER' && (
                        <div className="mt-4">
                            <label className="block text-xs font-medium text-text-secondary mb-1">Bank Details (Account No, IFSC)</label>
                            <input
                                type="text"
                                placeholder="Acc: 123456... | IFSC: ..."
                                value={formData.refundDetails}
                                onChange={(e) => updateFormData('refundDetails', e.target.value)}
                                className="w-full p-2 border rounded-lg dark:bg-bg-dark dark:border-border dark:text-text-onDark"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Pickup Address */}
            <div>
                <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-2">
                    Pickup Address
                </label>
                <div className="p-4 bg-bg-page dark:bg-bg-dark rounded-xl border border-border dark:border-border">
                    <p className="text-sm text-text-secondary dark:text-text-secondary whitespace-pre-line">
                        {formData.pickupAddress || order?.shippingAddress}
                    </p>
                    {/* Placeholder for change address functionality if needed later */}
                    <button className="text-xs text-primary font-medium mt-2 hover:underline">
                        Change Address is not available yet (Uses Shipping Address)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StepDetails;
