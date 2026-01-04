import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOrderDetails, downloadCustomerInvoice, cancelOrder, getPackingVideo } from '../../api/orderApi';
import { createReturnRequest } from '../../api/returnApi';
import { motion as Motion } from 'motion/react';
import Swal from 'sweetalert2';
import {
    Check, Truck, RotateCw, Download, Star,
    MessageSquare, ChevronRight, MapPin, CreditCard,
    ShieldCheck, Package, AlertCircle, Video
} from 'lucide-react';
import ReviewModal from '../../components/customer/ReviewModal';
import reviewApi from '../../api/reviewApi';

const TrackOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloadingInvoice, setDownloadingInvoice] = useState(false);
    const [packingVideoUrl, setPackingVideoUrl] = useState(null);

    // Return State
    const [returnModalOpen, setReturnModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [returnReason, setReturnReason] = useState('');
    const [returnDescription, setReturnDescription] = useState('');
    const [returnType, setReturnType] = useState('REFUND');
    const [proofFile, setProofFile] = useState(null);

    // Review State
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewEligibility, setReviewEligibility] = useState({});
    const [selectedReviewProduct, setSelectedReviewProduct] = useState(null);
    const [selectedReviewOrderItemId, setSelectedReviewOrderItemId] = useState(null);
    const [editingReview, setEditingReview] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getOrderDetails(id);
                setOrder(data);
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'Could not fetch order details', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    useEffect(() => {
        if (order?.id) {
            const fetchVideo = async () => {
                try {
                    const data = await getPackingVideo(order.id);
                    if (data && data.url) {
                        setPackingVideoUrl(data.url);
                    }
                } catch (e) {
                    // Ignore if no video found
                }
            };
            fetchVideo();
        }
    }, [order]);

    useEffect(() => {
        if (order?.status === 'DELIVERED' && order.orderItems) {
            const checkAll = async () => {
                const eligibility = {};
                for (const item of order.orderItems) {
                    try {
                        const review = await reviewApi.getReviewByOrderItem(item.id);
                        eligibility[item.id] = review;
                    } catch (e) {
                        eligibility[item.id] = null;
                    }
                }
                setReviewEligibility(eligibility);
            };
            checkAll();
        }
    }, [order]);

    const handleDownloadInvoice = async () => {
        if (!order.invoiceAvailable) return;
        setDownloadingInvoice(true);
        try {
            const blob = await downloadCustomerInvoice(order.id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice_${order.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            Swal.fire('Error', 'Failed to download invoice', 'error');
        } finally {
            setDownloadingInvoice(false);
        }
    };

    const openReviewModal = (item, existingReview = null) => {
        setSelectedReviewProduct(item.product);
        setSelectedReviewOrderItemId(item.id);
        setEditingReview(existingReview);
        setReviewModalOpen(true);
    };

    const handleReviewSubmitted = () => {
        const fetchDetails = async () => {
            const data = await getOrderDetails(id);
            setOrder(data);
        };
        fetchDetails();
    };

    // Return Logic

    const handleCancelOrder = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to cancel this order?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!'
        });

        if (result.isConfirmed) {
            try {
                await cancelOrder(order.id);
                Swal.fire('Cancelled!', 'Your order has been cancelled.', 'success');
                const data = await getOrderDetails(id);
                setOrder(data);
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'Failed to cancel order', 'error');
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!order) return <div className="p-8 text-center text-red-500">Order not found</div>;

    const isDelivered = order.status === 'DELIVERED';
    const isCancelled = order.status === 'CANCELLED';

    // Steps for timeline
    const steps = [
        { status: 'CONFIRMED', label: 'Order Confirmed', date: order.createdAt },
        { status: 'PACKED', label: 'Packed by Seller', date: null },
        { status: 'SHIPPED', label: 'Shipped', date: null }, // Date could be courier date if tracked
        { status: 'OUT_FOR_DELIVERY', label: 'Out For Delivery', date: null },
        { status: 'DELIVERED', label: 'Delivered', date: isDelivered ? order.updatedAt : null }
    ];

    const getActiveStep = () => {
        const s = order.status;
        if (['DELIVERED', 'RETURN_REQUESTED', 'RETURNED', 'REPLACED', 'REPLACEMENT_REQUESTED', 'RTO_INITIATED', 'RTO_COMPLETED'].includes(s)) return 4;
        if (s === 'OUT_FOR_DELIVERY') return 3;
        if (['SHIPPED', 'READY_TO_SHIP', 'DISPATCHED', 'IN_TRANSIT'].includes(s)) return 2;
        if (['PACKED', 'SELLER_CONFIRMED'].includes(s)) return 1;
        if (['CONFIRMED', 'PENDING', 'INVOICE_SENT'].includes(s)) return 0;
        return -1; // Cancelled handled separately
    };
    const activeStep = getActiveStep();

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pb-12 font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 py-4 text-xs text-gray-500 dark:text-gray-400">
                <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
                <ChevronRight size={12} className="inline mx-1" />
                <Link to="/profile/orders" className="hover:text-blue-600 dark:hover:text-blue-400">My Orders</Link>
                <ChevronRight size={12} className="inline mx-1" />
                <span>{order.id}</span>
            </div>

            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-4">

                {/* Left Column - 70% */}
                <div className="lg:col-span-8 space-y-4">

                    {/* Payment Success Banner (Static logic for now as 'PAID' status field not explicit, assuming non-cancelled is good) */}
                    {!isCancelled && (
                        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-sm border-l-4 border-green-500 flex items-center justify-between transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-full text-green-600">
                                    <Check size={20} strokeWidth={3} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Payment {order.paymentMethod === 'COD' ? 'Pending (COD)' : 'Successful'}</h3>
                                    {order.paymentMethod !== 'COD' && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">All set. No cash needed when your order arrives.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Packing Proof Video Section */}
                    {packingVideoUrl && (
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-3 text-purple-700 dark:text-purple-400 font-bold">
                                <Video size={20} />
                                <span>Packing Proof Video</span>
                            </div>
                            <video
                                controls
                                width="100%"
                                className="rounded-lg border border-gray-100 dark:border-gray-800 bg-black aspect-video"
                            >
                                <source src={packingVideoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <p className="text-xs text-gray-400 mt-2 text-center">
                                This video was uploaded by the seller as proof of packing using our secure system.
                            </p>
                        </div>
                    )}

                    {/* Product Cards + Timeline */}
                    {order.orderItems.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Product Info */}
                                <div className="flex-1">
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 shrink-0 relative">
                                            <img
                                                src={item.product.images?.[0]?.imageUrl || '/placeholder.png'}
                                                alt={item.product.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer">
                                                <Link to={`/products/${item.product.id}`}>{item.product.name}</Link>
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Seller: {item.product.seller?.shopName || 'Odisha Handloom'}</p>
                                            <p className="font-bold text-gray-900 dark:text-white mt-2">₹{item.price}</p>
                                            {/* Offers (Placeholder) */}
                                            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                                <ShieldCheck size={12} /> 2 Offers Applied
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-4 mt-6">
                                        {/* Rate & Review Button */}
                                        {isDelivered && (
                                            <>
                                                {reviewEligibility[item.id] ? (
                                                    <button
                                                        onClick={() => openReviewModal(item, reviewEligibility[item.id])}
                                                        disabled={reviewEligibility[item.id].edited}
                                                        className="text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center gap-1 hover:underline disabled:text-gray-400 dark:disabled:text-gray-600 disabled:no-underline"
                                                    >
                                                        <Star size={16} fill={reviewEligibility[item.id].edited ? "gray" : "currentColor"} />
                                                        {reviewEligibility[item.id].edited ? 'Review Edited' : 'Edit Review'}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => openReviewModal(item)}
                                                        className="text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center gap-1 hover:underline"
                                                    >
                                                        <Star size={16} /> Rate & Review Product
                                                    </button>
                                                )}
                                            </>
                                        )}
                                        {/* Chat Support */}
                                        <button className="text-gray-500 dark:text-gray-400 text-sm font-semibold flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200">
                                            <MessageSquare size={16} /> Chat with us
                                        </button>
                                    </div>
                                </div>

                                {/* Timeline (Right Side of Left Column) */}
                                <div className="md:w-1/3">
                                    {isCancelled ? (
                                        <div className="text-red-600 font-bold flex items-center gap-2">
                                            <AlertCircle size={20} /> Cancelled
                                        </div>
                                    ) : (
                                        <div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-8">
                                            {steps.map((step, index) => {
                                                const isActive = index <= activeStep;
                                                return (
                                                    <div key={index} className="relative">
                                                        <div className={`absolute -left-[21px] top-0 w-3 h-3 rounded-full border-2 ${isActive ? 'bg-green-500 border-green-500' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'}`} />
                                                        <p className={`text-xs font-semibold leading-none ${isActive ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
                                                            {step.label}
                                                        </p>
                                                        {step.date && isActive && (
                                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                                                                {new Date(step.date).toDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer for Returns */}
                            {isDelivered && !item.returnRequest && (
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <button
                                        onClick={() => navigate('/return-request', { state: { order, orderItem: item } })}
                                        className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-2"
                                    >
                                        <RotateCw size={14} /> Return / Exchange this item
                                    </button>
                                </div>
                            )}
                            {item.returnRequest && (
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <div className="text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 inline-block px-3 py-1 rounded-full">
                                        Return Status: {item.returnRequest.status}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right Column - 30% */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Price Details Card */}
                    <div>
                        <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-3">Price details</h3>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden relative transition-colors">
                            <div className="p-4 space-y-4">
                                {/* Price Rows */}
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Listing price</span>
                                        <span className="line-through text-gray-400 dark:text-gray-500">₹{order.listingPrice || order.totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                            Special price <AlertCircle size={12} className="text-gray-400 dark:text-gray-500" />
                                        </span>
                                        <span className="text-gray-900 dark:text-white">₹{order.specialPrice || order.totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                            Total fees <ChevronRight size={12} className="rotate-90" />
                                        </span>
                                        <span className="text-gray-900 dark:text-white">₹{order.totalFees || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                            Other discount <ChevronRight size={12} className="rotate-90" />
                                        </span>
                                        <span className="text-green-600 dark:text-green-400 font-medium">-₹{order.otherDiscount || 0}</span>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-dashed border-gray-300 dark:border-gray-600 my-4" />

                                {/* Total Amount */}
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900 dark:text-white">Total amount</span>
                                    <span className="font-bold text-lg text-gray-900 dark:text-white">
                                        ₹{order.totalAmount}
                                        {order.coinsUsed > 0 && <span className="text-yellow-500 text-sm ml-1">+ 🟡{order.coinsUsed}</span>}
                                    </span>
                                </div>

                                {/* Payment Method Box */}
                                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment method</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{order.formattedPaymentMethod || order.paymentMethod}</span>
                                </div>

                                {/* Download Invoice Button */}
                                {order.invoiceAvailable && (
                                    <button
                                        onClick={handleDownloadInvoice}
                                        disabled={downloadingInvoice}
                                        className="w-full py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {downloadingInvoice ? (
                                            <div className="w-5 h-5 border-2 border-gray-500 dark:border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Download size={18} />
                                        )}
                                        {downloadingInvoice ? 'Downloading...' : 'Download Invoice'}
                                    </button>
                                )}

                                {/* Cancel Order Button */}
                                {['PENDING', 'CONFIRMED', 'PACKED'].includes(order.status) && (
                                    <button
                                        onClick={handleCancelOrder}
                                        className="w-full py-3 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address (Secondary) */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                        <h3 className="font-semibold text-gray-500 dark:text-gray-400 text-xs mb-3 uppercase tracking-wider">Delivery Address</h3>
                        <div className="space-y-1">
                            <h4 className="font-medium text-sm text-gray-900 dark:text-white">{order.user?.fullName || 'Customer'}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                {order.shippingAddress}
                            </p>
                            <p className="text-sm mt-2 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                {order.user?.phoneNumber || '9999999999'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>



            <ReviewModal
                isOpen={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                product={selectedReviewProduct}
                orderItemId={selectedReviewOrderItemId}
                existingReview={editingReview}
                onReviewSubmitted={handleReviewSubmitted}
            />
        </div >
    );
}

export default TrackOrder;
