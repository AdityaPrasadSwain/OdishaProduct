import React, { useState, useEffect } from 'react';
import BasicInfo from './steps/BasicInfo';
import PricingStock from './steps/PricingStock';
import ProductImages from './steps/ProductImages';
import Specifications from './steps/Specifications';
import ShippingPolicy from './steps/ShippingPolicy';
import ReviewVerify from './steps/ReviewVerify';
import { publishProduct } from '../../../api/productWizardApi';
import { useParams, useNavigate } from 'react-router';
import { ProductProvider, useProductContext } from '../../../context/ProductContext';

const steps = ['Basic Info', 'Pricing & Stock', 'Images', 'Specifications', 'Policies', 'Review'];

// Internal component to consume context
const ProductWizardContent = () => {
    const { id: editId } = useParams();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);

    // Context hooks
    const { productId, setProductId, loading } = useProductContext();

    // Sync URL ID with Context
    useEffect(() => {
        if (editId && editId !== productId) {
            setProductId(editId);
        }
    }, [editId, setProductId]);

    // Handle initial navigation or deep linking?
    // Not needed if context handles fetching.

    const handleNext = () => {
        const nextStep = activeStep + 1;
        if (!completedSteps.includes(activeStep)) {
            setCompletedSteps([...completedSteps, activeStep]);
        }
        setActiveStep(nextStep);
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const jumpToStep = (index) => {
        // Allow jumping if step is completed OR it's the next immediate step
        // OR if we are in "Edit Mode" (productId exists), allow free navigation?
        if (productId) {
            setActiveStep(index);
        } else if (completedSteps.includes(index) || index <= Math.max(...completedSteps, 0) + 1) {
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
            navigate('/seller/products');
        } catch (err) {
            console.error(err);
            alert("Error publishing product: " + err.message);
        }
    };

    // Callback for BasicInfo to set ID after creation
    const onProductCreated = (newId) => {
        setProductId(newId);
        // handleNext is called by BasicInfo wrapper or here?
        // BasicInfo calls onNext(id).
        handleNext();
    };

    return (
        <div className="min-h-screen p-8 font-sans" style={{ backgroundColor: '#0B1120', backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(123, 97, 255, 0.05) 0%, rgba(11, 17, 32, 1) 100%)' }}>
            {/* Stepper UI */}
            <div className="max-w-6xl mx-auto mb-12">
                <div className="flex items-center justify-between relative">
                    <div className="absolute top-5 left-0 w-full h-[2px] bg-bg-dark -z-0 rounded"></div>
                    <div
                        className="absolute top-5 left-0 h-[2px] bg-primary transition-all duration-500 ease-in-out -z-0 rounded shadow-[0_0_10px_rgba(123,97,255,0.5)]"
                        style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                    ></div>

                    {steps.map((label, index) => {
                        const isCompleted = completedSteps.includes(index);
                        const isActive = index === activeStep;

                        return (
                            <div key={label} className="z-10 flex flex-col items-center group cursor-pointer" onClick={() => jumpToStep(index)}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${isActive
                                    ? 'bg-primary border-primary text-text-onDark scale-110 shadow-[0_0_15px_rgba(123,97,255,0.4)]'
                                    : isCompleted
                                        ? 'bg-status-success border-emerald-400 text-text-onDark'
                                        : 'bg-bg-dark border-border text-text-secondary'
                                    }`}>
                                    {isCompleted ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <span className={`mt-3 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-primary' : isCompleted ? 'text-status-success' : 'text-text-secondary'
                                    }`}>
                                    {label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content Card */}
            <div className="max-w-5xl mx-auto rounded-2xl shadow-2xl overflow-hidden border border-white/10" style={{ backgroundColor: 'rgba(17, 25, 40, 0.75)', backdropFilter: 'blur(16px)' }}>
                <div className="p-1 bg-gradient-to-r from-indigo-500 to-emerald-500"></div>
                <div className="p-8">
                    <div className="mb-6 border-b border-white/10 pb-4">
                        <h2 className="text-2xl font-bold text-text-secondary flex items-center gap-2">
                            <span className="text-primary">#</span> {steps[activeStep]}
                        </h2>
                        {loading && <p className="text-primary text-sm animate-pulse">Loading product data...</p>}
                    </div>

                    <div className="animate-fade-in-up">
                        {/* We no longer pass initialData props, steps use context */}
                        {activeStep === 0 && <BasicInfo onNext={onProductCreated} />}
                        {activeStep === 1 && <PricingStock onNext={handleNext} onBack={handleBack} />}
                        {activeStep === 2 && <ProductImages onNext={handleNext} onBack={handleBack} />}
                        {activeStep === 3 && <Specifications onNext={handleNext} onBack={handleBack} />}
                        {activeStep === 4 && <ShippingPolicy onSubmit={handleNext} onBack={handleBack} />}
                        {activeStep === 5 && <ReviewVerify onEditStep={setActiveStep} onSubmit={handleFinish} />}
                    </div>
                </div>
            </div>
            <div className="text-center mt-8 text-text-secondary text-sm">
                Udrakala Helper &copy; 2026
            </div>
        </div>
    );
};

const ProductWizard = () => (
    <ProductProvider>
        <ProductWizardContent />
    </ProductProvider>
);

export default ProductWizard;
