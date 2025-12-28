import React from 'react';

const StepReview = ({ formData, order }) => {
    return (
        <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Summary</h3>

                <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Request Type</span>
                        <span className="font-medium text-indigo-600">{formData.type}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Reason</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formData.reason}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Images Uploaded</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formData.proofImages.length}</span>
                    </div>

                    {formData.type === 'RETURN' && (
                        <>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Refund Method</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formData.refundMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Refund To</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formData.refundDetails || 'N/A'}</span>
                            </div>
                        </>
                    )}

                    <div className="border-t pt-3 mt-3">
                        <span className="text-gray-500 block mb-1">Pickup Address</span>
                        <p className="text-gray-800 dark:text-gray-200">
                            {formData.pickupAddress || order?.shippingAddress}
                        </p>
                    </div>

                    <div className="border-t pt-3 mt-3">
                        <span className="text-gray-500 block mb-1">Comments</span>
                        <p className="text-gray-800 dark:text-gray-200 italic">
                            "{formData.description || 'No comments'}"
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-start bg-blue-50 text-blue-800 p-4 rounded-xl text-sm">
                <span className="mr-2">ℹ️</span>
                <p>
                    By submitting this request, you agree to our Return & Replacement Policy.
                    The pickup will be scheduled within 24-48 hours after approval.
                </p>
            </div>
        </div>
    );
};

export default StepReview;
