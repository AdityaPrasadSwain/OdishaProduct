import React, { useState, useEffect } from 'react';
import API from '../../../api/api';
import { CheckCircle, XCircle, CreditCard, ExternalLink, Loader } from 'lucide-react';
import Card from '../../../components/ui/Card';

const SellerPayoutManager = () => {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchSellers();
    }, []);

    const fetchSellers = async () => {
        try {
            const res = await API.get('/admin/payouts/bank-details');
            setSellers(res.data);
        } catch (error) {
            console.error("Failed to fetch seller bank details", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id, isVerify) => {
        setProcessingId(id);
        try {
            if (isVerify) {
                await API.put(`/admin/payouts/bank-details/${id}/verify`);
            } else {
                await API.put(`/admin/payouts/bank-details/${id}/reject`);
            }
            fetchSellers();
        } catch (error) {
            console.error("Action failed", error);
            alert("Failed to update status");
        } finally {
            setProcessingId(null);
        }
    };

    const initiatePayout = async (sellerId) => {
        if (!window.confirm("Are you sure you want to initiate payout for this seller?")) return;

        setProcessingId(sellerId);
        try {
            await API.post(`/admin/payouts/initiate/${sellerId}`);
            alert("Payout Initiated Successfully!");
            // Ideally refresh headers or logs here
        } catch (error) {
            console.error("Payout failed", error);
            alert(error.response?.data?.message || "Payout failed");
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading payout data...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Seller Bank Verifications & Payouts</h2>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Seller</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Bank Details</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Verification</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sellers.map((seller) => (
                            <tr key={seller.id}>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                    <div className="flex items-center">
                                        <div className="ml-3">
                                            <p className="text-gray-900 dark:text-white font-medium">{seller.fullName}</p>
                                            <p className="text-gray-500 text-xs">{seller.shopName}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                    {seller.bankDetails ? (
                                        <div className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                                            <p><span className="font-semibold">Acct:</span> {seller.bankDetails.accountNumber}</p>
                                            <p><span className="font-semibold">IFSC:</span> {seller.bankDetails.ifscCode}</p>
                                            <p><span className="font-semibold">Holder:</span> {seller.bankDetails.accountHolderName}</p>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 italic">No details added</span>
                                    )}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                    {seller.bankDetails?.verified ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Verified
                                        </span>
                                    ) : (
                                        seller.bankDetails ? (
                                            <div className="flex gap-2">
                                                <button
                                                    disabled={processingId === seller.id}
                                                    onClick={() => handleVerify(seller.id, true)}
                                                    className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button
                                                    disabled={processingId === seller.id}
                                                    onClick={() => handleVerify(seller.id, false)}
                                                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-yellow-600 text-xs">Pending Data</span>
                                        )
                                    )}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                    <button
                                        onClick={() => initiatePayout(seller.id)}
                                        disabled={!seller.bankDetails?.verified || processingId === seller.id}
                                        className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-semibold
                                            ${!seller.bankDetails?.verified
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'}`}
                                    >
                                        {processingId === seller.id ? <Loader className="animate-spin" size={14} /> : <CreditCard size={14} />}
                                        Pay Now
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {sellers.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-5 py-5 bg-white dark:bg-gray-800 text-center text-gray-500">
                                    No sellers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SellerPayoutManager;
