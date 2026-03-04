import React, { useState } from 'react';
import { updatePricingStep2 } from '../../../../api/productWizardApi';
import { useProductContext } from '../../../../context/ProductContext';

const PricingStock = ({ onNext, onBack }) => {
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
            const dataPayload = {
                price: productData.price,
                discountPrice: productData.discountPrice,
                stockQuantity: productData.stockQuantity,
                minOrderQuantity: productData.minOrderQuantity,
                maxOrderQuantity: productData.maxOrderQuantity,
                isCodAvailable: productData.isCodAvailable
            };
            await updatePricingStep2(productId, dataPayload);
            onNext();
        } catch (err) {
            alert("Failed to update pricing: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const InputGroup = ({ label, name, type = "number", required = false, placeholder = "" }) => (
        <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">{label} {required && <span className="text-rose-500">*</span>}</label>
            <div className="relative">
                {(name === 'price' || name === 'discountPrice') &&
                    <span className="absolute left-4 top-3.5 text-slate-400 font-bold">₹</span>
                }
                <input
                    type={type}
                    name={name}
                    required={required}
                    value={productData[name] ?? ''}
                    onChange={handleChange}
                    className={`w-full ${name === 'price' || name === 'discountPrice' ? 'pl-10' : 'pl-4'} pr-4 py-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-900/50 text-slate-100 placeholder-slate-500 focus:bg-slate-900`}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-100 border-b border-white/10 pb-2">Pricing Details</h3>
                    <InputGroup label="MRP (Original Price)" name="price" required placeholder="0.00" />
                    <InputGroup label="Selling Price (Discounted)" name="discountPrice" placeholder="0.00" />
                </div>

                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-100 border-b border-white/10 pb-2">Stock & Inventory</h3>
                    <InputGroup label="Stock Quantity" name="stockQuantity" required placeholder="Total units available" />
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Min Order Qty" name="minOrderQuantity" placeholder="1" />
                        <InputGroup label="Max Order Qty" name="maxOrderQuantity" placeholder="10" />
                    </div>
                </div>
            </div>

            <div className="mt-4 p-4 bg-indigo-900/20 rounded-xl border border-indigo-500/20 flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-slate-100">Cash On Delivery (COD)</h4>
                    <p className="text-sm text-slate-400">Enable COD for this product</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="isCodAvailable" checked={productData.isCodAvailable ?? true} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none ring-4 ring-indigo-900/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                </label>
            </div>

            <div className="flex justify-between pt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-6 py-3 rounded-xl font-semibold text-slate-400 hover:bg-white/5 transition-colors"
                >
                    &larr; Back
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-10 py-3 rounded-xl font-bold text-white shadow-xl transition-all transform hover:-translate-y-1 ${loading ? 'bg-slate-700' : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-indigo-900/20'}`}
                >
                    {loading ? 'Saving...' : 'Save & Continue'}
                </button>
            </div>
        </form>
    );
};
export default PricingStock;
