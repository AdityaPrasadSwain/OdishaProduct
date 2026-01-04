import React, { useState } from 'react';
import { updatePricingStep2 } from '../../../../api/productWizardApi';

const PricingStock = ({ productId, onNext, onBack }) => {
    const [formData, setFormData] = useState({
        price: '',
        discountPrice: '',
        stockQuantity: '',
        minOrderQuantity: 1,
        maxOrderQuantity: 10,
        isCodAvailable: true
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
            await updatePricingStep2(productId, formData);
            onNext();
        } catch (err) {
            alert("Failed to update pricing: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const InputGroup = ({ label, name, type = "number", required = false, placeholder = "" }) => (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{label} {required && <span className="text-red-500">*</span>}</label>
            <div className="relative">
                {/* Symbol prefix for price */}
                {(name === 'price' || name === 'discountPrice') &&
                    <span className="absolute left-4 top-3.5 text-gray-400 font-bold">₹</span>
                }
                <input
                    type={type}
                    name={name}
                    required={required}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`w-full ${name === 'price' || name === 'discountPrice' ? 'pl-10' : 'pl-4'} pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white`}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Pricing Details</h3>
                    <InputGroup label="MRP (Original Price)" name="price" required placeholder="0.00" />
                    <InputGroup label="Selling Price (Discounted)" name="discountPrice" placeholder="0.00" />
                </div>

                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Stock & Inventory</h3>
                    <InputGroup label="Stock Quantity" name="stockQuantity" required placeholder="Total units available" />
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Min Order Qty" name="minOrderQuantity" placeholder="1" />
                        <InputGroup label="Max Order Qty" name="maxOrderQuantity" placeholder="10" />
                    </div>
                </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-gray-800">Cash On Delivery (COD)</h4>
                    <p className="text-sm text-gray-500">Enable COD for this product</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="isCodAvailable" checked={formData.isCodAvailable} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none ring-4 ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>

            <div className="flex justify-between pt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    &larr; Back
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-10 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1 ${loading ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}`}
                >
                    {loading ? 'Saving...' : 'Save & Continue'}
                </button>
            </div>
        </form>
    );
};
export default PricingStock;
