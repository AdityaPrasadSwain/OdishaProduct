import React from 'react';

const StepDetails = ({ formData, updateFormData, order }) => {
    return (
        <div className="space-y-6">
            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description / Comments
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    rows="4"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
                    placeholder="Please explain the issue in detail..."
                ></textarea>
            </div>

            {/* Refund Method (Only for RETURN) */}
            {formData.type === 'RETURN' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Refund Method
                    </label>
                    <div className="space-y-3">
                        {['UPI', 'BANK_TRANSFER', 'WALLET'].map((method) => (
                            <div
                                key={method}
                                onClick={() => updateFormData('refundMethod', method)}
                                className={`flex items-center p-4 border rounded-xl cursor-pointer transition
                                    ${formData.refundMethod === method
                                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                                        : 'border-gray-200 dark:border-gray-700'}`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                                     ${formData.refundMethod === method ? 'border-indigo-600' : 'border-gray-400'}`}>
                                    {formData.refundMethod === method && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                                </div>
                                <div>
                                    <span className="font-medium text-gray-900 dark:text-white block">
                                        {method === 'UPI' ? 'UPI (GooglePay / PhonePe)' :
                                            method === 'BANK_TRANSFER' ? 'Bank Transfer' : 'Wallet / Store Credit'}
                                    </span>
                                    {method === 'WALLET' && <span className="text-xs text-green-600">Instant Refund</span>}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dynamic Inputs for Refund Details */}
                    {formData.refundMethod === 'UPI' && (
                        <div className="mt-4">
                            <label className="block text-xs font-medium text-gray-500 mb-1">UPI ID</label>
                            <input
                                type="text"
                                placeholder="example@okaxis"
                                value={formData.refundDetails}
                                onChange={(e) => updateFormData('refundDetails', e.target.value)}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    )}
                    {formData.refundMethod === 'BANK_TRANSFER' && (
                        <div className="mt-4">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Bank Details (Account No, IFSC)</label>
                            <input
                                type="text"
                                placeholder="Acc: 123456... | IFSC: ..."
                                value={formData.refundDetails}
                                onChange={(e) => updateFormData('refundDetails', e.target.value)}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Pickup Address */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pickup Address
                </label>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {formData.pickupAddress || order?.shippingAddress}
                    </p>
                    {/* Placeholder for change address functionality if needed later */}
                    <button className="text-xs text-indigo-600 font-medium mt-2 hover:underline">
                        Change Address is not available yet (Uses Shipping Address)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StepDetails;
