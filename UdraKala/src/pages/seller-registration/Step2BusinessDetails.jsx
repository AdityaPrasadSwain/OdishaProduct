import React, { useState } from 'react';
import { useSellerRegistration } from '../../context/SellerRegistrationContext';

const Step2BusinessDetails = ({ onNext, onPrev }) => {
    const { sellerData, updateSellerData } = useSellerRegistration();
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateSellerData({ [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: null });
    };

    const validate = () => {
        const newErrors = {};
        if (!sellerData.businessName) newErrors.businessName = "Business Name is required";
        if (!sellerData.businessType) newErrors.businessType = "Business Type is required";
        if (!sellerData.address) newErrors.address = "Address is required";
        if (!sellerData.state) newErrors.state = "State is required";
        if (!sellerData.city) newErrors.city = "City is required";
        if (!sellerData.pincode) newErrors.pincode = "Pincode is required";
        // Basic Pincode validation (6 digits)
        if (sellerData.pincode && !/^\d{6}$/.test(sellerData.pincode)) {
            newErrors.pincode = "Invalid Pincode (6 digits)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (validate()) {
            onNext();
        }
    };

    return (
        <form onSubmit={handleNext} className="space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-center text-text-primary dark:text-text-onDark">Business Details</h2>

            {/* Business Name */}
            <div>
                <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary">Business Name</label>
                <input
                    type="text"
                    name="businessName"
                    value={sellerData.businessName}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-border dark:border-border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-bg-surface dark:bg-bg-dark text-text-primary dark:text-text-onDark placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                    placeholder="e.g. My Handloom Store"
                />
                {errors.businessName && <p className="text-status-error text-xs mt-1">{errors.businessName}</p>}
            </div>

            {/* Business Type */}
            <div>
                <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary">Business Type</label>
                <select
                    name="businessType"
                    value={sellerData.businessType}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-border dark:border-border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-bg-surface dark:bg-bg-dark text-text-primary dark:text-text-onDark transition-colors"
                >
                    <option value="">Select Type</option>
                    <option value="Individual">Individual / Proprietor</option>
                    <option value="Partnership">Partnership</option>
                    <option value="PvtLtd">Private Limited</option>
                    <option value="SHG">Self Help Group (SHG)</option>
                    <option value="Cooperative">Cooperative Society</option>
                </select>
                {errors.businessType && <p className="text-status-error text-xs mt-1">{errors.businessType}</p>}
            </div>

            {/* Address */}
            <div>
                <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary">Address</label>
                <textarea
                    name="address"
                    value={sellerData.address}
                    onChange={handleChange}
                    rows="2"
                    className="w-full p-2.5 border border-border dark:border-border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-bg-surface dark:bg-bg-dark text-text-primary dark:text-text-onDark placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                    placeholder="Street, Sector, Building..."
                ></textarea>
                {errors.address && <p className="text-status-error text-xs mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* State */}
                <div>
                    <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary">State</label>
                    <select
                        name="state"
                        value={sellerData.state}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-border dark:border-border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-bg-surface dark:bg-bg-dark text-text-primary dark:text-text-onDark transition-colors"
                    >
                        <option value="">Select State</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.state && <p className="text-status-error text-xs mt-1">{errors.state}</p>}
                </div>

                {/* City */}
                <div>
                    <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary">City / District</label>
                    <input
                        type="text"
                        name="city"
                        value={sellerData.city}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-border dark:border-border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-bg-surface dark:bg-bg-dark text-text-primary dark:text-text-onDark placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                        placeholder="e.g. Bhubaneswar"
                    />
                    {errors.city && <p className="text-status-error text-xs mt-1">{errors.city}</p>}
                </div>
            </div>

            {/* Pincode */}
            <div>
                <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary">Pincode</label>
                <input
                    type="text"
                    name="pincode"
                    value={sellerData.pincode}
                    onChange={handleChange}
                    maxLength="6"
                    className="w-full p-2.5 border border-border dark:border-border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-bg-surface dark:bg-bg-dark text-text-primary dark:text-text-onDark placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                    placeholder="751000"
                />
                {errors.pincode && <p className="text-status-error text-xs mt-1">{errors.pincode}</p>}
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={onPrev}
                    className="w-1/2 py-3 bg-bg-band dark:bg-bg-dark text-text-primary dark:text-text-onDark rounded-lg font-bold hover:bg-bg-band dark:hover:bg-bg-dark transition"
                >
                    Back
                </button>
                <button
                    type="submit"
                    className="w-1/2 py-3 bg-primary text-text-onDark rounded-lg font-bold hover:bg-primary-hover transition"
                >
                    Next: KYC
                </button>
            </div>
        </form>
    );
};

export default Step2BusinessDetails;
