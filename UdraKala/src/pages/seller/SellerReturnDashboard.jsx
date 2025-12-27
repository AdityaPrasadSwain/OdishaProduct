import React, { useEffect, useState } from 'react';
import { getSellerReturns, updateSellerDecision } from '../../api/returnApi';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const SellerReturnDashboard = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReturns = async () => {
        try {
            setLoading(true);
            const data = await getSellerReturns();
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

    const handleDecision = async (id, approved) => {
        const action = approved ? 'Approve' : 'Reject';

        const { value: remarks } = await Swal.fire({
            title: `${action} Return Request?`,
            input: 'textarea',
            inputLabel: 'Remarks',
            inputPlaceholder: 'Type your remarks here...',
            inputAttributes: {
                'aria-label': 'Type your remarks here'
            },
            showCancelButton: true
        });

        if (remarks !== undefined) { // If user didn't cancel
            try {
                await updateSellerDecision(id, { approved, remarks: remarks || (approved ? 'Approved by seller' : 'Rejected by seller') });
                Swal.fire('Success', `Return request ${action}d successfully`, 'success');
                fetchReturns();
            } catch (error) {
                Swal.fire('Error', error.response?.data?.message || 'Failed to update request', 'error');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'REQUESTED': return 'bg-yellow-100 text-yellow-800';
            case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800';
            case 'APPROVED_BY_SELLER': return 'bg-green-100 text-green-800';
            case 'REJECTED_BY_SELLER': return 'bg-red-100 text-red-800';
            case 'APPROVED_BY_ADMIN': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="p-8 text-center dark:text-gray-300">Loading returns...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Return Management</h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reason</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {returns.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">No return requests found</td>
                                </tr>
                            ) : (
                                returns.map((req) => (
                                    <tr key={req.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <img className="h-10 w-10 rounded-full object-cover" src={req.productImage || 'https://via.placeholder.com/40'} alt="" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{req.productName}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Qty: 1</div> {/* Assuming qty 1 for simplified view */}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">{req.customerName}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">{req.reason.replace(/_/g, ' ')}</div>
                                            {req.imageUrl && <a href={req.imageUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">View Image</a>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(req.status)}`}>
                                                {req.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {format(new Date(req.createdAt), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {(req.status === 'REQUESTED' || req.status === 'UNDER_REVIEW') && (
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleDecision(req.id, true)} className="text-green-600 hover:text-green-900" title="Approve">
                                                        <CheckCircleIcon className="h-5 w-5" />
                                                    </button>
                                                    <button onClick={() => handleDecision(req.id, false)} className="text-red-600 hover:text-red-900" title="Reject">
                                                        <XCircleIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SellerReturnDashboard;
