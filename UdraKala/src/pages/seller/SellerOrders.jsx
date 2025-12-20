import { useState, useEffect } from 'react';
import { getSellerOrders, updateOrderStatus } from '../../api/orderApi';
import { motion as Motion } from 'motion/react';
import Swal from 'sweetalert2';
import { Edit2, Package, Truck, Check, AlertTriangle } from 'lucide-react';
import { sendStatusUpdateEmail } from '../../utils/emailService';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null); // For modal
    const [updateForm, setUpdateForm] = useState({
        status: '',
        courierName: '',
        trackingId: ''
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getSellerOrders();
            console.log("Seller Orders Fetched:", data);
            if (Array.isArray(data)) {
                // Sort by date desc
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(data);
            } else {
                console.error("Unexpected response format:", data);
                setOrders([]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to fetch orders',
                text: 'Please check your connection and try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const openUpdateModal = (order) => {
        setSelectedOrder(order);
        setUpdateForm({
            status: order.status,
            courierName: order.courierName || '',
            trackingId: order.trackingId || ''
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateOrderStatus(selectedOrder.id, updateForm.status, updateForm.courierName, updateForm.trackingId);

            // Send Status Email
            try {
                if (selectedOrder.user && selectedOrder.user.email) {
                    await sendStatusUpdateEmail(
                        selectedOrder.user.email,
                        selectedOrder.user.fullName,
                        selectedOrder.id,
                        updateForm.status,
                        updateForm.courierName,
                        updateForm.trackingId
                    );
                }
            } catch (emailErr) {
                console.error("Failed to send status email:", emailErr);
            }

            setSelectedOrder(null);
            fetchOrders();
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
            Toast.fire({
                icon: 'success',
                title: 'Order Updated',
                text: `Order status changed to ${updateForm.status}`
            });
        } catch (ERROR) {
            console.error(ERROR);
            Swal.fire('Error', 'Failed to update order', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Management</h2>

            {loading ? (
                <div className="text-center py-10">Loading orders...</div>
            ) : orders.length === 0 ? (
                <div className="text-center py-10 dark:text-gray-400">No orders received yet.</div>
            ) : (
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">{order.id.substring(0, 8)}...</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{order.user?.fullName}</div>
                                            <div className="text-xs text-gray-500">{order.shippingAddress?.substring(0, 20)}...</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {order.orderItems.length} Items
                                            </div>
                                            <div className="text-xs text-gray-500 truncate max-w-xs">{order.orderItems.map(i => i.product.name).join(', ')}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">₹{order.totalAmount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                                    order.status === 'PACKED' ? 'bg-purple-100 text-purple-800' :
                                                        order.status === 'SHIPPED' ? 'bg-indigo-100 text-indigo-800' :
                                                            order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                                'bg-red-100 text-red-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => openUpdateModal(order)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                <Edit2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Update Status Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <Motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl border border-gray-200 dark:border-gray-700"
                    >
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Update Status</h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                <select
                                    value={updateForm.status}
                                    onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                                    className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 p-2 dark:text-white"
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="CONFIRMED">Confirmed</option>
                                    <option value="PACKED">Packed</option>
                                    <option value="SHIPPED">Shipped</option>
                                    <option value="DELIVERED">Delivered</option>
                                </select>
                            </div>

                            {updateForm.status === 'SHIPPED' && (
                                <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                    <p className="text-sm font-medium dark:text-white">Shipping Details</p>
                                    <input
                                        type="text"
                                        placeholder="Courier Name"
                                        value={updateForm.courierName}
                                        onChange={(e) => setUpdateForm({ ...updateForm, courierName: e.target.value })}
                                        className="w-full rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 p-2 dark:text-white text-sm"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Tracking ID"
                                        value={updateForm.trackingId}
                                        onChange={(e) => setUpdateForm({ ...updateForm, trackingId: e.target.value })}
                                        className="w-full rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 p-2 dark:text-white text-sm"
                                        required
                                    />
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setSelectedOrder(null)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Update</button>
                            </div>
                        </form>
                    </Motion.div>
                </div>
            )}
        </div>
    );
};

export default SellerOrders;
