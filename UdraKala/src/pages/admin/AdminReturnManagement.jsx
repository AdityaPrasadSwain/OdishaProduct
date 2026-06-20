import React, { useEffect, useState } from 'react';
import { getAdminReturns, updateAdminDecision, updateSellerDecision } from '../../api/returnApi'; // Utilizing updateSellerDecision if needed or just admin override
import Swal from 'sweetalert2';
import { format } from 'date-fns';

const AdminReturnManagement = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');

    const fetchReturns = async () => {
        try {
            setLoading(true);
            const data = await getAdminReturns();
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

    const handleStatusUpdate = async (id, newStatus) => {
        const { value: comment } = await Swal.fire({
            title: `Change Status to ${newStatus}?`,
            input: 'text',
            inputLabel: 'Admin Comment',
            inputPlaceholder: 'Optional comment...',
            showCancelButton: true
        });

        if (comment !== undefined) {
            try {
                await updateAdminDecision(id, { status: newStatus, comment });
                Swal.fire('Success', 'Status updated successfully', 'success');
                fetchReturns();
            } catch (error) {
                Swal.fire('Error', 'Failed to update status', 'error');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'APPROVED': return 'bg-green-100 text-green-800';
            case 'REJECTED': return 'text-status-error text-status-error';
            case 'PICKUP_SCHEDULED': return 'bg-primary-light text-primary';
            case 'REFUND_INITIATED': return 'bg-purple-100 text-purple-800';
            case 'COMPLETED': return 'bg-bg-band text-text-primary';
            default: return 'bg-bg-band text-text-primary';
        }
    };

    const filteredReturns = filterStatus === 'ALL' ? returns : returns.filter(r => r.status === filterStatus);

    if (loading) return <div className="p-8 text-center dark:text-text-secondary">Loading admin returns...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-text-primary dark:text-text-onDark">Admin Return Management</h1>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-2 border rounded-md dark:bg-bg-dark dark:text-text-onDark"
                >
                    <option value="ALL">All Statuses</option>
                    <option value="REQUESTED">Requested</option>
                    <option value="APPROVED_BY_SELLER">Approved by Seller</option>
                    <option value="REFUND_INITIATED">Refund Initiated</option>
                    <option value="CLOSED">Closed</option>
                </select>
            </div>

            <div className="bg-bg-surface dark:bg-bg-dark rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-bg-page dark:bg-bg-dark">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary uppercase tracking-wider">Seller</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-bg-surface dark:bg-bg-dark divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredReturns.map((req) => (
                                <tr key={req.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary">
                                        {req.id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary dark:text-text-onDark">
                                        {req.sellerName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary dark:text-text-onDark">
                                        {req.customerName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <select
                                            onChange={(e) => handleStatusUpdate(req.id, e.target.value)}
                                            value=""
                                            className="text-primary hover:text-primary text-sm border-none bg-transparent focus:ring-0 cursor-pointer"
                                        >
                                            <option value="" disabled>Update Status</option>
                                            <option value="APPROVED">Approve Override</option>
                                            <option value="REJECTED">Reject Override</option>
                                            <option value="REFUND_INITIATED">Initiate Refund</option>
                                            <option value="COMPLETED">Refund Done (Complete)</option>
                                            <option value="COMPLETED">Close</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminReturnManagement;
