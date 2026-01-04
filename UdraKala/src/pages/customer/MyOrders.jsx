import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCustomerOrders } from '../../api/orderApi';
import { motion as Motion } from 'motion/react';
import { Package, ChevronRight, Clock, Filter, X } from 'lucide-react';

import OrderSkeleton from '../../components/skeletons/OrderSkeleton';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter State
    const [filters, setFilters] = useState({
        status: 'ALL',
        range: 'ALL',
        from: '',
        to: ''
    });

    useEffect(() => {
        console.log("MyOrders mounted, rendering filters");
        fetchOrders();
    }, [filters]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getCustomerOrders(filters);
            if (Array.isArray(data)) {
                // Backend does sorting, but keeping frontend sort as fallback/safety
                // data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(data);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error("Error fetching filtered orders:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ status: 'ALL', range: 'ALL', from: '', to: '' });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b dark:border-gray-700 pb-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>

                    {/* Active Filters Summary */}
                    {(filters.status !== 'ALL' || filters.range !== 'ALL') && (
                        <div className="flex flex-wrap gap-2">
                            {filters.status !== 'ALL' && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                                    Status: {filters.status}
                                </span>
                            )}
                            {filters.range !== 'ALL' && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                    Range: {filters.range}
                                </span>
                            )}
                            <button
                                onClick={clearFilters}
                                className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors"
                            >
                                <X size={14} /> Clear
                            </button>
                        </div>
                    )}
                </div>

                {/* Filter Bar */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 transition-all">
                    <div className="flex flex-wrap items-end gap-4">
                        {/* Status Filter */}
                        <div className="w-full sm:w-auto">
                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="w-full sm:w-40 p-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 outline-none transition"
                            >
                                <option value="ALL">All Status</option>
                                <option value="Placed">Placed</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Returned">Returned</option>
                            </select>
                        </div>

                        {/* Range Filter */}
                        <div className="w-full sm:w-auto">
                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Time Range</label>
                            <select
                                value={filters.range}
                                onChange={(e) => handleFilterChange('range', e.target.value)}
                                className="w-full sm:w-48 p-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 outline-none transition"
                            >
                                <option value="ALL">All Time</option>
                                <option value="DAY">Today</option>
                                <option value="WEEK">Last 7 Days</option>
                                <option value="MONTH">Last 30 Days</option>
                                <option value="CUSTOM">Custom Range</option>
                            </select>
                        </div>

                        {/* Custom Date Inputs */}
                        {filters.range === 'CUSTOM' && (
                            <>
                                <div className="w-1/2 sm:w-auto">
                                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">From</label>
                                    <input
                                        type="date"
                                        value={filters.from}
                                        onChange={(e) => handleFilterChange('from', e.target.value)}
                                        className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                                <div className="w-1/2 sm:w-auto">
                                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">To</label>
                                    <input
                                        type="date"
                                        value={filters.to}
                                        onChange={(e) => handleFilterChange('to', e.target.value)}
                                        className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Orders List */}
                {loading ? (
                    <OrderSkeleton />
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                        <Filter size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h2 className="text-xl font-medium text-gray-900 dark:text-white">No orders found</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filters or search criteria.</p>
                        <button
                            onClick={clearFilters}
                            className="text-orange-600 hover:text-orange-500 font-medium mt-4 inline-block"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => (
                            <Motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Order ID: <span className="font-mono text-gray-900 dark:text-white select-all">#{String(order.id).substring(0, 8)}</span></p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                                <Clock size={14} /> {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                                    order.status === 'SHIPPED' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' :
                                                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                }`}>
                                                {order.status.replace(/_/g, ' ')}
                                            </span>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">₹{order.totalAmount}</p>
                                        </div>
                                    </div>

                                    {/* Items Preview */}
                                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex items-center justify-between">
                                        <div className="flex -space-x-3 overflow-hidden pl-1">
                                            {order.orderItems?.slice(0, 4).map((item, idx) => (
                                                <img
                                                    key={idx}
                                                    src={item.product?.images?.[0]?.imageUrl || item.product?.imageUrl || '/placeholder.png'}
                                                    alt={item.product?.name}
                                                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-800 object-cover bg-gray-50"
                                                    title={item.product?.name}
                                                />
                                            ))}
                                            {order.orderItems?.length > 4 && (
                                                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-300 ring-2 ring-white dark:ring-gray-800">
                                                    +{order.orderItems.length - 4}
                                                </div>
                                            )}
                                        </div>

                                        <Link
                                            to={`/customer/track-order/${order.id}`}
                                            className="flex items-center text-orange-600 hover:text-orange-700 font-medium text-sm transition group"
                                        >
                                            Track & Details
                                            <ChevronRight size={16} className="ml-0.5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </Motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
