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
    const [imageUrl, setImageUrl] = useState('');
    const [proofImageUrl, setProofImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    if (!order || !orderItem) {
        return <div className="p-8 text-center text-red-500">Invalid access to return form. Please select an order first.</div>;
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

        if ((reason === 'DAMAGED' || reason === 'WRONG_PRODUCT') && !proofImageUrl) {
            Swal.fire('Error', 'Proof image is required for this reason', 'error');
            return;
        }

        setLoading(true);
        try {
            await createReturnRequest({
                orderId: order.id,
                orderItemId: orderItem.id,
                reason,
                description,
                imageUrl,
                proofImageUrl
            });
            Swal.fire('Success', 'Return request submitted successfully', 'success')
                .then(() => navigate('/customer/returns'));
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Failed to submit return request', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-2">Request Return</h2>

            {/* Product Info */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <img
                    src={orderItem.product?.images?.[0] || 'https://via.placeholder.com/100'}
                    alt={orderItem.product?.productTitle}
                    className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">{orderItem.product?.productTitle}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Qty: {orderItem.quantity} | Price: ₹{orderItem.price}</p>
                    <p className="text-xs text-gray-400">Order ID: {order.id}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Reason Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason for Return *</label>
                    <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description / Comments</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Image URL (Optional)</label>
                    <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            <PhotoIcon className="h-5 w-5" />
                        </span>
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="https://..."
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Proof Image URL {(reason === 'DAMAGED' || reason === 'WRONG_PRODUCT') && <span className="text-red-500">*</span>}
                    </label>
                    <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            <CloudArrowUpIcon className="h-5 w-5" />
                        </span>
                        <input
                            type="text"
                            value={proofImageUrl}
                            onChange={(e) => setProofImageUrl(e.target.value)}
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="https://..."
                            required={reason === 'DAMAGED' || reason === 'WRONG_PRODUCT'}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Required for Damaged or Wrong Product claims.</p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
                    >
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default ReturnRequestForm;
