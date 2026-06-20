import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { updatePolicyStep5 } from '../../../../api/productWizardApi';

const Checkbox = ({ label, name, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-bg-page dark:bg-bg-dark rounded-xl border border-border dark:border-border">
        <span className="font-semibold text-text-secondary dark:text-text-secondary">{label}</span>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-bg-band dark:bg-bg-dark peer-focus:outline-none ring-4 ring-blue-100 dark:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-bg-surface after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
    </div>
);

const ShippingPolicy = ({ productId, onSubmit, onBack, initialData }) => {
    const [formData, setFormData] = useState({
        dispatchDays: '',
        returnAvailable: false,
        returnWindowDays: '',
        returnPolicyDescription: '',
        cancellationAvailable: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                dispatchDays: initialData.dispatchDays || '',
                returnAvailable: initialData.returnAvailable || false,
                returnWindowDays: initialData.returnWindowDays || '',
                returnPolicyDescription: initialData.returnPolicyDescription || '',
                cancellationAvailable: initialData.cancellationAvailable !== undefined ? initialData.cancellationAvailable : true
            });
        }
    }, [initialData]);

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
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: err.message || 'Failed to update shipping policy',
            });
            setLoading(false); // Only stop loading if failed, else parent handles
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
            <h3 className="text-lg font-bold text-text-primary dark:text-text-onDark border-b dark:border-border pb-2">Shipping & Returns</h3>

            <div>
                <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary mb-2">Dispatch Time (Days)</label>
                <input
                    type="number"
                    name="dispatchDays"
                    required
                    value={formData.dispatchDays}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all bg-bg-page dark:bg-bg-dark focus:bg-bg-surface dark:focus:bg-bg-dark dark:text-text-secondary placeholder-gray-400"
                    placeholder="e.g. 2"
                />
                <p className="text-xs text-text-secondary dark:text-text-secondary mt-1">Number of days to pack and ship the item.</p>
            </div>

            <Checkbox label="Allow Returns?" name="returnAvailable" checked={formData.returnAvailable} onChange={handleChange} />

            {formData.returnAvailable && (
                <div className="pl-4 border-l-2 border-primary dark:border-primary space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary mb-2">Return Window (Days)</label>
                        <input
                            type="number"
                            name="returnWindowDays"
                            value={formData.returnWindowDays}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-bg-page dark:bg-bg-dark focus:bg-bg-surface dark:focus:bg-bg-dark dark:text-text-secondary placeholder-gray-400"
                            placeholder="e.g. 7"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary mb-2">Return Policy Description</label>
                        <textarea
                            name="returnPolicyDescription"
                            rows="3"
                            value={formData.returnPolicyDescription}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-bg-page dark:bg-bg-dark focus:bg-bg-surface dark:focus:bg-bg-dark dark:text-text-secondary placeholder-gray-400 resize-none"
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
                    className="px-6 py-3 rounded-xl font-semibold text-text-secondary dark:text-text-secondary hover:bg-bg-band dark:hover:bg-bg-dark transition-colors"
                >
                    &larr; Back
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-10 py-3 rounded-xl font-bold text-text-onDark shadow-lg shadow-blue-200 dark:shadow-blue-900 transition-all transform hover:-translate-y-1 ${loading ? 'bg-bg-band' : 'bg-status-success hover:bg-green-700'}`}
                >
                    {loading ? 'Publishing...' : 'Publish Product'}
                </button>
            </div>
        </form>
    );
};
export default ShippingPolicy;
