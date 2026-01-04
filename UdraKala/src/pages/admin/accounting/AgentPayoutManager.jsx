import React, { useState, useEffect } from 'react';
import API from '../../../api/api';
import { IndianRupee, CheckSquare, Clock, Search } from 'lucide-react';
import Card from '../../../components/ui/Card';

const AgentPayoutManager = () => {
    const [earnings, setEarnings] = useState([]); // All earnings records
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, PAID, PENDING
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchEarnings();
    }, []);

    const fetchEarnings = async () => {
        try {
            const res = await API.get('/admin/logistics/agent-earnings');
            setEarnings(res.data);
        } catch (error) {
            console.error("Failed to fetch agent earnings", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async (earningId) => {
        const ref = window.prompt("Enter Transaction Reference/ID:");
        if (!ref) return;

        setProcessing(true);
        try {
            await API.post(`/admin/logistics/agent-earnings/${earningId}/pay`, { transactionRef: ref });
            alert("Payment recorded successfully!");
            fetchEarnings();
        } catch (error) {
            console.error("Payment failed", error);
            alert("Failed to record payment.");
        } finally {
            setProcessing(false);
        }
    };

    /* 
       Note: Batch payment logic can be added here if we implement multi-select table.
       For now, individual payment recording is safer.
    */

    const filteredEarnings = earnings.filter(e => {
        if (filter === 'ALL') return true;
        return e.status === filter;
    });

    if (loading) return <div className="p-10 text-center text-gray-500">Loading agent data...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Delivery Agent Payouts</h2>

                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={`px-3 py-1 text-sm rounded-full ${filter === 'ALL' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >All</button>
                    <button
                        onClick={() => setFilter('PENDING')}
                        className={`px-3 py-1 text-sm rounded-full ${filter === 'PENDING' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >Pending</button>
                    <button
                        onClick={() => setFilter('PAID')}
                        className={`px-3 py-1 text-sm rounded-full ${filter === 'PAID' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >Paid</button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Agent Name</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Period/Order</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEarnings.map((earning) => (
                            <tr key={earning.id}>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                    <p className="text-gray-900 dark:text-white font-medium">{earning.agentName || 'Unknown Agent'}</p>
                                    <p className="text-gray-500 text-xs">ID: {earning.agentId?.substring(0, 8)}...</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                    {/* Assuming earning usually ties to an item or period */}
                                    <p className="text-gray-700 dark:text-gray-300">{earning.orderId ? `Order: ${earning.orderId.substring(0, 8)}` : 'Ad-hoc'}</p>
                                    <p className="text-gray-500 text-xs">{new Date(earning.createdAt).toLocaleDateString()}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                    <span className="font-bold text-gray-800 dark:text-gray-100 flex items-center">
                                        <IndianRupee size={12} /> {earning.amount}
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                        ${earning.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {earning.status}
                                    </span>
                                    {earning.transactionReference && (
                                        <p className="text-xs text-gray-500 mt-1">Ref: {earning.transactionReference}</p>
                                    )}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                    {earning.status === 'PENDING' && (
                                        <button
                                            onClick={() => handlePay(earning.id)}
                                            disabled={processing}
                                            className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-dark transition shadow-sm"
                                        >
                                            Pay
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredEarnings.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-5 py-5 bg-white dark:bg-gray-800 text-center text-gray-500">
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgentPayoutManager;
