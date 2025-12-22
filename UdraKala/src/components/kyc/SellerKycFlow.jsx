import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';
import PanVerification from './steps/PanVerification';
import AadhaarVerification from './steps/AadhaarVerification';
import GstVerification from './steps/GstVerification';
import PendingApproval from './steps/PendingApproval';

const SellerKycFlow = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [kycStatus, setKycStatus] = useState('NOT_STARTED');
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token'); // Assuming JWT is stored here

    useEffect(() => {
        fetchKycStatus();
    }, []);

    const fetchKycStatus = async () => {
        try {
            const response = await axios.get('http://localhost:8085/api/kyc/status', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const status = response.data.status;
            setKycStatus(status);
            determineStep(status);
        } catch (error) {
            console.error("Failed to fetch KYC status", error);
        } finally {
            setLoading(false);
        }
    };

    const determineStep = (status) => {
        switch (status) {
            case 'PAN_VERIFIED': setCurrentStep(1); break;
            case 'AADHAAR_VERIFIED': setCurrentStep(2); break;
            case 'GST_VERIFIED': setCurrentStep(3); break;
            case 'PENDING_APPROVAL': setCurrentStep(3); break;
            case 'APPROVED': setCurrentStep(4); break; // Or redirect
            default: setCurrentStep(0);
        }
    };

    const handleNext = (data) => {
        // Optimistically update or re-fetch
        fetchKycStatus();
    };

    const handleFinalSubmit = async () => {
        try {
            await axios.post('http://localhost:8085/api/kyc/submit', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchKycStatus();
        } catch (error) {
            console.error("Failed to submit", error);
        }
    };

    const steps = [
        { title: 'PAN Verification', component: <PanVerification onNext={handleNext} token={token} /> },
        { title: 'Aadhaar OTP', component: <AadhaarVerification onNext={handleNext} token={token} /> },
        { title: 'GST Details', component: <GstVerification onNext={handleFinalSubmit} onSkip={handleFinalSubmit} token={token} /> },
        { title: 'Approval', component: <PendingApproval /> }
    ];

    if (loading) return <div className="text-center p-10">Loading KYC Status...</div>;

    if (kycStatus === 'APPROVED') {
        return <div className="text-center p-10 text-green-600 font-bold text-xl">✅ Your Seller Account is Approved!</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Seller Verification</h1>

                {/* Stepper Header */}
                <div className="flex justify-between mb-8 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center bg-gray-50 px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                                ${index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'}`}>
                                {index < currentStep ? <CheckCircle size={18} /> : <span>{index + 1}</span>}
                            </div>
                            <span className={`text-sm font-medium ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="bg-white rounded-xl shadow-lg p-1">
                    {steps[currentStep]?.component}
                </div>
            </div>
        </div>
    );
};

export default SellerKycFlow;
