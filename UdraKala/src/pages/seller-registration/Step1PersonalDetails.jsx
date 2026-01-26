import React, { useState } from 'react';
import { useSellerRegistration } from '../../context/SellerRegistrationContext';
import { Camera, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import defaultUser from '../../assets/default-user.jpg';

const Step1PersonalDetails = ({ onNext }) => {
    const { sellerData, updateSellerData } = useSellerRegistration();
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateSellerData({ [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: null });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            updateSellerData({
                profilePhoto: file,
                profilePhotoPreview: URL.createObjectURL(file)
            });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!sellerData.fullName) newErrors.fullName = "Full Name is required";
        if (!sellerData.email) newErrors.email = "Email is required";
        if (!sellerData.mobile) newErrors.mobile = "Mobile is required";
        if (!sellerData.password) newErrors.password = "Password is required";

        // Basic Regex
        if (sellerData.email && !/\S+@\S+\.\S+/.test(sellerData.email)) newErrors.email = "Invalid Email";
        if (sellerData.mobile && !/^\d{10}$/.test(sellerData.mobile)) newErrors.mobile = "Invalid Mobile (10 digits)";
        if (sellerData.password && sellerData.password.length < 6) newErrors.password = "Password must be at least 6 chars";

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
        <form onSubmit={handleNext} className="space-y-5">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">Personal Details</h2>

            {/* Profile Photo */}
            <div className="flex flex-col items-center mb-6">
                <div className="relative w-24 h-24 mb-2">
                    {sellerData.profilePhotoPreview ? (
                        <img
                            src={sellerData.profilePhotoPreview}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover border-4 border-gray-100 dark:border-gray-700 shadow-md"
                        />
                    ) : (
                        <img
                            src={defaultUser}
                            alt="Default Profile"
                            className="w-full h-full rounded-full object-cover border-4 border-gray-100 dark:border-gray-700 shadow-md"
                        />
                    )}
                    <label className="absolute bottom-0 right-0 bg-orange-600 p-2 rounded-full cursor-pointer hover:bg-orange-700 transition shadow-sm">
                        <Camera size={16} className="text-white" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Upload Profile Photo</span>
            </div>

            {/* Full Name */}
            <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={18} />
                <input
                    type="text"
                    name="fullName"
                    value={sellerData.fullName}
                    onChange={handleChange}
                    className="w-full pl-10 p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                    placeholder="Full Name"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={18} />
                <input
                    type="email"
                    name="email"
                    value={sellerData.email}
                    onChange={handleChange}
                    className="w-full pl-10 p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                    placeholder="Email Address"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Mobile */}
            <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={18} />
                <input
                    type="text"
                    name="mobile"
                    value={sellerData.mobile}
                    onChange={handleChange}
                    maxLength="10"
                    className="w-full pl-10 p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                    placeholder="Mobile Number"
                />
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
            </div>

            {/* Password */}
            <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={18} />
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={sellerData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                    placeholder="Create Password"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 dark:text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
                type="submit"
                className="w-full py-3 mt-4 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition"
            >
                Next: Business Details
            </button>
        </form>
    );
};

export default Step1PersonalDetails;
