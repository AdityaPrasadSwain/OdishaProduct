import React, { useState } from 'react';
import { useSellerRegistration } from '../../context/SellerRegistrationContext';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import defaultUser from '../../assets/default-user.jpg';

const Step4Review = ({ onPrev }) => {
    const { sellerData } = useSellerRegistration();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setLoading(true);

        try {
            const formData = new FormData();

            // Personal
            formData.append('fullName', sellerData.fullName);
            formData.append('email', sellerData.email);
            formData.append('phone', sellerData.mobile);
            formData.append('password', sellerData.password);
            if (sellerData.profilePhoto) formData.append('profileImage', sellerData.profilePhoto);

            // Business
            formData.append('businessName', sellerData.businessName);
            formData.append('businessType', sellerData.businessType);
            formData.append('address', sellerData.address);
            formData.append('state', sellerData.state);
            formData.append('city', sellerData.city);
            formData.append('pincode', sellerData.pincode);

            // KYC & Docs
            formData.append('panNumber', sellerData.panNumber);
            formData.append('aadhaarNumber', sellerData.aadhaarNumber);
            formData.append('gstNumber', sellerData.gstNumber || ""); // send empty string if null

            if (sellerData.panFile instanceof File) formData.append('panFile', sellerData.panFile);
            if (sellerData.aadhaarFile instanceof File) formData.append('aadhaarFile', sellerData.aadhaarFile);
            if (sellerData.gstFile instanceof File) formData.append('gstFile', sellerData.gstFile);

            // Bank
            formData.append('accountNumber', sellerData.bankAccountNo);
            formData.append('ifscCode', sellerData.ifscCode);
            formData.append('bankName', sellerData.bankName);
            formData.append('accountHolderName', sellerData.accountHolderName);

            // Call the NEW Full Registration Endpoint
            const res = await API.post('/sellers/register/full-register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: 'Your account is under verification. Logging you in...',
                timer: 2000,
                showConfirmButton: false
            });

            // Auto Login
            await login(sellerData.email, sellerData.password);

            // Navigate based on logic (usually dashboard or status page)
            // Since we know they are a seller, we can try dashboard, 
            // the ProtectedRoute or SellerDashboard will handle "not approved" state if implemented,
            // otherwise /seller/status is safer if exist.
            // But user asked for dashboard access for waiting verification usually.
            // Let's send to dashboard, if blocked it will redirect.
            navigate('/seller/dashboard');

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: error.response?.data?.message || error.message || 'Please check your details and try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const ReviewItem = ({ label, value }) => (
        <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{label}</span>
            <span className="text-gray-800 dark:text-gray-200 text-sm font-bold text-right">{value || "-"}</span>
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">Review Details</h2>

            {/* Business Card Summary */}
            <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-200 dark:border-orange-900/40 flex items-center gap-4">
                {sellerData.profilePhotoPreview ? (
                    <img
                        src={sellerData.profilePhotoPreview}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow"
                    />
                ) : (
                    <img
                        src={defaultUser}
                        alt="Default Profile"
                        className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow"
                    />
                )}
                <div>
                    <h3 className="font-bold text-lg text-orange-900 dark:text-orange-400">{sellerData.businessName}</h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300">{sellerData.fullName}</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 shadow-sm">
                    <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Business Address</h4>
                    <ReviewItem label="Type" value={sellerData.businessType} />
                    <ReviewItem label="City" value={sellerData.city} />
                    <ReviewItem label="State" value={sellerData.state} />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{sellerData.address}, {sellerData.pincode}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 shadow-sm">
                    <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">KYC & Bank</h4>
                    <ReviewItem label="PAN" value={sellerData.panNumber} />
                    <ReviewItem label="Aadhaar" value={sellerData.aadhaarNumber} />
                    <ReviewItem label="GST" value={sellerData.gstNumber || "N/A"} />
                    <ReviewItem label="Bank" value={sellerData.bankName} />
                    <ReviewItem label="Account" value={sellerData.bankAccountNo} />
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={onPrev}
                    className="w-1/2 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                    Edit
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-1/2 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition shadow-lg disabled:opacity-70 flex justify-center items-center"
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : 'Confirm & Submit'}
                </button>
            </div>
        </div>
    );
};

export default Step4Review;
