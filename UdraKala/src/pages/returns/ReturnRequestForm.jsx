import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createReturnRequest } from '../../api/returnApi';
import Swal from 'sweetalert2';
import { CloudArrowUpIcon, PhotoIcon } from '@heroicons/react/24/outline';

const ReturnRequestForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { order, orderItem } = location.state || {};

    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [proofImageFile, setProofImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!order || !orderItem) {
        return <div className="p-8 text-center text-status-error">Invalid access to return form. Please select an order first.</div>;
    }

    const reasons = [
        { value: 'WRONG_PRODUCT', label: 'Wrong Product Received' },
        { value: 'DAMAGED', label: 'Damaged Product' },
        { value: 'QUALITY_ISSUE', label: 'Quality Issue' },
        { value: 'MISSING_PARTS', label: 'Missing Parts/Accessories' },
        { value: 'NOT_AS_DESCRIBED', label: 'Product not as described' },
        { value: 'OTHER', label: 'Other' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reason) {
            Swal.fire('Error', 'Please select a reason for return', 'error');
            return;
        }

        if ((reason === 'DAMAGED' || reason === 'WRONG_PRODUCT') && !proofImageFile) {
            Swal.fire('Error', 'Proof image is required for this reason', 'error');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('orderId', order.id);
            formData.append('orderItemId', orderItem.id);
            formData.append('reason', reason);
            formData.append('description', description);

            if (imageFile) {
                formData.append('image', imageFile);
            }
            if (proofImageFile) {
                formData.append('proofImage', proofImageFile);
            }

            await createReturnRequest(formData);
            Swal.fire('Success', 'Return request submitted successfully', 'success')
                .then(() => navigate('/customer/returns'));
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Failed to submit return request', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-bg-surface dark:bg-bg-dark rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-text-primary dark:text-text-onDark border-b pb-2">Request Return</h2>

            {/* Product Info */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-bg-page dark:bg-bg-dark rounded-lg">
                {orderItem.product?.images?.[0] ? (
                    <img
                        src={orderItem.product.images[0]}
                        alt={orderItem.product?.productTitle}
                        className="w-20 h-20 object-cover rounded-md"
                    />
                ) : (
                    <div className="w-20 h-20 bg-bg-band dark:bg-bg-dark rounded-md flex items-center justify-center">
                        <PhotoIcon className="h-8 w-8 text-text-secondary dark:text-text-secondary" />
                    </div>
                )}
                <div>
                    <h3 className="font-semibold text-text-primary dark:text-text-onDark">{orderItem.product?.productTitle}</h3>
                    <p className="text-sm text-text-secondary dark:text-text-secondary">Qty: {orderItem.quantity} | Price: ₹{orderItem.price}</p>
                    <p className="text-xs text-text-secondary">Order ID: {order.id}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Reason Selection */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-2">Reason for Return *</label>
                    <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full p-2 border border-border dark:border-border rounded-md bg-bg-surface dark:bg-bg-dark text-text-primary dark:text-text-onDark focus:ring-2 focus:ring-primary"
                        required
                    >
                        <option value="">Select a reason</option>
                        {reasons.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                    </select>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-2">Description / Comments</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                        className="w-full p-2 border border-border dark:border-border rounded-md bg-bg-surface dark:bg-bg-dark text-text-primary dark:text-text-onDark focus:ring-2 focus:ring-primary"
                        placeholder="Please modify details about the issue..."
                    ></textarea>
                </div>

                {/* Image Uploads (Simulated with text input for URL for now, meant to be file upload in real app but keeping simple as per request context if no file upload hook exists) */}
                {/* Note: In a real app we would use a file upload component. Assuming URL input for simplicity unless I see file upload utility. I see 'uploads' dir so maybe local file upload is supported. 
                    I'll stick to text input for image URLs as per prompt 'image_url' and 'proof_image_url' are strings in DB. 
                    Ideally this should be a file uploader that returns a URL. 
                    For now I will provide input fields for URLs to keep it strictly aligned with the backend DTO expectation of string URLs, 
                    but I will assume the user has a way to get these URLs or I should implement a basic upload if I had time. 
                    Given the constraints, I will use text inputs but label them clearly.
                */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-2">Product Image (Optional)</label>
                    <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-bg-page text-text-secondary text-sm">
                            <PhotoIcon className="h-5 w-5" />
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-border dark:border-border bg-bg-surface dark:bg-bg-dark text-text-primary dark:text-text-onDark focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </div>
                </div>

                {(reason === 'DAMAGED' || reason === 'WRONG_PRODUCT') && (
                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-2">
                            Proof Image <span className="text-status-error">*</span>
                        </label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-bg-page text-text-secondary text-sm">
                                <CloudArrowUpIcon className="h-5 w-5" />
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setProofImageFile(e.target.files[0])}
                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-border dark:border-border bg-bg-surface dark:bg-bg-dark text-text-primary dark:text-text-onDark focus:ring-primary focus:border-primary sm:text-sm"
                                required
                            />
                        </div>
                        <p className="text-xs text-text-secondary mt-1">Required for Damaged or Wrong Product claims.</p>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 border border-border rounded-md text-text-secondary dark:text-text-secondary hover:bg-bg-page dark:hover:bg-bg-dark transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-primary text-text-onDark rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition"
                    >
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default ReturnRequestForm;
