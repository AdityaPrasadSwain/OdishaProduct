import React, { useState, useEffect } from 'react';
import API from '../../../api/api';
import { RefreshCcw, Check, X, AlertCircle } from 'lucide-react';
import Card from '../../../components/ui/Card';

const RefundManager = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchReturns();
    }, []);

    const fetchReturns = async () => {
        try {
            const res = await API.get('/returns/admin');
            setReturns(res.data);
        } catch (error) {
            console.error("Failed to fetch returns", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDecision = async (id, approved, adminNote) => {
        setProcessingId(id);
        try {
            await API.put(`/returns/${id}/admin-decision`, {
                approved,
                adminNote
            });
            fetchReturns(); // Refresh list
        } catch (error) {
            console.error("Failed to update decision", error);
            alert("Action failed!");
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading refund requests...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Refund Management</h2>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Order/Item</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Customer Reason</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Seller Decision</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Current Status</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Admin Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {returns.map((ret) => (
                            <tr key={ret.id}>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                    <div className="font-medium text-gray-900 dark:text-white">Order #{ret.orderId?.substring(0, 8)}</div>
                                    <div className="text-xs text-gray-500">Method: {ret.refundMethod}</div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                    <div className="text-red-600 font-medium text-xs uppercase">{ret.reason}</div>
                                    <div className="text-gray-600 dark:text-gray-400 text-xs italic">"{ret.description}"</div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                    {ret.sellerDecision === 'APPROVED' ? (
                                        <span className="text-green-600 font-bold text-xs flex items-center gap-1"><Check size={12} /> Approved</span>
                                    ) : ret.sellerDecision === 'REJECTED' ? (
                                        <span className="text-red-600 font-bold text-xs flex items-center gap-1"><X size={12} /> Rejected</span>
                                    ) : (
                                        <span className="text-gray-400 text-xs text-center border px-2 rounded-full">Pending</span>
                                    )}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                        ${ret.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                            ret.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                'bg-blue-100 text-blue-800'}`}>
                                        {ret.status}
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm space-x-2">
                                    {/* Only show actions if not already completed/rejected */}
                                    {['REQUESTED', 'APPROVED_BY_SELLER', 'IN_TRANSIT'].includes(ret.status) && (
                                        <>
                                            <button
                                                disabled={processingId === ret.id}
                                                onClick={() => {
                                                    const note = prompt("Approval Note (Transaction ID):", "");
                                                    if (note) handleDecision(ret.id, true, note);
                                                }}
                                                className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                                            >
                                                Process Refund
                                            </button>
                                            <button
                                                disabled={processingId === ret.id}
                                                onClick={() => {
                                                    const note = prompt("Rejection Reason:", "");
                                                    if (note) handleDecision(ret.id, false, note);
                                                }}
                                                className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {returns.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-5 py-5 bg-white dark:bg-gray-800 text-center text-gray-500">
                                    No refund requests found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RefundManager;
