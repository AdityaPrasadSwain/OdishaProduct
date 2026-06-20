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

    if (loading) return <div className="p-10 text-center text-text-secondary">Loading agent data...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-text-primary dark:text-text-onDark">Delivery Agent Payouts</h2>

                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={`px-3 py-1 text-sm rounded-full ${filter === 'ALL' ? 'bg-bg-dark text-text-onDark' : 'bg-bg-band text-text-secondary'}`}
                    >All</button>
                    <button
                        onClick={() => setFilter('PENDING')}
                        className={`px-3 py-1 text-sm rounded-full ${filter === 'PENDING' ? 'bg-primary text-text-onDark' : 'bg-bg-band text-text-secondary'}`}
                    >Pending</button>
                    <button
                        onClick={() => setFilter('PAID')}
                        className={`px-3 py-1 text-sm rounded-full ${filter === 'PAID' ? 'bg-status-success text-text-onDark' : 'bg-bg-band text-text-secondary'}`}
                    >Paid</button>
                </div>
            </div>

            <div className="bg-bg-surface dark:bg-bg-dark rounded-lg shadow overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-border dark:border-border bg-bg-band dark:bg-bg-dark text-left text-xs font-semibold text-text-secondary dark:text-text-secondary uppercase tracking-wider">Agent Name</th>
                            <th className="px-5 py-3 border-b-2 border-border dark:border-border bg-bg-band dark:bg-bg-dark text-left text-xs font-semibold text-text-secondary dark:text-text-secondary uppercase tracking-wider">Period/Order</th>
                            <th className="px-5 py-3 border-b-2 border-border dark:border-border bg-bg-band dark:bg-bg-dark text-left text-xs font-semibold text-text-secondary dark:text-text-secondary uppercase tracking-wider">Amount</th>
                            <th className="px-5 py-3 border-b-2 border-border dark:border-border bg-bg-band dark:bg-bg-dark text-left text-xs font-semibold text-text-secondary dark:text-text-secondary uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3 border-b-2 border-border dark:border-border bg-bg-band dark:bg-bg-dark text-left text-xs font-semibold text-text-secondary dark:text-text-secondary uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEarnings.map((earning) => (
                            <tr key={earning.id}>
                                <td className="px-5 py-5 border-b border-border dark:border-border bg-bg-surface dark:bg-bg-dark text-sm">
                                    <p className="text-text-primary dark:text-text-onDark font-medium">{earning.agentName || 'Unknown Agent'}</p>
                                    <p className="text-text-secondary text-xs">ID: {earning.agentId?.substring(0, 8)}...</p>
                                </td>
                                <td className="px-5 py-5 border-b border-border dark:border-border bg-bg-surface dark:bg-bg-dark text-sm">
                                    {/* Assuming earning usually ties to an item or period */}
                                    <p className="text-text-secondary dark:text-text-secondary">{earning.orderId ? `Order: ${earning.orderId.substring(0, 8)}` : 'Ad-hoc'}</p>
                                    <p className="text-text-secondary text-xs">{new Date(earning.createdAt).toLocaleDateString()}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-border dark:border-border bg-bg-surface dark:bg-bg-dark text-sm">
                                    <span className="font-bold text-text-primary dark:text-text-secondary flex items-center">
                                        <IndianRupee size={12} /> {earning.amount}
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-border dark:border-border bg-bg-surface dark:bg-bg-dark text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                        ${earning.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {earning.status}
                                    </span>
                                    {earning.transactionReference && (
                                        <p className="text-xs text-text-secondary mt-1">Ref: {earning.transactionReference}</p>
                                    )}
                                </td>
                                <td className="px-5 py-5 border-b border-border dark:border-border bg-bg-surface dark:bg-bg-dark text-sm">
                                    {earning.status === 'PENDING' && (
                                        <button
                                            onClick={() => handlePay(earning.id)}
                                            disabled={processing}
                                            className="bg-primary text-text-onDark px-3 py-1 rounded text-xs hover:bg-primary-dark transition shadow-sm"
                                        >
                                            Pay
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredEarnings.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-5 py-5 bg-bg-surface dark:bg-bg-dark text-center text-text-secondary">
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
