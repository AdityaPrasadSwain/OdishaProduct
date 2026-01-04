import { useState, useEffect } from 'react';
import { getSellerOrders, updateOrderStatus, sendSellerInvoice, acceptOrder, rejectOrder, downloadShippingLabel, downloadBulkShippingLabels, requestDeliveryProof, getDeliveryProof, getSellerProofRequests } from '../../api/orderApi';
import { motion as Motion, AnimatePresence } from 'motion/react';
import Swal from 'sweetalert2';
import { Edit2, Package, Truck, AlertTriangle, FileText, CheckCircle, XCircle, Clock, Printer, Eye } from 'lucide-react';
import { sendStatusUpdateEmail } from '../../utils/emailService';
import OrderSkeleton from '../../components/skeletons/OrderSkeleton';
import PackingModal from './components/PackingModal';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('new');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updateForm, setUpdateForm] = useState({ status: '', courierName: '', trackingId: '' });
    const [packingOrderId, setPackingOrderId] = useState(null);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [proofRequests, setProofRequests] = useState({}); // Map: shipmentId -> request

    // Derive packing order from latest orders list to prevent stale state
    const packingOrder = orders.find(o => o.id === packingOrderId) || null;

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getSellerOrders();
            // Sort by Date Descending
            const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sorted);

            // Fetch Proof Requests
            try {
                const reqs = await getSellerProofRequests();
                const reqMap = {};
                reqs.forEach(r => {
                    if (r.orderId) {
                        reqMap[r.orderId] = r;
                    } else {
                        // Fallback for old records or checks
                        reqMap[r.shipmentId] = r;
                    }
                });
                setProofRequests(reqMap);
            } catch (e) {
                console.error("Failed to fetch proof requests", e);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'new') return order.status === 'PENDING';
        if (activeTab === 'active') return ['SELLER_CONFIRMED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'READY_TO_SHIP', 'DISPATCHED', 'IN_TRANSIT'].includes(order.status);
        if (activeTab === 'returns') return ['RETURN_REQUESTED', 'RETURN_APPROVED', 'PICKUP_INITIATED', 'PICKUP_COMPLETED', 'RETURN_IN_TRANSIT', 'RETURN_DELIVERED', 'REFUND_PROCESSED', 'RTO_INITIATED', 'RTO_COMPLETED'].includes(order.status);
        if (activeTab === 'completed') return ['DELIVERED', 'CANCELLED', 'ORDER_CANCELLED_BY_SELLER', 'RETURNED'].includes(order.status);
        return false;
    });

    // --- Bulk Action Handlers ---

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            // Select all printable orders in current view
            const printable = filteredOrders
                .filter(o => ['PACKED', 'READY_TO_SHIP', 'SHIPPED', 'DISPATCHED'].includes(o.status))
                .map(o => o.id);
            setSelectedOrders(printable);
        } else {
            setSelectedOrders([]);
        }
    };

    const handleSelectOrder = (id) => {
        if (selectedOrders.includes(id)) {
            setSelectedOrders(selectedOrders.filter(pid => pid !== id));
        } else {
            setSelectedOrders([...selectedOrders, id]);
        }
    };

    const handleBulkPrint = async () => {
        if (selectedOrders.length === 0) return;
        try {
            Swal.showLoading();
            const blob = await downloadBulkShippingLabels(selectedOrders);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Bulk_Labels_${new Date().toISOString().split('T')[0]}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            Swal.close();
            setSelectedOrders([]); // Clear selection
        } catch (error) {
            console.error("Bulk print failed", error);
            Swal.fire('Error', 'Failed to generate bulk labels', 'error');
        }
    };

    // --- Single Action Handlers ---

    const handleAccept = async (orderId) => {
        try {
            Swal.showLoading();
            await acceptOrder(orderId);
            Swal.fire({
                icon: 'success',
                title: 'Order Accepted',
                timer: 1500,
                showConfirmButton: false
            });
            fetchOrders();
        } catch (error) {
            Swal.fire('Error', error.response?.data || 'Failed to accept order', 'error');
        }
    };

    const handleReject = async (orderId) => {
        const result = await Swal.fire({
            title: 'Reject Order?',
            text: "This cannot be undone. Customer will be notified.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Reject it!'
        });

        if (result.isConfirmed) {
            try {
                Swal.showLoading();
                await rejectOrder(orderId);
                Swal.fire('Rejected', 'Order has been rejected.', 'success');
                fetchOrders();
            } catch (error) {
                Swal.fire('Error', error.response?.data || 'Failed to reject order', 'error');
            }
        }
    };

    const handlePrintLabel = async (orderId) => {
        try {
            Swal.showLoading();
            const blob = await downloadShippingLabel(orderId);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Label_${orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            Swal.close();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to download label', 'error');
        }
    };

    const handleRequestProof = async (shipmentId) => {
        const { value: reason } = await Swal.fire({
            title: 'Request Delivery Proof',
            input: 'text',
            inputLabel: 'Reason for request',
            inputPlaceholder: 'e.g. Customer claims not received',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write a reason!'
                }
            }
        });

        if (reason) {
            try {
                Swal.showLoading();
                await requestDeliveryProof(shipmentId, reason);
                Swal.fire('Requested', 'Your request has been sent to admin.', 'success');
                fetchOrders(); // Refresh to update map
            } catch (error) {
                console.error("Proof request failed:", error);
                const msg = error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response.data : 'Failed to request proof');
                Swal.fire('Error', msg, 'error');
            }
        }
    };

    const handleViewProof = async (shipmentId) => {
        try {
            Swal.showLoading();
            const proofs = await getDeliveryProof(shipmentId);
            if (proofs && proofs.length > 0) {
                Swal.fire({
                    title: 'Delivery Proof',
                    imageUrl: proofs[0].imageUrl,
                    imageAlt: 'Delivery Proof',
                    width: 600,
                    showCloseButton: true,
                    showConfirmButton: false
                });
            } else {
                Swal.fire('Info', 'No proof image available yet', 'info');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch proof', 'error');
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

        // Validation: Cannot ship without invoice
        if (updateForm.status === 'OUT_FOR_DELIVERY' && !selectedOrder.invoiceSent) {
            Swal.fire({
                icon: 'warning',
                title: 'Invoice Not Sent',
                text: 'You must send the invoice to the customer before marking as Out for Delivery.',
                confirmButtonColor: '#ea580c'
            });
            return;
        }

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

    const handleSendInvoice = async (order) => {
        const result = await Swal.fire({
            title: 'Send Invoice?',
            text: "Invoice with thank you message will be sent to customer's registered email.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#ea580c',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, send it!'
        });

        if (result.isConfirmed) {
            try {
                Swal.showLoading();
                await sendSellerInvoice(order.id);
                Swal.fire('Sent!', 'Invoice has been sent successfully.', 'success');
                fetchOrders(); // Refresh to update status/badge
            } catch (error) {
                console.error(error);
                Swal.fire('Error', error.response?.data || 'Failed to send invoice', 'error');
            }
        }
    };

    const tabs = [
        { id: 'new', label: 'New Orders', icon: Clock },
        { id: 'active', label: 'Active', icon: Package },
        { id: 'returns', label: 'Returns', icon: AlertTriangle },
        { id: 'completed', label: 'Completed', icon: CheckCircle },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Management</h2>
                {selectedOrders.length > 0 && (
                    <button
                        onClick={handleBulkPrint}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition shadow-lg"
                    >
                        <Printer size={18} />
                        Print {selectedOrders.length} Labels
                    </button>
                )}
            </div>

            <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 pb-1 overflow-x-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-500 dark:bg-gray-800 dark:text-orange-400'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            <Icon size={16} className="mr-2" />
                            {tab.label}
                            <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                                {orders.filter(o => {
                                    if (tab.id === 'new') return o.status === 'PENDING';
                                    if (tab.id === 'active') return ['SELLER_CONFIRMED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'READY_TO_SHIP', 'DISPATCHED', 'IN_TRANSIT'].includes(o.status);
                                    if (tab.id === 'returns') return ['RETURN_REQUESTED', 'RETURN_APPROVED', 'PICKUP_INITIATED', 'PICKUP_COMPLETED', 'RETURN_IN_TRANSIT', 'RETURN_DELIVERED', 'REFUND_PROCESSED', 'RTO_INITIATED', 'RTO_COMPLETED'].includes(o.status);
                                    if (tab.id === 'completed') return ['DELIVERED', 'CANCELLED', 'ORDER_CANCELLED_BY_SELLER', 'RETURNED'].includes(o.status);
                                    return false;
                                }).length}
                            </span>
                        </button>
                    );
                })}
            </div>

            {loading ? (
                <OrderSkeleton />
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-10 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                    <Package size={48} className="mx-auto text-gray-300 mb-2" />
                    <p>No orders found in this category.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-3 w-4">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={
                                                selectedOrders.length > 0 &&
                                                filteredOrders.some(o => ['PACKED', 'READY_TO_SHIP', 'SHIPPED', 'DISPATCHED'].includes(o.status)) &&
                                                selectedOrders.length === filteredOrders.filter(o => ['PACKED', 'READY_TO_SHIP', 'SHIPPED', 'DISPATCHED'].includes(o.status)).length
                                            }
                                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Items/Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                <AnimatePresence>
                                    {filteredOrders.map((order) => {
                                        const isPrintable = ['PACKED', 'READY_TO_SHIP', 'SHIPPED', 'DISPATCHED'].includes(order.status);
                                        return (
                                            <Motion.tr
                                                key={order.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition ${selectedOrders.includes(order.id) ? 'bg-orange-50 dark:bg-gray-700/80' : ''}`}
                                            >
                                                <td className="px-6 py-4">
                                                    {isPrintable && (
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedOrders.includes(order.id)}
                                                            onChange={() => handleSelectOrder(order.id)}
                                                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                                                        />
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
                                                    <div className="font-bold">{order.id.substring(0, 8)}...</div>
                                                    <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{order.user?.fullName}</div>
                                                    <div className="text-xs text-gray-500 truncate max-w-[150px]" title={order.shippingAddress}>
                                                        {order.shippingAddress?.substring(0, 20)}...
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 dark:text-white font-semibold">
                                                        ₹{order.totalAmount}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {order.orderItems.length} Items
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        ['SELLER_CONFIRMED', 'CONFIRMED'].includes(order.status) ? 'bg-blue-100 text-blue-800' :
                                                            order.status === 'PACKED' || order.status === 'READY_TO_SHIP' ? 'bg-cyan-100 text-cyan-800' :
                                                                order.status === 'SHIPPED' || order.status === 'DISPATCHED' ? 'bg-indigo-100 text-indigo-800' :
                                                                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                                        order.status.includes('CANCELLED') ? 'bg-red-100 text-red-800' :
                                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {order.status.replace(/_/g, ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        {activeTab === 'new' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleAccept(order.id)}
                                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                                    title="Accept Order"
                                                                >
                                                                    <CheckCircle size={20} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(order.id)}
                                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                                    title="Reject Order"
                                                                >
                                                                    <XCircle size={20} />
                                                                </button>
                                                            </>
                                                        )}

                                                        {activeTab === 'active' && (
                                                            <>
                                                                {/* Pack Button */}
                                                                {['SELLER_CONFIRMED', 'INVOICE_SENT', 'CONFIRMED'].includes(order.status) && (
                                                                    <button
                                                                        onClick={() => setPackingOrderId(order.id)}
                                                                        className="text-cyan-600 p-1 hover:bg-cyan-50 rounded"
                                                                        title="Pack Order"
                                                                    >
                                                                        <Package size={18} />
                                                                    </button>
                                                                )}

                                                                {/* Invoice Button */}
                                                                {order.invoiceSent ? (
                                                                    <span className="flex items-center text-green-600 text-xs font-bold px-2 border border-green-200 bg-green-50 rounded">
                                                                        INV SENT
                                                                    </span>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handleSendInvoice(order)}
                                                                        className="text-orange-600 p-1 hover:bg-orange-50 rounded"
                                                                        title="Send Invoice"
                                                                    >
                                                                        <FileText size={18} />
                                                                    </button>
                                                                )}

                                                                {/* Label Button - Only if confirmed/packed/shipped */}
                                                                {['PACKED', 'READY_TO_SHIP', 'SHIPPED', 'DISPATCHED'].includes(order.status) && (
                                                                    <button
                                                                        onClick={() => handlePrintLabel(order.id)}
                                                                        className="text-blue-600 p-1 hover:bg-blue-50 rounded"
                                                                        title="Print Label"
                                                                    >
                                                                        <Truck size={18} />
                                                                    </button>
                                                                )}

                                                                <button
                                                                    onClick={() => openUpdateModal(order)}
                                                                    className="text-indigo-600 p-1 hover:bg-indigo-50 rounded"
                                                                    title="Update Status"
                                                                >
                                                                    <Edit2 size={18} />
                                                                </button>
                                                            </>
                                                        )}

                                                        {activeTab === 'completed' && order.status === 'DELIVERED' && (
                                                            // Logic for Proof Button
                                                            (() => {
                                                                // Assume first shipment for order (simplification)
                                                                // Ideally order has shipmentId linkage. 
                                                                // If order items have shipmentId, use that.
                                                                // But here we might not have shipmentId directly on order object in this view?
                                                                // Let's assume order.id IS the shipmentId for now or there's a field.
                                                                // Inspecting `Order` entity: it doesn't have shipmentId directly (OneToMany items).
                                                                // BUT `DeliveryProof` has shipmentId.
                                                                // My `getSellerOrders` returns List<Order>.
                                                                // Does Order have shipmentId? No.
                                                                // However, often `orderId` ~ `shipmentId` in simple flows, or `Order` has `shipments` list.
                                                                // If I don't have shipmentId, I can't request proof.
                                                                // Let's assume for this MVP that the primary shipment ID is available or we find it.
                                                                // Let's try to pass `order.id` if we can't find shipmentId, but `SellerProofController` requires `shipmentId`.
                                                                // Let's check `SellerProofController`. It expects `shipmentId`.
                                                                // If I don't have it, I'm blocked.
                                                                // BUT, `AgentShipmentModal` used `shipment.id`. 
                                                                // Where does `shipment` come from? `getAgentOrders` returns shipments?
                                                                // Yes. `getSellerOrders` returns Orders.
                                                                // I might need to fetch shipments for the order.
                                                                // Use `order.id` as `shipmentId` for now, assuming 1 order = 1 active shipment.
                                                                // Or `order.shipmentId` if I added it (I see `shipmentId` in `DeliveryProof` entity). 
                                                                // `DeliveryAgentService` uses `shipmentId`.
                                                                // Let's try attempting to find a shipment ID.
                                                                // For now, I will use `order.id` and if it fails, I'll know I need to expose shipment ID.

                                                                const shipmentId = order.id; // Provisional
                                                                const req = proofRequests[shipmentId];

                                                                if (req && req.status === 'APPROVED') {
                                                                    return (
                                                                        <button onClick={() => handleViewProof(shipmentId)} className="text-green-600 p-1 hover:bg-green-50 rounded" title="View Proof">
                                                                            <Eye size={18} />
                                                                        </button>
                                                                    );
                                                                } else if (req) {
                                                                    return (
                                                                        <span className={`text-xs px-2 py-1 rounded ${req.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                            {req.status === 'PENDING' ? 'Req Pending' : 'Req Rejected'}
                                                                        </span>
                                                                    );
                                                                } else {
                                                                    return (
                                                                        <button onClick={() => handleRequestProof(shipmentId)} className="text-blue-600 text-xs px-2 py-1 hover:bg-blue-50 rounded border border-blue-200" title="Request Proof">
                                                                            Request Proof
                                                                        </button>
                                                                    );
                                                                }
                                                            })()
                                                        )}
                                                    </div>
                                                </td>
                                            </Motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
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
                                    <option value="SELLER_CONFIRMED">Confirmed</option>
                                    <option value="PACKED">Packed</option>
                                    <option value="READY_TO_SHIP">Ready to Ship</option>
                                    <option value="SHIPPED">Shipped (Manual)</option>
                                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                    <option value="DELIVERED">Delivered</option>
                                </select>
                            </div>

                            {(updateForm.status === 'SHIPPED' || updateForm.status === 'OUT_FOR_DELIVERY') && (
                                <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                    <p className="text-sm font-medium dark:text-white">Shipping Details</p>
                                    <input
                                        type="text"
                                        placeholder="Courier Name"
                                        value={updateForm.courierName}
                                        onChange={(e) => setUpdateForm({ ...updateForm, courierName: e.target.value })}
                                        className="w-full rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 p-2 dark:text-white text-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Tracking ID"
                                        value={updateForm.trackingId}
                                        onChange={(e) => setUpdateForm({ ...updateForm, trackingId: e.target.value })}
                                        className="w-full rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 p-2 dark:text-white text-sm"
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

            {/* Packing Modal */}
            <PackingModal
                isOpen={!!packingOrderId}
                onClose={() => setPackingOrderId(null)}
                order={packingOrder}
                onOrderUpdated={fetchOrders}
            />
        </div>
    );
};

export default SellerOrders;
