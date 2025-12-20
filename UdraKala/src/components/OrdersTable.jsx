import React from 'react';
import { Eye, MoreVertical } from 'lucide-react';

const OrdersTable = ({ data }) => {
    const orders = data || [
        { id: '#ORD-001', customer: 'Arun Kumar', product: 'Sambalpuri Saree', date: '2023-10-15', amount: '₹12,000', status: 'Delivered' },
        { id: '#ORD-002', customer: 'Priya Singh', product: 'Pattachitra Painting', date: '2023-10-14', amount: '₹4,500', status: 'Processing' },
        { id: '#ORD-003', customer: 'John Doe', product: 'Konark Wheel Replica', date: '2023-10-14', amount: '₹2,100', status: 'Shipped' },
        { id: '#ORD-004', customer: 'Sarah Smith', product: 'Tussar Silk Cloth', date: '2023-10-13', amount: '₹8,900', status: 'Pending' },
    ];

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'shipped': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
                <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                            <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{order.id}</td>
                                <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{order.customer}</td>
                                <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{order.product}</td>
                                <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{order.date}</td>
                                <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{order.amount}</td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersTable;
