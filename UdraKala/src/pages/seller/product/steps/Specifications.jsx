import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { updateSpecsStep4 } from '../../../../api/productWizardApi';

const Specifications = ({ productId, onNext, onBack, initialData }) => {
    const [specs, setSpecs] = useState([{ key: '', value: '' }]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData && initialData.specifications) {
            let specsObj = initialData.specifications;
            if (typeof specsObj === 'string') {
                try {
                    specsObj = JSON.parse(specsObj);
                } catch (e) {
                    console.error("Failed to parse specifications", e);
                    specsObj = {};
                }
            }

            const specsArray = Object.entries(specsObj).map(([key, value]) => ({ key, value }));
            if (specsArray.length > 0) {
                setSpecs(specsArray);
            }
        }
    }, [initialData]);

    const handleAdd = () => setSpecs([...specs, { key: '', value: '' }]);
    const handleRemove = (i) => setSpecs(specs.filter((_, idx) => idx !== i));

    const handleChange = (i, field, val) => {
        const newSpecs = [...specs];
        newSpecs[i][field] = val;
        setSpecs(newSpecs);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validSpecs = specs.filter(s => s.key.trim() && s.value.trim());

        // Allow finishing even if empty? Usually optional. 
        // But let's send what we have.

        setLoading(true);
        try {
            await updateSpecsStep4(productId, validSpecs);
            onNext();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: err.message || 'Failed to update specifications',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center border-b dark:border-border pb-2">
                <h3 className="text-lg font-bold text-text-primary dark:text-text-onDark">Product Specifications</h3>
                <button type="button" onClick={handleAdd} className="text-primary dark:text-primary font-bold hover:underline text-sm">+ Add Row</button>
            </div>

            <div className="space-y-4">
                {specs.map((spec, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                        <div className="flex-1">
                            <input
                                value={spec.key}
                                onChange={(e) => handleChange(idx, 'key', e.target.value)}
                                placeholder="Attribute (e.g. Care Instructions)"
                                className="w-full px-4 py-3 border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-bg-page dark:bg-bg-dark focus:bg-bg-surface dark:focus:bg-bg-dark dark:text-text-secondary placeholder-gray-400"
                            />
                        </div>
                        <div className="flex-1">
                            <input
                                value={spec.value}
                                onChange={(e) => handleChange(idx, 'value', e.target.value)}
                                placeholder="Value (e.g. Dry Clean Only)"
                                className="w-full px-4 py-3 border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-bg-page dark:bg-bg-dark focus:bg-bg-surface dark:focus:bg-bg-dark dark:text-text-secondary placeholder-gray-400"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemove(idx)}
                            className="p-3 text-status-error hover:bg-red-50 dark:hover:text-status-error/20 rounded-xl transition-colors"
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex justify-between pt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-6 py-3 rounded-xl font-semibold text-text-secondary dark:text-text-secondary hover:bg-bg-band dark:hover:bg-bg-dark transition-colors"
                >
                    &larr; Back
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-10 py-3 rounded-xl font-bold text-text-onDark shadow-lg shadow-blue-200 dark:shadow-blue-900 transition-all transform hover:-translate-y-1 ${loading ? 'bg-bg-band' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}`}
                >
                    {loading ? 'Saving...' : 'Save & Continue'}
                </button>
            </div>
        </form>
    );
};
export default Specifications;
