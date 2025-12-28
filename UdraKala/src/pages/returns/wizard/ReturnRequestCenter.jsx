import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createReturnRequest } from '../../../api/returnApi'; // Ensure this path is correct
// Import steps (Placeholders for now, will create next)
import StepTypeSelection from './StepTypeSelection';
import StepReasonSelection from './StepReasonSelection';
import StepProofUpload from './StepProofUpload';
import StepDetails from './StepDetails';
import StepReview from './StepReview';

const ReturnRequestCenter = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { order, orderItem } = location.state || {}; // Expect order context

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        type: '', // RETURN | REPLACE
        reason: '',
        description: '',
        proofImages: [], // Array of files
        refundMethod: '', // UPI | BANK_TRANSFER | WALLET
        refundDetails: '', // JSON string or text
        pickupAddress: order?.shippingAddress || '', // Default to shipping
        newProductId: null, // For replacement logic if needed
    });

    if (!order || !orderItem) {
        return <div className="p-8 text-center text-red-500">Invalid access. Please select an order first.</div>;
    }

    const nextStep = () => {
        // Validation Logic
        if (currentStep === 1 && !formData.type) {
            Swal.fire('Required', 'Please select whether you want to Return or Replace the product.', 'warning');
            return;
        }
        if (currentStep === 2 && !formData.reason) {
            Swal.fire('Required', 'Please select a reason for your request.', 'warning');
            return;
        }
        if (currentStep === 3) {
            const requiresProof = ['DAMAGED', 'WRONG_PRODUCT'].includes(formData.reason);
            if (requiresProof && formData.proofImages.length === 0) {
                Swal.fire('Proof Required', 'Please upload at least one image as proof for the selected reason.', 'warning');
                return;
            }
        }
        if (currentStep === 4) {
            if (!formData.description) {
                Swal.fire('Required', 'Please provide a description of the issue.', 'warning');
                return;
            }
            if (formData.type === 'RETURN' && !formData.refundMethod) {
                Swal.fire('Required', 'Please select a refund method.', 'warning');
                return;
            }
            if (formData.type === 'RETURN' && (formData.refundMethod === 'UPI' || formData.refundMethod === 'BANK_TRANSFER') && !formData.refundDetails) {
                Swal.fire('Required', 'Please provide payment details for the refund.', 'warning');
                return;
            }
        }

        setCurrentStep(prev => prev + 1);
    };
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const updateFormData = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        try {
            const data = new FormData();
            data.append('orderId', order.id);
            data.append('orderItemId', orderItem.id);
            data.append('type', formData.type);
            data.append('reason', formData.reason);
            data.append('description', formData.description);
            data.append('refundMethod', formData.refundMethod);
            data.append('refundDetails', formData.refundDetails);
            data.append('pickupAddress', formData.pickupAddress);

            // Handle Images
            // Note: Backend currently supports single 'proofImage' and 'image'. 
            // Design spec asked for multi-image but backend kept simple for now per compatibility decision.
            // We will map the first proof image to 'proofImage' field for now.
            if (formData.proofImages.length > 0) {
                data.append('proofImage', formData.proofImages[0]);
            }

            await createReturnRequest(data);
            Swal.fire({
                title: 'Success!',
                text: 'Your request has been submitted successfully.',
                icon: 'success',
                confirmButtonColor: '#4F46E5',
            }).then(() => {
                navigate('/customer/returns'); // Or timeline view
            });
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Failed to submit request', 'error');
        }
    };

    // Render logic will go here
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center text-xs font-medium text-gray-500 mb-2">
                        <span>Type</span>
                        <span>Reason</span>
                        <span>Proof</span>
                        <span>Details</span>
                        <span>Review</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-600 transition-all duration-300 ease-in-out"
                            style={{ width: `${(currentStep / 5) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
                    <div className="p-6 md:p-8 flex-1">
                        {/* Title */}
                        {currentStep === 1 && <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">How can we help?</h2>}
                        {currentStep === 2 && <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Why are you returning/replacing this?</h2>}
                        {currentStep === 3 && <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Upload Proof</h2>}
                        {currentStep === 4 && <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add Details</h2>}
                        {currentStep === 5 && <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Review & Submit</h2>}

                        {/* Validated/Active Step Content */}
                        <div className="mt-4">
                            {currentStep === 1 && <StepTypeSelection formData={formData} updateFormData={updateFormData} />}
                            {currentStep === 2 && <StepReasonSelection formData={formData} updateFormData={updateFormData} />}
                            {currentStep === 3 && <StepProofUpload formData={formData} updateFormData={updateFormData} />}
                            {currentStep === 4 && <StepDetails formData={formData} updateFormData={updateFormData} />}
                            {currentStep === 5 && <StepReview formData={formData} order={order} orderItem={orderItem} />}
                        </div>
                    </div>

                    {/* Footer / Navigation */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 flex justify-between items-center border-t border-gray-100 dark:border-gray-700">
                        {currentStep > 1 ? (
                            <button onClick={prevStep} className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition">
                                Back
                            </button>
                        ) : <div></div>}

                        {currentStep < 5 ? (
                            <button onClick={nextStep} className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition">
                                Next
                            </button>
                        ) : (
                            <button onClick={handleSubmit} className="px-8 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 shadow-lg shadow-green-200 transition">
                                Submit Request
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnRequestCenter;
