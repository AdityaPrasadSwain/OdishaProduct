import { useState, useEffect } from 'react';
import { getWalletOverview, initiatePayout } from '../../api/payoutApi';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { Wallet, CreditCard, Clock, CheckCircle, XCircle, DollarSign, TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SellerWallet = () => {
    const [walletData, setWalletData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchWallet = async () => {
        try {
            setLoading(true);
            const data = await getWalletOverview();
            setWalletData(data);
        } catch (error) {
            console.error("Failed to fetch wallet data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallet();
    }, []);

    const handleWithdraw = async () => {
        if (!walletData || walletData.currentBalance <= 0) return;

        const result = await Swal.fire({
            title: 'Initiate Payout?',
            text: `Withdraw ₹${walletData.currentBalance}? This will be processed to your registered bank account.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#5747C7',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Withdraw'
        });

        if (result.isConfirmed) {
            try {
                Swal.showLoading();
                await initiatePayout();
                Swal.fire({
                    icon: 'success',
                    title: 'Payout Initiated',
                    text: 'Amount has been queued for transfer.',
                    timer: 2000
                });
                fetchWallet();
            } catch (error) {
                Swal.fire('Error', error.response?.data || 'Failed to initiate payout', 'error');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Chart Data Preparation (Mocking trend for visual appeal or using history)
    const payouts = walletData?.recentPayouts || [];
    const chartData = {
        labels: payouts.slice(0, 5).reverse().map(p => new Date(p.processedAt).toLocaleDateString()),
        datasets: [
            {
                label: 'Payouts',
                data: payouts.slice(0, 5).reverse().map(p => p.totalAmount),
                borderColor: 'rgb(234, 88, 12)',
                backgroundColor: 'rgba(234, 88, 12, 0.5)',
                tension: 0.4
            }
        ]
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text-primary dark:text-text-onDark flex items-center gap-2">
                <Wallet className="text-primary" /> My Wallet
            </h2>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Balance Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-text-onDark shadow-lg relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Wallet size={64} />
                    </div>
                    <p className="text-primary font-medium mb-1">Available Balance</p>
                    <h3 className="text-4xl font-bold mb-4">₹{walletData?.currentBalance?.toLocaleString() || '0'}</h3>
                    <button
                        onClick={handleWithdraw}
                        disabled={!walletData || walletData.currentBalance <= 0}
                        className="bg-bg-surface text-primary px-4 py-2 rounded-lg font-semibold shadow hover:bg-bg-band transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <CreditCard size={18} /> Withdraw Money
                    </button>
                    <p className="text-xs text-primary mt-3 align-bottom">
                        Minimum withdrawal limit: ₹100
                    </p>
                </motion.div>

                {/* Total Withdrawn */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-bg-surface dark:bg-bg-dark rounded-2xl p-6 shadow-sm border border-border dark:border-border relative"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-text-secondary dark:text-text-secondary font-medium mb-1">Total Withdrawn</p>
                            <h3 className="text-3xl font-bold text-text-primary dark:text-text-onDark">₹{walletData?.totalWithdrawn?.toLocaleString() || '0'}</h3>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-status-success">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="mt-4 h-24">
                        {/* Mini Chart can go here, for now placeholder */}
                        <div className="text-xs text-text-secondary italic">Lifetime earnings withdrawn to bank.</div>
                    </div>
                </motion.div>

                {/* Next Payout Info (Mock/Static for visual balance) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-bg-surface dark:bg-bg-dark rounded-2xl p-6 shadow-sm border border-border dark:border-border"
                >
                    <p className="text-text-secondary dark:text-text-secondary font-medium mb-1">Payout Status</p>
                    <div className="flex items-center gap-2 mt-2">
                        <CheckCircle className="text-status-success" size={20} />
                        <span className="text-text-secondary dark:text-text-secondary font-medium">Bank Account Verified</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border dark:border-border">
                        <p className="text-sm text-text-secondary dark:text-text-secondary">Next settlement cycle:</p>
                        <p className="font-semibold text-text-primary dark:text-text-onDark">Instant (On Request)</p>
                    </div>
                </motion.div>
            </div>

            {/* Transaction History Graph */}
            {payouts.length > 0 && (
                <div className="bg-bg-surface dark:bg-bg-dark p-6 rounded-2xl shadow-sm border border-border dark:border-border">
                    <h3 className="text-lg font-bold mb-4 dark:text-text-onDark">Payout Trend</h3>
                    <div className="h-64">
                        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            )}

            {/* Recent Payouts Table */}
            <div className="bg-bg-surface dark:bg-bg-dark rounded-xl shadow-sm border border-border dark:border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border dark:border-border">
                    <h3 className="font-bold text-text-primary dark:text-text-onDark">Recent Payouts</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-bg-page dark:bg-bg-dark/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Reference ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {walletData?.recentPayouts?.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-text-secondary">
                                        No payout history found.
                                    </td>
                                </tr>
                            ) : (
                                walletData?.recentPayouts?.map((payout) => (
                                    <tr key={payout.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-text-secondary dark:text-text-secondary">
                                            {payout.payoutReference || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-text-primary dark:text-text-onDark">
                                            ₹{payout.totalAmount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary">
                                            {new Date(payout.processedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${payout.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                                                    payout.status === 'FAILED' ? 'text-status-error text-status-error' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {payout.status}
                                            </span>
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

export default SellerWallet;
