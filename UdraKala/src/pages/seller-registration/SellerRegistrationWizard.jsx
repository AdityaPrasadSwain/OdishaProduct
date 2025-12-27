import { useState } from 'react';
import { SellerRegistrationProvider } from '../../context/SellerRegistrationContext';
import Step1PersonalDetails from './Step1PersonalDetails';
import Step2BusinessDetails from './Step2BusinessDetails';
import Step3KYC from './Step3KYC';
import Step4Review from './Step4Review';

const WizardContent = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const next = () => setCurrentStep(prev => prev + 1);
    const prev = () => setCurrentStep(prev => prev - 1);

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <Step1PersonalDetails onNext={next} />;
            case 2: return <Step2BusinessDetails onNext={next} onPrev={prev} />;
            case 3: return <Step3KYC onNext={next} onPrev={prev} />;
            case 4: return <Step4Review onPrev={prev} />;
            default: return <Step1PersonalDetails onNext={next} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900">Become a Seller</h1>
                <p className="text-gray-500 mt-2">Create your shop in minutes</p>
            </div>

            {/* Stepper / Progress Bar */}
            <div className="w-full max-w-3xl mb-8">
                <div className="flex items-center justify-between relative px-6">
                    {/* Progress Bar Background */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>

                    {/* Active Progress Bar */}
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-orange-600 -z-10 transition-all duration-500 rounded-full"
                        style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    ></div>

                    {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex flex-col items-center bg-white p-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 
                                ${currentStep >= step ? 'bg-orange-600 text-white border-orange-600 scale-110' : 'bg-white text-gray-400 border-gray-300'}`}>
                                {step}
                            </div>
                            <span className={`text-xs mt-1 font-medium ${currentStep >= step ? 'text-orange-600' : 'text-gray-400'}`}>
                                {step === 1 ? 'Personal' : step === 2 ? 'Business' : step === 3 ? 'KYC' : 'Review'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 transition-all">
                {renderStep()}
            </div>
        </div>
    );
};

const SellerRegistrationWizard = () => {
    return (
        <SellerRegistrationProvider>
            <WizardContent />
        </SellerRegistrationProvider>
    );
};

export default SellerRegistrationWizard;
