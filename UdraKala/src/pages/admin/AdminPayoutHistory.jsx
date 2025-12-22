import React, { useState } from 'react';
import { ClipboardDocumentListIcon, CalendarIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const MOCK_HISTORY = [
    { id: 1, payoutRef: "TXN-7782-ABCD", sellerName: "Aditya Swain", amount: 15400.50, status: "SUCCESS", date: "2024-12-20T10:30:00" },
    { id: 2, payoutRef: "TXN-9981-XYZW", sellerName: "Rahul Textiles", amount: 4200.00, status: "SUCCESS", date: "2024-12-19T14:15:00" },
    { id: 3, payoutRef: "TXN-3321-FAIL", sellerName: "Priya Creations", amount: 1200.00, status: "FAILED", date: "2024-12-18T09:00:00" },
];

const AdminPayoutHistory = () => {
    const [history, setHistory] = useState(MOCK_HISTORY);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const filteredHistory = history.filter(item => {
        const matchesSearch = item.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.payoutRef.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <ClipboardDocumentListIcon className="h-8 w-8 text-gray-600" />
                        <h1 className="text-2xl font-bold text-gray-900">Payout History</h1>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mb-6">
                    <div className="relative w-full sm:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="Search by seller or ref ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <select
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">All Status</option>
                            <option value="SUCCESS">Success</option>
                            <option value="FAILED">Failed</option>
                            <option value="PROCESSING">Processing</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredHistory.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                                        {item.payoutRef}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.sellerName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                                            {new Date(item.date).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                                        ₹{item.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <StatusBadge status={item.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredHistory.length === 0 && (
                        <div className="text-center py-10 text-gray-500">No history found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        SUCCESS: "bg-green-100 text-green-800",
        FAILED: "bg-red-100 text-red-800",
        PROCESSING: "bg-yellow-100 text-yellow-800"
    };

    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || "bg-gray-100 text-gray-800"}`}>
            {status}
        </span>
    );
};

export default AdminPayoutHistory;
