import React, { useState } from 'react';
import { updateSpecsStep4 } from '../../../../api/productWizardApi';
import { useProductContext } from '../../../../context/ProductContext';

const Specifications = ({ onNext, onBack }) => {
    const { productData, updateProductData, productId } = useProductContext();
    const [loading, setLoading] = useState(false);

    // Unlike simple fields, specs is an array. We need local manipulation then sync to context or direct context manipulation?
    // Direct manipulation of context array is cleaner.

    // Helper to get specs safe
    const specs = productData.specifications || [];

    const handleAdd = () => {
        const newSpecs = [...specs, { key: '', value: '' }];
        updateProductData('specifications', newSpecs);
    };

    const handleRemove = (i) => {
        const newSpecs = specs.filter((_, idx) => idx !== i);
        updateProductData('specifications', newSpecs);
    };

    const handleChange = (i, field, val) => {
        const newSpecs = [...specs];
        newSpecs[i] = { ...newSpecs[i], [field]: val };
        updateProductData('specifications', newSpecs);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validSpecs = specs.filter(s => s.key && s.key.trim() && s.value && s.value.trim());

        setLoading(true);
        try {
            await updateSpecsStep4(productId, validSpecs);
            onNext();
        } catch (err) {
            alert("Failed to update specs: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <h3 className="text-lg font-bold text-text-secondary">Product Specifications</h3>
                <button type="button" onClick={handleAdd} className="text-primary font-bold hover:text-primary text-sm transition-colors">+ Add Row</button>
            </div>

            <div className="space-y-4">
                {specs.map((spec, idx) => (
                    <div key={idx} className="flex gap-4 items-start animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                        <div className="flex-1">
                            <input
                                value={spec.key ?? ''}
                                onChange={(e) => handleChange(idx, 'key', e.target.value)}
                                placeholder="Attribute (e.g. Care Instructions)"
                                className="w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-bg-dark/50 text-text-secondary placeholder-slate-500 focus:bg-bg-dark transition-all"
                            />
                        </div>
                        <div className="flex-1">
                            <input
                                value={spec.value ?? ''}
                                onChange={(e) => handleChange(idx, 'value', e.target.value)}
                                placeholder="Value (e.g. Dry Clean Only)"
                                className="w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-bg-dark/50 text-text-secondary placeholder-slate-500 focus:bg-bg-dark transition-all"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemove(idx)}
                            className="p-3 text-status-error hover:bg-status-error/10 rounded-xl transition-colors"
                        >
                            &times;
                        </button>
                    </div>
                ))}
                {specs.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-2xl">
                        <p className="text-text-secondary text-sm">No specifications added yet.</p>
                        <button type="button" onClick={handleAdd} className="mt-2 text-primary font-bold text-sm">Click to add your first row</button>
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-6 py-3 rounded-xl font-semibold text-text-secondary hover:bg-bg-surface/5 transition-colors"
                >
                    &larr; Back
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-10 py-3 rounded-xl font-bold text-text-onDark shadow-xl transition-all transform hover:-translate-y-1 ${loading ? 'bg-bg-dark' : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-indigo-900/20'}`}
                >
                    {loading ? 'Saving...' : 'Save & Continue'}
                </button>
            </div>
        </form>
    );
};
export default Specifications;
