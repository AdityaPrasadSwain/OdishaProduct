import React, { useState } from 'react';
import axios from 'axios';
import api from '../../../api/axios';
import Swal from 'sweetalert2';

const GstVerification = ({ onNext, onSkip, token }) => {
    const [formData, setFormData] = useState({
        gstNumber: '',
        businessName: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/seller/kyc/gst/verify', formData);
            Swal.fire('Success', 'GST Verified Successfully', 'success');
            onNext(response.data);
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'GST Verification Failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Step 3: GST Verification (Optional)</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">GSTIN</label>
                    <input
                        type="text"
                        value={formData.gstNumber}
                        onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                        maxLength={15}
                        className="mt-1 w-full border border-gray-300 rounded-md p-2 uppercase"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
                    <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onSkip}
                        className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition"
                    >
                        Skip
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                        {loading ? 'Verifying...' : 'Verify GST'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GstVerification;
