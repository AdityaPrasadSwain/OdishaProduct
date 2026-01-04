import React, { useState } from 'react';
import BasicInfo from './steps/BasicInfo';
import PricingStock from './steps/PricingStock';
import ProductImages from './steps/ProductImages';
import Specifications from './steps/Specifications';
import ShippingPolicy from './steps/ShippingPolicy';
import ReviewVerify from './steps/ReviewVerify';
import { publishProduct } from '../../../api/productWizardApi';

const steps = ['Basic Info', 'Pricing & Stock', 'Images', 'Specifications', 'Policies', 'Review'];

const ProductWizard = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [productId, setProductId] = useState(null); // Store after Step 1
    const [completedSteps, setCompletedSteps] = useState([]); // Track completed step indices

    const handleNext = () => {
        if (!completedSteps.includes(activeStep)) {
            setCompletedSteps([...completedSteps, activeStep]);
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    // Allow jumping to review or back if step is completed/visitable
    const jumpToStep = (index) => {
        if (productId && (completedSteps.includes(index) || index <= Math.max(...completedSteps, 0) + 1)) {
            setActiveStep(index);
        }
    };

    const handleFinish = async () => {
        try {
            if (!productId) {
                alert("Error: Product ID is missing.");
                return;
            }
            await publishProduct(productId);
            alert("Product Verified & Published Successfully!");
            // Optional: Redirect
            // window.location.href = '/seller/products';
        } catch (err) {
            console.error(err);
            alert("Error publishing product: " + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            {/* Stepper UI */}
            <div className="max-w-6xl mx-auto mb-12">
                <div className="flex items-center justify-between relative">
                    {/* Background Line */}
                    <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 -z-0 rounded"></div>

                    {/* Active Progress Line */}
                    <div
                        className="absolute top-5 left-0 h-1 bg-green-500 transition-all duration-500 ease-in-out -z-0 rounded"
                        style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                    ></div>

                    {/* Steps */}
                    {steps.map((label, index) => {
                        const isCompleted = completedSteps.includes(index);
                        const isActive = index === activeStep;

                        return (
                            <div key={label} className="z-10 flex flex-col items-center group cursor-pointer" onClick={() => jumpToStep(index)}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-all duration-300 ${isActive
                                        ? 'bg-blue-600 border-blue-200 text-white scale-110 shadow-lg'
                                        : isCompleted
                                            ? 'bg-green-500 border-green-200 text-white'
                                            : 'bg-white border-gray-300 text-gray-400'
                                    }`}>
                                    {isCompleted ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <span className={`mt-3 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-blue-700' : isCompleted ? 'text-green-600' : 'text-gray-400'
                                    }`}>
                                    {label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content Card */}
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-1 bg-gradient-to-r from-blue-500 to-green-500"></div>
                <div className="p-8">
                    <div className="mb-6 border-b border-gray-100 pb-4">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="text-blue-600">#</span> {steps[activeStep]}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {activeStep === steps.length - 1 ? 'Verify all details before publishing.' : 'Please fill in the details below to proceed.'}
                        </p>
                    </div>

                    <div className="animate-fade-in-up">
                        {activeStep === 0 && <BasicInfo onNext={(id) => { setProductId(id); handleNext(); }} />}
                        {activeStep === 1 && <PricingStock productId={productId} onNext={handleNext} onBack={handleBack} />}
                        {activeStep === 2 && <ProductImages productId={productId} onNext={handleNext} onBack={handleBack} />}
                        {activeStep === 3 && <Specifications productId={productId} onNext={handleNext} onBack={handleBack} />}
                        {activeStep === 4 && <ShippingPolicy productId={productId} onSubmit={handleNext} onBack={handleBack} />}
                        {activeStep === 5 && <ReviewVerify productId={productId} onEditStep={setActiveStep} onSubmit={handleFinish} />}
                    </div>
                </div>
            </div>

            <div className="text-center mt-8 text-gray-400 text-sm">
                Udrakala Helper &copy; 2026
            </div>
        </div>
    );
};
export default ProductWizard;
