import React, { useState, useEffect } from 'react';
import {
    BanknotesIcon,
    ArrowPathIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    CheckCircleIcon,
    XCircleIcon,
    CurrencyRupeeIcon
} from '@heroicons/react/24/outline';
import PayoutDetailsModal from './PayoutDetailsModal';
import PayoutConfirmationModal from './PayoutConfirmationModal';

// Mock Data (Replace with API fetch)
const MOCK_SELLERS = [
    {
        id: 1,
        name: "Aditya Swain",
        shopName: "Odisha Handlooms",
        email: "aditya@example.com",
        phone: "9876543210",
        bankName: "HDFC Bank",
        bankAccountNumber: "12345678901234",
        ifscCode: "HDFC0001234",
        accountHolderName: "Aditya Prasad Swain",
        isBankVerified: true,
        pendingEarnings: [
            { id: 101, orderId: "ORD-8723", grossAmount: 2500, commission: 125, gstAmount: 22.5, netAmount: 2352.5, payoutStatus: "PENDING" },
            { id: 102, orderId: "ORD-9921", grossAmount: 1200, commission: 60, gstAmount: 10.8, netAmount: 1129.2, payoutStatus: "PENDING" }
        ]
    },
    {
        id: 2,
        name: "Rahul Kumar",
        shopName: "Rahul Textiles",
        email: "rahul@example.com",
        phone: "9123456780",
        bankName: "SBI",
        bankAccountNumber: "987654321098",
        ifscCode: "SBIN0004567",
        accountHolderName: "Rahul Kumar",
        isBankVerified: false,
        pendingEarnings: [
            { id: 103, orderId: "ORD-1122", grossAmount: 5000, commission: 250, gstAmount: 45, netAmount: 4705, payoutStatus: "PENDING" }
        ]
    },
    {
        id: 3,
        name: "Priya Singh",
        shopName: "Priya Creations",
        email: "priya@example.com",
        phone: "9988776655",
        bankName: "ICICI Bank",
        bankAccountNumber: "556677889900",
        ifscCode: "ICIC0003344",
        accountHolderName: "Priya Singh",
        isBankVerified: true,
        pendingEarnings: []
    }
];

const AdminPayoutDashboard = () => {
    const [sellers, setSellers] = useState(MOCK_SELLERS);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [payoutData, setPayoutData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL"); // ALL, PENDING, PAID, UNVERIFIED

    // Derived Stats
    const totalPendingPayouts = sellers.reduce((acc, seller) => {
        return acc + seller.pendingEarnings.reduce((sum, e) => sum + e.netAmount, 0);
    }, 0);

    const totalCommissionEarned = sellers.reduce((acc, seller) => {
        return acc + seller.pendingEarnings.reduce((sum, e) => sum + e.commission, 0);
    }, 0);

    const totalGstCollected = sellers.reduce((acc, seller) => {
        return acc + seller.pendingEarnings.reduce((sum, e) => sum + e.gstAmount, 0);
    }, 0);

    const platformBalance = totalCommissionEarned + totalGstCollected; // Simplistic view

    const handleViewDetails = (seller) => {
        setSelectedSeller(seller);
        setShowDetailsModal(true);
    };

    const handleInitiatePayout = (data) => {
        setPayoutData(data);
        setShowDetailsModal(false);
        setShowConfirmModal(true);
    };

    const handleConfirmPayout = () => {
        setIsProcessing(true);
        // Simulate API Call
        setTimeout(() => {
            setIsProcessing(false);
            setShowConfirmModal(false);
            // Update local state to reflect payout (in real app, refetch data)
            setSellers(prev => prev.map(s => {
                if (s.name === payoutData.sellerName) {
                    return { ...s, pendingEarnings: [] }; // Clear earnings
                }
                return s;
            }));
            alert(`Payout of ₹${payoutData.netAmount.toFixed(2)} to ${payoutData.sellerName} successful!`);
        }, 2000);
    };

    // Filtering Logic
    const filteredSellers = sellers.filter(seller => {
        const matchesSearch = seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            seller.shopName.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesStatus = true;
        if (filterStatus === 'UNVERIFIED') matchesStatus = !seller.isBankVerified;
        if (filterStatus === 'PENDING') matchesStatus = seller.pendingEarnings.length > 0;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Seller Payout Dashboard</h1>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <SummaryCard
                        title="Platform Balance"
                        amount={platformBalance}
                        icon={<BanknotesIcon className="h-6 w-6 text-blue-600" />}
                        color="bg-blue-50"
                    />
                    <SummaryCard
                        title="Pending Payouts"
                        amount={totalPendingPayouts}
                        icon={<ArrowPathIcon className="h-6 w-6 text-orange-600" />}
                        color="bg-orange-50"
                    />
                    <SummaryCard
                        title="Commission Earned"
                        amount={totalCommissionEarned}
                        icon={<CurrencyRupeeIcon className="h-6 w-6 text-green-600" />}
                        color="bg-green-50"
                    />
                    <SummaryCard
                        title="GST Collected"
                        amount={totalGstCollected}
                        icon={<CheckCircleIcon className="h-6 w-6 text-purple-600" />}
                        color="bg-purple-50"
                    />
                </div>

                {/* Filters & Actions */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mb-6">
                    <div className="relative w-full sm:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="Search seller by name or shop..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                        <div className="flex items-center space-x-2">
                            <FunnelIcon className="h-5 w-5 text-gray-500" />
                            <select
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="ALL">All Sellers</option>
                                <option value="PENDING">With Pending Payouts</option>
                                <option value="UNVERIFIED">Bank Unverified</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Sellers Table */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Status</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Sales</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Payable</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSellers.map((seller) => {
                                const netPayable = seller.pendingEarnings.reduce((acc, curr) => acc + curr.netAmount, 0);
                                const grossSales = seller.pendingEarnings.reduce((acc, curr) => acc + curr.grossAmount, 0);

                                return (
                                    <tr key={seller.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <span className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                                                        {seller.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{seller.name}</div>
                                                    <div className="text-sm text-gray-500">{seller.shopName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {seller.isBankVerified ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                    Unverified
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                            ₹{grossSales.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <span className={`text-sm font-bold ${netPayable > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                                ₹{netPayable.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <button
                                                onClick={() => handleViewDetails(seller)}
                                                className="text-primary-600 hover:text-primary-900"
                                            >
                                                View & Pay
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filteredSellers.length === 0 && (
                        <div className="text-center py-10 text-gray-500">No sellers found matching your criteria.</div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <PayoutDetailsModal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                seller={selectedSeller}
                onInitiatePayout={handleInitiatePayout}
            />

            <PayoutConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmPayout}
                payoutData={payoutData}
                isLoading={isProcessing}
            />
        </div>
    );
};

const SummaryCard = ({ title, amount, icon, color }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">₹{amount.toFixed(2)}</p>
        </div>
    </div>
);

export default AdminPayoutDashboard;
