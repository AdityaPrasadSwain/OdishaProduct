import React, { useEffect, useState } from 'react';
import { getCustomerReturns, cancelReturnRequest } from '../../api/returnApi';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline';

const CustomerReturns = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReturns = async () => {
        try {
            setLoading(true);
            const data = await getCustomerReturns();
            setReturns(data);
        } catch (error) {
            console.error("Error fetching returns", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReturns();
    }, []);

    const handleCancel = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await cancelReturnRequest(id);
                    Swal.fire('Cancelled!', 'Your return request has been cancelled.', 'success');
                    fetchReturns();
                } catch (error) {
                    Swal.fire('Error', 'Failed to cancel request.', 'error');
                }
            }
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'REQUESTED': return 'bg-yellow-100 text-yellow-800';
            case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800';
            case 'APPROVED_BY_SELLER': return 'bg-green-100 text-green-800';
            case 'REJECTED_BY_SELLER': return 'bg-red-100 text-red-800';
            case 'REFUND_DONE': return 'bg-green-200 text-green-900';
            case 'CLOSED': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="p-8 text-center">Loading returns...</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">My Returns</h1>

            {returns.length === 0 ? (
                <div className="text-center p-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">No return requests found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {returns.map((req) => (
                        <div key={req.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">

                                {/* Product Info */}
                                <div className="flex gap-4">
                                    <img
                                        src={req.productImage || 'https://via.placeholder.com/80'}
                                        alt={req.productName}
                                        className="w-16 h-16 object-cover rounded-md border"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{req.productName}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Order ID: {req.orderId}</p>
                                        <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(req.status)}`}>
                                            {req.status.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex-1 md:px-8">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <span className="font-medium">Reason:</span> {req.reason.replace(/_/g, ' ')}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Requested on: {format(new Date(req.createdAt), 'PPP')}
                                    </p>
                                    {req.adminComment && (
                                        <p className="text-xs text-red-500 mt-1">Admin Note: {req.adminComment}</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {/* Placeholder for View Details if needed, for now just simple view */}
                                    {req.status === 'REQUESTED' && (
                                        <button
                                            onClick={() => handleCancel(req.id)}
                                            className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded-md hover:bg-red-50 transition"
                                        >
                                            <TrashIcon className="h-4 w-4" /> Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerReturns;
