import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../api/orderApi';
import { motion as Motion } from 'motion/react';
import { Package, ChevronRight, Clock } from 'lucide-react';

import OrderSkeleton from '../../components/skeletons/OrderSkeleton';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getMyOrders();
            // Sort by date desc (Added safety check)
            if (Array.isArray(data)) {
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(data);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <OrderSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b dark:border-gray-700 pb-4">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-20">
                        <Package size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h2 className="text-xl font-medium text-gray-900 dark:text-white">No orders yet</h2>
                        <Link to="/products" className="text-orange-600 hover:text-orange-500 mt-2 inline-block">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => (
                            <Motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Order ID: <span className="font-mono text-gray-900 dark:text-white">{order.id}</span></p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                <Clock size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                }`}>
                                                {order.status}
                                            </span>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">₹{order.totalAmount}</p>
                                        </div>
                                    </div>

                                    {/* Items Preview */}
                                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex items-center justify-between">
                                        <div className="flex -space-x-3 overflow-hidden">
                                            {order.orderItems.slice(0, 4).map((item, idx) => (
                                                <img
                                                    key={idx}
                                                    src={item.product.images?.[0]?.imageUrl || item.product.imageUrl || '/placeholder.png'}
                                                    alt={item.product.name}
                                                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-800 object-cover"
                                                />
                                            ))}
                                            {order.orderItems.length > 4 && (
                                                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500 dark:text-gray-300 ring-2 ring-white dark:ring-gray-800">
                                                    +{order.orderItems.length - 4}
                                                </div>
                                            )}
                                        </div>

                                        <Link
                                            to={`/customer/track-order/${order.id}`}
                                            className="flex items-center text-orange-600 hover:text-orange-700 font-medium text-sm transition"
                                        >
                                            Track & Details <ChevronRight size={16} />
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
