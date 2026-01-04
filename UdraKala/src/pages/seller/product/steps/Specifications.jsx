import React, { useState } from 'react';
import { updateSpecsStep4 } from '../../../../api/productWizardApi';

const Specifications = ({ productId, onNext, onBack }) => {
    const [specs, setSpecs] = useState([{ key: '', value: '' }]);
    const [loading, setLoading] = useState(false);

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
            alert("Failed to update specs: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center border-b dark:border-gray-700 pb-2">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Product Specifications</h3>
                <button type="button" onClick={handleAdd} className="text-blue-600 dark:text-blue-400 font-bold hover:underline text-sm">+ Add Row</button>
            </div>

            <div className="space-y-4">
                {specs.map((spec, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                        <div className="flex-1">
                            <input
                                value={spec.key}
                                onChange={(e) => handleChange(idx, 'key', e.target.value)}
                                placeholder="Attribute (e.g. Care Instructions)"
                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 dark:text-gray-100 placeholder-gray-400"
                            />
                        </div>
                        <div className="flex-1">
                            <input
                                value={spec.value}
                                onChange={(e) => handleChange(idx, 'value', e.target.value)}
                                placeholder="Value (e.g. Dry Clean Only)"
                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 dark:text-gray-100 placeholder-gray-400"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemove(idx)}
                            className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
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
                    className="px-6 py-3 rounded-xl font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    &larr; Back
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-10 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-200 dark:shadow-blue-900 transition-all transform hover:-translate-y-1 ${loading ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}`}
                >
                    {loading ? 'Saving...' : 'Save & Continue'}
                </button>
            </div>
        </form>
    );
};
export default Specifications;
