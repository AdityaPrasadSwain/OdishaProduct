import React from 'react';

const StepReview = ({ formData, order }) => {
    return (
        <div className="space-y-6">
            <div className="bg-bg-page dark:bg-bg-dark/50 p-6 rounded-2xl border border-border dark:border-border">
                <h3 className="text-lg font-bold text-text-primary dark:text-text-onDark mb-4">Summary</h3>

                <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-text-secondary">Request Type</span>
                        <span className="font-medium text-primary">{formData.type}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-text-secondary">Reason</span>
                        <span className="font-medium text-text-primary dark:text-text-onDark">{formData.reason}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-text-secondary">Images Uploaded</span>
                        <span className="font-medium text-text-primary dark:text-text-onDark">{formData.proofImages.length}</span>
                    </div>

                    {formData.type === 'RETURN' && (
                        <>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Refund Method</span>
                                <span className="font-medium text-text-primary dark:text-text-onDark">{formData.refundMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Refund To</span>
                                <span className="font-medium text-text-primary dark:text-text-onDark">{formData.refundDetails || 'N/A'}</span>
                            </div>
                        </>
                    )}

                    <div className="border-t pt-3 mt-3">
                        <span className="text-text-secondary block mb-1">Pickup Address</span>
                        <p className="text-text-primary dark:text-text-secondary">
                            {formData.pickupAddress || order?.shippingAddress}
                        </p>
                    </div>

                    <div className="border-t pt-3 mt-3">
                        <span className="text-text-secondary block mb-1">Comments</span>
                        <p className="text-text-primary dark:text-text-secondary italic">
                            "{formData.description || 'No comments'}"
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-start bg-blue-50 text-primary p-4 rounded-xl text-sm">
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
