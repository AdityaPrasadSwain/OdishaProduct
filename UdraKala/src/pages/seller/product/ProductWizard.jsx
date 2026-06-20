import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import BasicInfo from './steps/BasicInfo';
import PricingStock from './steps/PricingStock';
import ProductImages from './steps/ProductImages';
import Specifications from './steps/Specifications';
import ShippingPolicy from './steps/ShippingPolicy';
import ReviewVerify from './steps/ReviewVerify';
import { publishProduct, getProductById } from '../../../api/productWizardApi';

const steps = ['Basic Info', 'Pricing & Stock', 'Images', 'Specifications', 'Policies', 'Review'];

const ProductWizard = () => {
    const { id } = useParams(); // Get ID from URL for edit mode
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [productId, setProductId] = useState(null);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);
            setProductId(id);
            // In edit mode, allow navigation to all steps
            setCompletedSteps([0, 1, 2, 3, 4, 5]);

            getProductById(id).then(data => {
                setInitialData(data);
            }).catch(err => {
                console.error(err);
                Swal.fire('Error', 'Failed to load product details', 'error');
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [id]);

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
                Swal.fire('Error', "Product ID is missing.", 'error');
                return;
            }
            await publishProduct(productId);
            await Swal.fire({
                icon: 'success',
                title: 'Published!',
                text: 'Product Updated & Published Successfully!',
                timer: 1500,
                showConfirmButton: false
            });
            navigate('/seller/dashboard', { state: { activeTab: 'products' } });
        } catch (err) {
            console.error(err);
            Swal.fire('Error', "Error publishing product: " + err.message, 'error');
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading product details...</div>;
    }

    return (
        <div className="min-h-screen bg-bg-page dark:bg-bg-dark p-8 font-sans transition-colors duration-300">
            {/* Stepper UI */}
            <div className="max-w-6xl mx-auto mb-12">
                <div className="flex items-center justify-between relative">
                    {/* Background Line */}
                    <div className="absolute top-5 left-0 w-full h-1 bg-bg-band dark:bg-bg-dark -z-0 rounded"></div>

                    {/* Active Progress Line */}
                    <div
                        className="absolute top-5 left-0 h-1 bg-status-success transition-all duration-500 ease-in-out -z-0 rounded"
                        style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                    ></div>

                    {/* Steps */}
                    {steps.map((label, index) => {
                        const isCompleted = completedSteps.includes(index);
                        const isActive = index === activeStep;

                        return (
                            <div key={label} className="z-10 flex flex-col items-center group cursor-pointer" onClick={() => jumpToStep(index)}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-all duration-300 ${isActive
                                    ? 'bg-primary border-primary text-text-onDark scale-110 shadow-lg dark:border-primary'
                                    : isCompleted
                                        ? 'bg-status-success border-green-200 text-text-onDark dark:border-green-800'
                                        : 'bg-bg-surface border-border text-text-secondary dark:bg-bg-dark dark:border-border dark:text-text-secondary'
                                    }`}>
                                    {isCompleted ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <span className={`mt-3 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-primary dark:text-primary' : isCompleted ? 'text-status-success dark:text-green-400' : 'text-text-secondary dark:text-text-secondary'
                                    }`}>
                                    {label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content Card */}
            <div className="max-w-5xl mx-auto bg-bg-surface dark:bg-bg-dark rounded-2xl shadow-xl overflow-hidden border border-border dark:border-border transition-colors duration-300">
                <div className="p-1 bg-gradient-to-r from-blue-500 to-green-500"></div>
                <div className="p-8">
                    <div className="mb-6 border-b border-border dark:border-border pb-4">
                        <h2 className="text-2xl font-bold text-text-primary dark:text-text-onDark flex items-center gap-2">
                            <span className="text-primary dark:text-primary">#</span> {steps[activeStep]}
                        </h2>
                        <p className="text-text-secondary dark:text-text-secondary text-sm mt-1">
                            {activeStep === steps.length - 1 ? 'Verify all details before publishing.' : 'Please fill in the details below to proceed.'}
                        </p>
                    </div>

                    <div className="animate-fade-in-up">
                        <div className="animate-fade-in-up">
                            {activeStep === 0 && <BasicInfo onNext={(id) => { setProductId(id); handleNext(); }} initialData={initialData} />}
                            {activeStep === 1 && <PricingStock productId={productId} onNext={handleNext} onBack={handleBack} initialData={initialData} />}
                            {activeStep === 2 && <ProductImages productId={productId} onNext={handleNext} onBack={handleBack} initialData={initialData} />}
                            {activeStep === 3 && <Specifications productId={productId} onNext={handleNext} onBack={handleBack} initialData={initialData} />}
                            {activeStep === 4 && <ShippingPolicy productId={productId} onSubmit={handleNext} onBack={handleBack} initialData={initialData} />}
                            {activeStep === 5 && <ReviewVerify productId={productId} onEditStep={setActiveStep} onSubmit={handleFinish} />}
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center mt-8 text-text-secondary dark:text-text-secondary text-sm">
                Udrakala Helper &copy; 2026
            </div>
        </div>
    );
};
export default ProductWizard;
