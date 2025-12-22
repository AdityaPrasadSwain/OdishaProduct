import React, { useState } from 'react';
import { Cog6ToothIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const AdminCommissionSettings = () => {
    // Mock initial state
    const [config, setConfig] = useState({
        commissionPercentage: 5.0,
        gstPercentage: 18.0
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: parseFloat(value)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
        }, 1500);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center space-x-3 mb-6">
                    <Cog6ToothIcon className="h-8 w-8 text-gray-600" />
                    <h1 className="text-2xl font-bold text-gray-900">Commission & GST Settings</h1>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6">
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        Warning: Changes to commission or GST rates will only apply to <strong>new orders</strong> placed after this update. Existing pending earnings will not be recalculated.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {message && (
                            <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                <div className="flex items-center">
                                    {message.type === 'success' && <CheckCircleIcon className="h-5 w-5 mr-2" />}
                                    <p className="text-sm font-medium">{message.text}</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label htmlFor="commissionPercentage" className="block text-sm font-medium text-gray-700">
                                        Commission Percentage (%)
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            name="commissionPercentage"
                                            id="commissionPercentage"
                                            required
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md py-3 pl-4"
                                            placeholder="5.00"
                                            value={config.commissionPercentage}
                                            onChange={handleChange}
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">%</span>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">Platform fee deducted from Gross Sales.</p>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="gstPercentage" className="block text-sm font-medium text-gray-700">
                                        GST on Commission (%)
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            name="gstPercentage"
                                            id="gstPercentage"
                                            required
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md py-3 pl-4"
                                            placeholder="18.00"
                                            value={config.gstPercentage}
                                            onChange={handleChange}
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">%</span>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">Tax applied on the Commission amount.</p>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Calculation Example</h3>
                                <div className="bg-gray-50 rounded-md p-4 space-y-2 text-sm text-gray-600 font-mono">
                                    <div className="flex justify-between">
                                        <span>Item Price (Gross):</span>
                                        <span>₹1,000.00</span>
                                    </div>
                                    <div className="flex justify-between text-red-600">
                                        <span>- Commission ({config.commissionPercentage}%):</span>
                                        <span>₹{(1000 * config.commissionPercentage / 100).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-red-600">
                                        <span>- GST ({config.gstPercentage}% on Comm):</span>
                                        <span>₹{((1000 * config.commissionPercentage / 100) * config.gstPercentage / 100).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-gray-300 pt-2 font-bold text-green-700">
                                        <span>Net Payable to Seller:</span>
                                        <span>₹{(1000 - (1000 * config.commissionPercentage / 100) - ((1000 * config.commissionPercentage / 100) * config.gstPercentage / 100)).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
                                >
                                    {isSaving ? 'Saving...' : 'Save Settings'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCommissionSettings;
