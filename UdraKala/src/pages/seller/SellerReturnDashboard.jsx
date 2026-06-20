import React, { useEffect, useState } from 'react';
import { getSellerReturns, updateSellerDecision } from '../../api/returnApi';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { CheckCircleIcon, XCircleIcon, PhotoIcon } from '@heroicons/react/24/outline';

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
            case 'UNDER_REVIEW': return 'bg-primary-light text-primary';
            case 'APPROVED_BY_SELLER': return 'bg-green-100 text-green-800';
            case 'REJECTED_BY_SELLER': return 'text-status-error text-status-error';
            case 'APPROVED_BY_ADMIN': return 'bg-purple-100 text-purple-800';
            default: return 'bg-bg-band text-text-primary';
        }
    };

    if (loading) return <div className="p-8 text-center dark:text-text-secondary">Loading returns...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-text-primary dark:text-text-onDark">Return Management</h1>

            <div className="bg-bg-surface dark:bg-bg-dark rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-bg-page dark:bg-bg-dark">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary uppercase tracking-wider">Reason</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary dark:text-text-secondary uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-bg-surface dark:bg-bg-dark divide-y divide-gray-200 dark:divide-gray-700">
                            {returns.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-text-secondary dark:text-text-secondary">No return requests found</td>
                                </tr>
                            ) : (
                                returns.map((req) => (
                                    <tr key={req.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    {req.productImage ? (
                                                        <img className="h-10 w-10 rounded-full object-cover" src={req.productImage} alt="" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-bg-band flex items-center justify-center">
                                                            <PhotoIcon className="h-6 w-6 text-text-secondary" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-text-primary dark:text-text-onDark">{req.productName}</div>
                                                    <div className="text-sm text-text-secondary dark:text-text-secondary">Qty: 1</div> {/* Assuming qty 1 for simplified view */}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-text-primary dark:text-text-onDark">{req.customerName}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-text-primary dark:text-text-onDark">{req.reason.replace(/_/g, ' ')}</div>
                                            {req.imageUrl && <a href={req.imageUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">View Image</a>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(req.status)}`}>
                                                {req.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary">
                                            {format(new Date(req.createdAt), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {(req.status === 'REQUESTED' || req.status === 'UNDER_REVIEW') && (
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleDecision(req.id, true)} className="text-status-success hover:text-green-900" title="Approve">
                                                        <CheckCircleIcon className="h-5 w-5" />
                                                    </button>
                                                    <button onClick={() => handleDecision(req.id, false)} className="text-status-error hover:text-status-error" title="Reject">
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
