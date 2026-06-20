import React, { useState } from 'react';
import { updatePolicyStep5 } from '../../../../api/productWizardApi';
import { useProductContext } from '../../../../context/ProductContext';

const ShippingPolicy = ({ onSubmit, onBack }) => {
    const { productData, updateProductData, productId } = useProductContext();
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        updateProductData(e.target.name, val);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSave = {
                dispatchDays: productData.dispatchDays,
                returnAvailable: productData.returnAvailable,
                returnWindowDays: productData.returnWindowDays,
                returnPolicyDescription: productData.returnPolicyDescription,
                cancellationAvailable: productData.cancellationAvailable
            };

            await updatePolicyStep5(productId, dataToSave);
            onSubmit(); // Trigger publish in parent/next step
        } catch (err) {
            alert("Failed to update policy: " + err.message);
            setLoading(false);
        }
    };

    const Checkbox = ({ label, name }) => (
        <div className="flex items-center justify-between p-4 bg-bg-page rounded-xl border border-border">
            <span className="font-semibold text-text-secondary">{label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name={name} checked={!!productData[name]} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-bg-band peer-focus:outline-none ring-4 ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-bg-surface after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
            <h3 className="text-lg font-bold text-text-primary border-b pb-2">Shipping & Returns</h3>

            <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">Dispatch Time (Days)</label>
                <input
                    type="number"
                    name="dispatchDays"
                    required
                    value={productData.dispatchDays ?? ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all bg-bg-page focus:bg-bg-surface"
                    placeholder="e.g. 2"
                />
                <p className="text-xs text-text-secondary mt-1">Number of days to pack and ship the item.</p>
            </div>

            <Checkbox label="Allow Returns?" name="returnAvailable" />

            {productData.returnAvailable && (
                <div className="pl-4 border-l-2 border-primary space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-text-secondary mb-2">Return Window (Days)</label>
                        <input
                            type="number"
                            name="returnWindowDays"
                            value={productData.returnWindowDays ?? ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-bg-page focus:bg-bg-surface"
                            placeholder="e.g. 7"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-text-secondary mb-2">Return Policy Description</label>
                        <textarea
                            name="returnPolicyDescription"
                            rows="3"
                            value={productData.returnPolicyDescription ?? ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-bg-page focus:bg-bg-surface resize-none"
                            placeholder="Conditions for return..."
                        />
                    </div>
                </div>
            )}

            <Checkbox label="Allow Cancellation?" name="cancellationAvailable" />

            <div className="flex justify-between pt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-6 py-3 rounded-xl font-semibold text-text-secondary hover:bg-bg-band transition-colors"
                >
                    &larr; Back
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-10 py-3 rounded-xl font-bold text-text-onDark shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1 ${loading ? 'bg-bg-band' : 'bg-status-success hover:bg-green-700'}`}
                >
                    {loading ? 'Publishing...' : 'Publish Product'}
                </button>
            </div>
        </form>
    );
};
export default ShippingPolicy;
