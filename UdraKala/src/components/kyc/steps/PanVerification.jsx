import React, { useState } from 'react';
import axios from 'axios';
import api from '../../../api/axios';
import Swal from 'sweetalert2';

const PanVerification = ({ onNext, token }) => {
    const [formData, setFormData] = useState({
        panNumber: '',
        fullName: '',
        dob: ''
    });
    const [loading, setLoading] = useState(false);

    const PAN_REGEX = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value.toUpperCase() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!PAN_REGEX.test(formData.panNumber)) {
            Swal.fire('Error', 'Invalid PAN format. Example: ABCDE1234F', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/seller/kyc/pan/verify', formData);
            Swal.fire('Success', 'PAN Verified Successfully', 'success');
            onNext(response.data); // Pass updated status
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'PAN Verification Failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-bg-surface p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-text-primary">Step 1: PAN Verification</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Full Name (As per PAN)</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="mt-1 w-full border border-border rounded-md p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary">PAN Number</label>
                    <input
                        type="text"
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleChange}
                        maxLength={10}
                        className="mt-1 w-full border border-border rounded-md p-2 uppercase"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Date of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="mt-1 w-full border border-border rounded-md p-2"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-text-onDark py-2 rounded-md hover:bg-primary-hover transition disabled:bg-bg-band"
                >
                    {loading ? 'Verifying...' : 'Verify PAN'}
                </button>
            </form>
        </div>
    );
};

export default PanVerification;
