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
            case 'processing': return 'bg-primary-light text-primary dark:bg-primary-hover/30 dark:text-primary';
            case 'shipped': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            default: return 'bg-bg-band text-text-secondary dark:bg-bg-dark/30 dark:text-text-secondary';
        }
    };

    return (
        <div className="bg-bg-surface dark:bg-bg-dark rounded-xl shadow-sm border border-border dark:border-transparent dark:shadow-[0_4px_6px_rgba(0,0,0,0.4)] overflow-hidden">
            <div className="p-6 border-b border-border dark:border-white/5 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-text-primary dark:text-text-onDark">Recent Orders</h3>
                <button className="text-primary dark:text-primary text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-bg-page/50 dark:bg-white/[0.02]">
                            <th className="p-4 text-xs font-semibold text-text-secondary dark:text-text-secondary uppercase tracking-wider">Order ID</th>
                            <th className="p-4 text-xs font-semibold text-text-secondary dark:text-text-secondary uppercase tracking-wider">Customer</th>
                            <th className="p-4 text-xs font-semibold text-text-secondary dark:text-text-secondary uppercase tracking-wider">Product</th>
                            <th className="p-4 text-xs font-semibold text-text-secondary dark:text-text-secondary uppercase tracking-wider">Date</th>
                            <th className="p-4 text-xs font-semibold text-text-secondary dark:text-text-secondary uppercase tracking-wider">Amount</th>
                            <th className="p-4 text-xs font-semibold text-text-secondary dark:text-text-secondary uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-semibold text-text-secondary dark:text-text-secondary uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 dark:divide-white/5">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-primary/5 dark:hover:bg-white/[0.03] transition-colors">
                                <td className="p-4 text-sm font-medium text-text-primary dark:text-text-onDark">{order.id}</td>
                                <td className="p-4 text-sm text-text-secondary dark:text-text-secondary">{order.customer}</td>
                                <td className="p-4 text-sm text-text-secondary dark:text-text-secondary">{order.product}</td>
                                <td className="p-4 text-sm text-text-secondary dark:text-text-secondary">{order.date}</td>
                                <td className="p-4 text-sm font-medium text-text-primary dark:text-text-onDark">{order.amount}</td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button className="p-1.5 hover:bg-bg-band dark:hover:bg-bg-dark rounded-lg text-text-secondary hover:text-text-secondary dark:hover:text-text-secondary transition-colors">
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
