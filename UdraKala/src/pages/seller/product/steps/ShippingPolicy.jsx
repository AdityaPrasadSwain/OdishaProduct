import React, { useState } from 'react';
import { updatePolicyStep5 } from '../../../../api/productWizardApi';

const Checkbox = ({ label, name, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
        <span className="font-semibold text-gray-700 dark:text-gray-200">{label}</span>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none ring-4 ring-blue-100 dark:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
    </div>
);

const ShippingPolicy = ({ productId, onSubmit, onBack }) => {
    const [formData, setFormData] = useState({
        dispatchDays: '',
        returnAvailable: false,
        returnWindowDays: '',
        returnPolicyDescription: '',
        cancellationAvailable: true
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: val });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updatePolicyStep5(productId, formData);
            onSubmit(); // Trigger publish in parent
        } catch (err) {
            alert("Failed to update policy: " + err.message);
            setLoading(false); // Only stop loading if failed, else parent handles
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-2">Shipping & Returns</h3>

            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Dispatch Time (Days)</label>
                <input
                    type="number"
                    name="dispatchDays"
                    required
                    value={formData.dispatchDays}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 dark:text-gray-100 placeholder-gray-400"
                    placeholder="e.g. 2"
                />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Number of days to pack and ship the item.</p>
            </div>

            <Checkbox label="Allow Returns?" name="returnAvailable" checked={formData.returnAvailable} onChange={handleChange} />

            {formData.returnAvailable && (
                <div className="pl-4 border-l-2 border-blue-200 dark:border-blue-800 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Return Window (Days)</label>
                        <input
                            type="number"
                            name="returnWindowDays"
                            value={formData.returnWindowDays}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 dark:text-gray-100 placeholder-gray-400"
                            placeholder="e.g. 7"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Return Policy Description</label>
                        <textarea
                            name="returnPolicyDescription"
                            rows="3"
                            value={formData.returnPolicyDescription}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 dark:text-gray-100 placeholder-gray-400 resize-none"
                            placeholder="Conditions for return..."
                        />
                    </div>
                </div>
            )}

            <Checkbox label="Allow Cancellation?" name="cancellationAvailable" checked={formData.cancellationAvailable} onChange={handleChange} />

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
                    className={`px-10 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-200 dark:shadow-blue-900 transition-all transform hover:-translate-y-1 ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {loading ? 'Publishing...' : 'Publish Product'}
                </button>
            </div>
        </form>
    );
};
export default ShippingPolicy;
