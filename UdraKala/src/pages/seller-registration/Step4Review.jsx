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
        <div className="flex justify-between py-2 border-b border-border dark:border-border last:border-0">
            <span className="text-text-secondary dark:text-text-secondary text-sm font-medium">{label}</span>
            <span className="text-text-primary dark:text-text-secondary text-sm font-bold text-right">{value || "-"}</span>
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-center text-text-primary dark:text-text-onDark">Review Details</h2>

            {/* Business Card Summary */}
            <div className="bg-bg-band dark:bg-primary-hover/10 p-4 rounded-xl border border-primary dark:border-primary/40 flex items-center gap-4">
                {sellerData.profilePhotoPreview ? (
                    <img
                        src={sellerData.profilePhotoPreview}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-border shadow"
                    />
                ) : (
                    <img
                        src={defaultUser}
                        alt="Default Profile"
                        className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-border shadow"
                    />
                )}
                <div>
                    <h3 className="font-bold text-lg text-primary dark:text-primary">{sellerData.businessName}</h3>
                    <p className="text-sm text-primary dark:text-primary">{sellerData.fullName}</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-bg-surface dark:bg-bg-dark p-4 rounded-lg border dark:border-border shadow-sm">
                    <h4 className="font-bold text-text-secondary dark:text-text-secondary mb-2">Business Address</h4>
                    <ReviewItem label="Type" value={sellerData.businessType} />
                    <ReviewItem label="City" value={sellerData.city} />
                    <ReviewItem label="State" value={sellerData.state} />
                    <p className="text-xs text-text-secondary dark:text-text-secondary mt-2">{sellerData.address}, {sellerData.pincode}</p>
                </div>

                <div className="bg-bg-surface dark:bg-bg-dark p-4 rounded-lg border dark:border-border shadow-sm">
                    <h4 className="font-bold text-text-secondary dark:text-text-secondary mb-2">KYC & Bank</h4>
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
                    className="w-1/2 py-3 bg-bg-band dark:bg-bg-dark text-text-primary dark:text-text-onDark rounded-lg font-bold hover:bg-bg-band dark:hover:bg-bg-dark transition"
                >
                    Edit
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-1/2 py-3 bg-status-success text-text-onDark rounded-lg font-bold hover:bg-green-700 transition shadow-lg disabled:opacity-70 flex justify-center items-center"
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
