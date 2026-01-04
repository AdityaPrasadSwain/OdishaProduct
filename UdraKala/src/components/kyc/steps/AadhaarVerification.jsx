import React, { useState } from 'react';
import axios from 'axios';
import api from '../../../api/axios';
import Swal from 'sweetalert2';

const AadhaarVerification = ({ onNext, token }) => {
    const [aadhaarNumber, setAadhaarNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (aadhaarNumber.length !== 12) {
            Swal.fire('Error', 'Aadhaar must be 12 digits', 'error');
            return;
        }

        setLoading(true);
        try {
            await api.post('/seller/kyc/aadhaar/send-otp', { aadhaarNumber });
            setShowOtpModal(true);
            Swal.fire('OTP Sent', 'Check your registered mobile number', 'info');
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Failed to send OTP', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            const response = await api.post('/seller/kyc/aadhaar/verify-otp', {
                aadhaarNumber,
                otp
            });
            Swal.fire('Success', 'Aadhaar Verified Successfully', 'success');
            setShowOtpModal(false);
            onNext(response.data);
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Invalid OTP', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Step 2: Aadhaar Verification</h3>

            {!showOtpModal ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
                        <input
                            type="text"
                            value={aadhaarNumber}
                            onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                            maxLength={12}
                            className="mt-1 w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">We do not store your Aadhaar number.</p>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition disabled:bg-gray-400"
                    >
                        {loading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                </form>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            className="mt-1 w-full border border-gray-300 rounded-md p-2 text-center tracking-widest text-xl"
                        />
                    </div>
                    <button
                        onClick={handleVerifyOtp}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                    <button
                        onClick={() => setShowOtpModal(false)}
                        className="w-full text-gray-500 text-sm hover:underline"
                    >
                        Back to Aadhaar Input
                    </button>
                </div>
            )}
        </div>
    );
};

export default AadhaarVerification;
