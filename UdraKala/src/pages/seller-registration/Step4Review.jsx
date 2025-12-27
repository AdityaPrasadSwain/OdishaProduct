import React, { useState } from 'react';
import { useSellerRegistration } from '../../context/SellerRegistrationContext';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

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

            formData.append('panFile', sellerData.panFile);
            formData.append('aadhaarFile', sellerData.aadhaarFile);
            if (sellerData.gstFile) formData.append('gstFile', sellerData.gstFile);

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
                text: error.response?.data?.message || 'Please check your details and try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const ReviewItem = ({ label, value }) => (
        <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
            <span className="text-gray-500 text-sm font-medium">{label}</span>
            <span className="text-gray-800 text-sm font-bold text-right">{value || "-"}</span>
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Review Details</h2>

            {/* Business Card Summary */}
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 flex items-center gap-4">
                <img
                    src={sellerData.profilePhotoPreview || "https://via.placeholder.com/80"}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                />
                <div>
                    <h3 className="font-bold text-lg text-orange-900">{sellerData.businessName}</h3>
                    <p className="text-sm text-orange-700">{sellerData.fullName}</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h4 className="font-bold text-gray-700 mb-2">Business Address</h4>
                    <ReviewItem label="Type" value={sellerData.businessType} />
                    <ReviewItem label="City" value={sellerData.city} />
                    <ReviewItem label="State" value={sellerData.state} />
                    <p className="text-xs text-gray-500 mt-2">{sellerData.address}, {sellerData.pincode}</p>
                </div>

                <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h4 className="font-bold text-gray-700 mb-2">KYC & Bank</h4>
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
                    className="w-1/2 py-3 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition"
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
