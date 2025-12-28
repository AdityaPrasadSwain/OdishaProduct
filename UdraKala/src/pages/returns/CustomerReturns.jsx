import React, { useEffect, useState } from 'react';
import { getCustomerReturns, cancelReturnRequest } from '../../api/returnApi';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { TrashIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import ReturnTimeline from './ReturnTimeline';

const CustomerReturns = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    const fetchReturns = async () => {
        try {
            setLoading(true);
            const data = await getCustomerReturns();
            // Sort by newest
            if (Array.isArray(data)) {
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setReturns(data);
            }
        } catch (error) {
            console.error("Error fetching returns", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReturns();
    }, []);

    const handleCancel = async (id, e) => {
        e.stopPropagation();
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

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'APPROVED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'REJECTED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            case 'PICKUP_SCHEDULED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'REFUND_INITIATED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
            case 'COMPLETED': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading returns...</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">My Returns & Replacements</h1>

            {returns.length === 0 ? (
                <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">No return requests found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {returns.map((req) => (
                        <div
                            key={req.id}
                            onClick={() => toggleExpand(req.id)}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200"
                        >
                            <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">

                                {/* Product Info */}
                                <div className="flex gap-4 items-center">
                                    <img
                                        src={req.productImage || 'https://via.placeholder.com/80'}
                                        alt={req.productName}
                                        className="w-16 h-16 object-cover rounded-lg border dark:border-gray-700"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md border ${req.type === 'REPLACE'
                                                    ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900'
                                                    : 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:border-orange-900'
                                                }`}>
                                                {req.type}
                                            </span>
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full ${getStatusColor(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{req.productName}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Reason: <span className="text-gray-700 dark:text-gray-300">{req.reason.replace(/_/g, ' ')}</span></p>
                                    </div>
                                </div>

                                {/* Actions / Toggle */}
                                <div className="flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0 justify-between md:justify-end">
                                    <div className="text-right hidden md:block">
                                        <p className="text-xs text-gray-400">Requested on</p>
                                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{format(new Date(req.createdAt), 'MMM d, yyyy')}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {req.status === 'PENDING' && (
                                            <button
                                                onClick={(e) => handleCancel(req.id, e)}
                                                className="flex items-center gap-1 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-xs font-medium px-3 py-1.5 rounded-lg transition"
                                            >
                                                <TrashIcon className="h-3.5 w-3.5" /> Cancel
                                            </button>
                                        )}
                                        <div className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition">
                                            {expandedId === req.id ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedId === req.id && (
                                <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 animate-fade-in">
                                    {/* Timeline */}
                                    <div className="mb-8">
                                        <ReturnTimeline status={req.status} type={req.type} />
                                    </div>

                                    {/* Additional Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                        <div>
                                            <h4 className="font-medium text-gray-500 dark:text-gray-400 text-xs uppercase mb-2">Request Details</h4>
                                            <div className="space-y-2">
                                                <p><span className="text-gray-400">Desciption:</span> <span className="text-gray-800 dark:text-gray-200">{req.description || 'No description provided.'}</span></p>
                                                <p><span className="text-gray-400">Refund Method:</span> <span className="text-gray-800 dark:text-gray-200 font-mono">{req.refundMethod || 'N/A'}</span></p>
                                                {req.refundDetails && <p><span className="text-gray-400">Account/UPI:</span> <span className="text-gray-800 dark:text-gray-200">{req.refundDetails}</span></p>}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-500 dark:text-gray-400 text-xs uppercase mb-2">Seller/Admin Remarks</h4>
                                            <div className="space-y-2">
                                                {req.sellerRemarks ? (
                                                    <p className="text-gray-800 dark:text-gray-200 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded border border-yellow-100 dark:border-yellow-900/30">{req.sellerRemarks}</p>
                                                ) : (
                                                    <p className="text-gray-400 italic">No remarks yet.</p>
                                                )}
                                                {req.adminComment && (
                                                    <p className="text-red-700 dark:text-red-300 text-xs mt-2">Admin Note: {req.adminComment}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerReturns;
