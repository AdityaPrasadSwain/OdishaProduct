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
            confirmButtonColor: '#ea580c',
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Wallet className="text-orange-600" /> My Wallet
            </h2>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Balance Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Wallet size={64} />
                    </div>
                    <p className="text-orange-100 font-medium mb-1">Available Balance</p>
                    <h3 className="text-4xl font-bold mb-4">₹{walletData?.currentBalance?.toLocaleString() || '0'}</h3>
                    <button
                        onClick={handleWithdraw}
                        disabled={!walletData || walletData.currentBalance <= 0}
                        className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold shadow hover:bg-orange-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <CreditCard size={18} /> Withdraw Money
                    </button>
                    <p className="text-xs text-orange-200 mt-3 align-bottom">
                        Minimum withdrawal limit: ₹100
                    </p>
                </motion.div>

                {/* Total Withdrawn */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">Total Withdrawn</p>
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">₹{walletData?.totalWithdrawn?.toLocaleString() || '0'}</h3>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="mt-4 h-24">
                        {/* Mini Chart can go here, for now placeholder */}
                        <div className="text-xs text-gray-400 italic">Lifetime earnings withdrawn to bank.</div>
                    </div>
                </motion.div>

                {/* Next Payout Info (Mock/Static for visual balance) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">Payout Status</p>
                    <div className="flex items-center gap-2 mt-2">
                        <CheckCircle className="text-green-500" size={20} />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Bank Account Verified</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Next settlement cycle:</p>
                        <p className="font-semibold text-gray-800 dark:text-white">Instant (On Request)</p>
                    </div>
                </motion.div>
            </div>

            {/* Transaction History Graph */}
            {payouts.length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold mb-4 dark:text-white">Payout Trend</h3>
                    <div className="h-64">
                        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            )}

            {/* Recent Payouts Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-gray-800 dark:text-white">Recent Payouts</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {walletData?.recentPayouts?.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        No payout history found.
                                    </td>
                                </tr>
                            ) : (
                                walletData?.recentPayouts?.map((payout) => (
                                    <tr key={payout.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600 dark:text-gray-300">
                                            {payout.payoutReference || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                                            ₹{payout.totalAmount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(payout.processedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${payout.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                                                    payout.status === 'FAILED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
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
