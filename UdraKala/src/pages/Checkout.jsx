import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { createOrder } from '../api/orderApi';
import { initiatePayment, verifyPayment } from '../api/paymentApi';
import { getUserAddresses } from '../api/addressApi';
import { useAuth } from '../context/AuthContext';
import { motion as Motion } from 'motion/react';
import Swal from 'sweetalert2';
import { CreditCard, MapPin, Truck, CheckCircle, Loader2, Plus, Star, ShieldCheck } from 'lucide-react';
import AddressForm from '../components/AddressForm';
import { sendOrderEmail, sendSellerOrderNotification } from '../utils/emailService';

const Checkout = () => {
    const { user } = useAuth();
    const { cart, clearCart } = useData();
    const { activeCoupon, discount } = useSelector(state => state.coupon); // Get coupon state
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Address State
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isAddressLoading, setIsAddressLoading] = useState(true);

    const [paymentMethod, setPaymentMethod] = useState('COD');

    const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalAmount = subTotal - (discount || 0);

    const isFormValid = selectedAddressId != null;

    // Load persisted checkout data
    useEffect(() => {
        const savedData = localStorage.getItem('checkoutData');
        if (savedData) {
            try {
                const { addressId, method } = JSON.parse(savedData);
                if (addressId) setSelectedAddressId(addressId);
                if (method) setPaymentMethod(method);
            } catch (e) {
                console.error("Failed to parse checkoutData", e);
            }
        }
    }, []);

    // Save checkout data on change
    useEffect(() => {
        localStorage.setItem('checkoutData', JSON.stringify({
            addressId: selectedAddressId,
            method: paymentMethod
        }));
    }, [selectedAddressId, paymentMethod]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (cart.length === 0) {
            navigate('/cart');
        } else {
            fetchAddresses();
        }
    }, [user, cart, navigate]);

    const fetchAddresses = async () => {
        try {
            setIsAddressLoading(true);
            const data = await getUserAddresses();
            setAddresses(data);

            if (data.length > 0) {
                const defaultAddr = data.find(a => a.default);
                if (defaultAddr) {
                    setSelectedAddressId(defaultAddr.id);
                } else {
                    setSelectedAddressId(data[0].id);
                }
            }
        } catch (error) {
            console.error("Failed to fetch addresses", error);
        } finally {
            setIsAddressLoading(false);
        }
    };

    const handleAddressAdded = (newAddress) => {
        setAddresses([...addresses, newAddress]);
        setSelectedAddressId(newAddress.id);
    };

    const handlePlaceOrder = async () => {
        if (!isFormValid) {
            Swal.fire('Error', 'Please select a delivery address', 'error');
            return;
        }

        setLoading(true);

        try {
            // 1. Create Pending Order
            // Find selected address details
            const selectedAddress = addresses.find(a => a.id === selectedAddressId);
            const formattedAddress = selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.zipCode}`
                : '';

            const orderPayload = {
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                })),
                addressId: selectedAddressId,
                shippingAddress: formattedAddress,
                paymentMethod: paymentMethod, // 'COD' or 'ONLINE'
                paymentMethod: paymentMethod, // 'COD' or 'ONLINE'
                paymentId: null, // Pending
                couponCode: activeCoupon ? activeCoupon.code : null // Send coupon code
            };

            const createdData = await createOrder(orderPayload);
            // Handle both List response and Map response ({ orders: [] })
            let orders = [];
            if (createdData.orders) {
                orders = createdData.orders;
            } else if (Array.isArray(createdData)) {
                orders = createdData;
            } else {
                orders = [createdData];
            }

            console.log("Created Orders:", orders);

            // 2. Initiate Payment for ALL created orders
            for (const order of orders) {
                // Pass the selected method directly (UPI, CARD, NET_BANKING, COD)
                const paymentResponse = await initiatePayment(order.id, paymentMethod);

                if (paymentMethod !== 'COD') {
                    // ONLINE FLOW (Mock)
                    // In a real multi-seller split, we'd need a composite payment or loop payments.
                    // Here we verify individually for correctness.

                    const verifyResponse = await verifyPayment(
                        order.id,
                        'MOCK_PAY_ID_' + Date.now(),
                        paymentResponse.gatewayRef || 'MOCK_ORDER_REF',
                        'MOCK_SIGNATURE'
                    );

                    if (!verifyResponse.success) {
                        throw new Error(`Payment verification failed for order #${order.id}`);
                    }
                }
            }

            // Mock Fake Gateway Delay for visual effect if Online
            if (paymentMethod !== 'COD') {
                await MySwal.fire({
                    title: 'Secure Payment Gateway',
                    text: `Processing payment of ₹${totalAmount}...`,
                    icon: 'info',
                    showConfirmButton: false,
                    timer: 2000
                });
            }

            await processOrderSuccess(orders, paymentMethod);

        } catch (error) {
            console.error("Order Creation Error:", error);
            if (error.response) {
                console.error("Backend Error Data:", error.response.data);
                console.error("Backend Error Status:", error.response.status);
            }

            Swal.fire({
                icon: 'error',
                title: 'Order Failed',
                text: error.response?.data?.message || error.message || 'Something went wrong processing your order.',
            });
        } finally {
            setLoading(false);
        }
    };


    const processOrderSuccess = async (orders, method) => {
        // Send Order Emails
        for (const order of orders) {
            console.log("Processing success for order:", order.id);
            // Note: Email service might need update to handle partials, but for now we send what we have
            // Or rely on backend emails which are already sent in OrderService.createOrder
        }

        const orderIds = orders.map(o => "#" + o.id.substring(0, 8)).join(", ");

        clearCart();
        localStorage.removeItem('checkoutData');

        Swal.fire({
            icon: 'success',
            title: method === 'COD' ? 'Order Placed!' : 'Payment Successful!',
            text: `Your orders (${orderIds}) have been confirmed.`,
            confirmButtonColor: '#ea580c'
        }).then(() => {
            navigate('/customer/orders');
        });
    };

    const notifySellers = async (orderId) => {
        const sellersMap = new Map();
        cart.forEach(item => {
            if (item.seller && item.seller.email) {
                if (!sellersMap.has(item.seller.email)) {
                    sellersMap.set(item.seller.email, {
                        name: item.seller.fullName || item.seller.shopName || 'Seller',
                        items: []
                    });
                }
                sellersMap.get(item.seller.email).items.push({
                    name: item.name,
                    quantity: item.quantity
                });
            }
        });

        for (const [email, data] of sellersMap.entries()) {
            await sendSellerOrderNotification(email, data.name, orderId, data.items);
        }
    };

    // Helper to workaround Swal inside async function if needed, but direct Swal works usually.
    const MySwal = Swal;

    return (
        <div className="min-h-screen bg-secondary-50 dark:bg-dark py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                <h1 className="text-4xl font-bold text-secondary-900 dark:text-white mb-8 text-center font-serif tracking-tight">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Addresses & Payment */}
                    <div className="space-y-6">

                        {/* Address Section */}
                        <div className="bg-white dark:bg-secondary-800 p-6 rounded-2xl shadow-sm border border-secondary-100 dark:border-secondary-700">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-secondary-900 dark:text-white flex items-center gap-2">
                                    <MapPin size={22} className="text-primary-600" /> Delivery Address
                                </h2>
                                <button
                                    onClick={() => setIsAddressModalOpen(true)}
                                    className="text-sm text-primary-600 hover:text-primary-700 font-bold flex items-center gap-1 uppercase tracking-wider"
                                >
                                    <Plus size={16} /> Add New
                                </button>
                            </div>

                            {isAddressLoading ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                                </div>
                            ) : addresses.length === 0 ? (
                                <div className="text-center p-8 border-2 border-dashed border-secondary-200 dark:border-secondary-700 rounded-2xl bg-secondary-50 dark:bg-secondary-800/50">
                                    <MapPin size={32} className="mx-auto text-secondary-300 mb-2" />
                                    <p className="text-secondary-500 dark:text-secondary-400 mb-4 font-medium">No saved addresses found.</p>
                                    <button
                                        onClick={() => setIsAddressModalOpen(true)}
                                        className="px-6 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-200 dark:shadow-none"
                                    >
                                        Add Delivery Address
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr.id}
                                            onClick={() => setSelectedAddressId(addr.id)}
                                            className={`p-5 rounded-xl border-2 cursor-pointer transition-all relative ${selectedAddressId === addr.id
                                                ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/10 shadow-md'
                                                : 'border-secondary-100 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${selectedAddressId === addr.id ? 'border-primary-600' : 'border-secondary-300'
                                                    }`}>
                                                    {selectedAddressId === addr.id && (
                                                        <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-base text-secondary-900 dark:text-white font-bold">
                                                        {addr.street}
                                                    </p>
                                                    <p className="text-sm text-secondary-600 dark:text-secondary-300 mt-1 leading-relaxed">
                                                        {addr.city}, {addr.state} - {addr.zipCode}
                                                    </p>
                                                    <p className="text-xs text-secondary-400 mt-2 uppercase font-bold tracking-wide">{addr.country}</p>
                                                    {addr.default && (
                                                        <span className="absolute top-4 right-4 text-[10px] bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold uppercase tracking-wider">
                                                            <Star size={10} fill="currentColor" /> Default
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Payment Method Section */}
                        <div className="bg-white dark:bg-secondary-800 p-6 rounded-2xl shadow-sm border border-secondary-100 dark:border-secondary-700">
                            <h2 className="text-xl font-bold mb-6 text-secondary-900 dark:text-white flex items-center gap-2">
                                <CreditCard size={22} className="text-primary-600" /> Payment Method
                            </h2>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {[
                                    { id: 'UPI', icon: ShieldCheck, label: 'UPI' },
                                    { id: 'CARD', icon: CreditCard, label: 'Card' },
                                    { id: 'NET_BANKING', icon: CheckCircle, label: 'Net Banking' },
                                    { id: 'COD', icon: Truck, label: 'COD' },
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex flex-col items-center gap-3 active:scale-95 ${paymentMethod === method.id
                                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400 font-bold shadow-sm'
                                            : 'border-secondary-100 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600 text-secondary-500'}`}
                                    >
                                        <method.icon size={24} className={paymentMethod === method.id ? 'text-primary-600' : 'text-secondary-400'} />
                                        <span className="text-sm">{method.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-xl border border-secondary-100 dark:border-secondary-700">
                                {paymentMethod === 'COD' ? (
                                    <div className="text-sm text-secondary-600 dark:text-secondary-300 flex items-start gap-2">
                                        <CheckCircle size={18} className="text-green-600 mt-0.5 shrink-0" />
                                        <span>Pay cash or UPI when the order is delivered to your doorstep.</span>
                                    </div>
                                ) : paymentMethod === 'UPI' ? (
                                    <div className="text-sm text-secondary-600 dark:text-secondary-300 flex items-start gap-2">
                                        <ShieldCheck size={18} className="text-blue-600 mt-0.5 shrink-0" />
                                        <span>Pay instantly using Google Pay, PhonePe, Paytm, or any UPI app. Secure & Fast.</span>
                                    </div>
                                ) : (
                                    <div className="text-sm text-secondary-600 dark:text-secondary-300 flex items-start gap-2">
                                        <ShieldCheck size={18} className="text-blue-600 mt-0.5 shrink-0" />
                                        <span>You will be redirected to our secure payment gateway to complete the payment.</span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading || !isFormValid}
                                className="w-full mt-8 py-4 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-200 dark:shadow-none transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 uppercase tracking-wide text-sm"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        {paymentMethod === 'COD' ? 'Place Order' : 'Proceed to Payment'}
                                    </>
                                )}
                            </button>
                        </div>

                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="bg-white dark:bg-secondary-800 p-6 rounded-2xl shadow-sm border border-secondary-100 dark:border-secondary-700 h-fit sticky top-24">
                        <h2 className="text-xl font-bold mb-6 text-secondary-900 dark:text-white flex items-center gap-2">
                            <CheckCircle size={22} className="text-primary-600" /> Order Summary
                        </h2>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center border-b border-secondary-100 dark:border-secondary-700 pb-4 last:border-0">
                                    <div className="w-16 h-16 rounded-lg bg-secondary-100 dark:bg-secondary-700 overflow-hidden shrink-0 border border-secondary-200 dark:border-secondary-600">
                                        <img src={item.images?.[0]?.imageUrl || item.imageUrl || '/placeholder.png'} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold text-secondary-900 dark:text-white truncate">{item.name}</h3>
                                        <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-primary-600 dark:text-primary-400 whitespace-nowrap">₹{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-secondary-200 dark:border-secondary-700 flex justify-between items-center">
                            <span className="text-lg font-medium text-secondary-900 dark:text-white">Total Amount</span>
                            <span className="text-2xl font-bold text-primary-600">₹{totalAmount.toLocaleString()}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between items-center mt-2 text-green-600">
                                <span className="font-medium">Discount ({activeCoupon?.code})</span>
                                <span className="font-bold">-₹{discount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-bold rounded-lg text-center border border-green-200 dark:border-green-800">
                            You are saving money on this order with free delivery!
                        </div>
                    </div>
                </div>
            </Motion.div>

            <AddressForm
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onAddressAdded={handleAddressAdded}
            />
        </div>
    );
};

export default Checkout;
