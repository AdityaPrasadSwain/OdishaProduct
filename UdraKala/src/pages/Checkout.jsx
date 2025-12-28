import { useState, useEffect } from 'react';
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
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Address State
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isAddressLoading, setIsAddressLoading] = useState(true);

    const [paymentMethod, setPaymentMethod] = useState('COD');

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const isFormValid = selectedAddressId != null;

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
            const orderPayload = {
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                })),
                addressId: selectedAddressId,
                shippingAddress: null,
                paymentMethod: paymentMethod, // 'COD' or 'ONLINE' (mapped to generic method)
                paymentId: null // Pending
            };

            const newOrder = await createOrder(orderPayload);
            const orderId = newOrder.id;

            // 2. Initiate Payment
            // Pass the selected method directly (UPI, CARD, NET_BANKING, COD)
            const paymentResponse = await initiatePayment(orderId, paymentMethod);

            if (paymentMethod === 'COD') {
                await processOrderSuccess(newOrder, 'COD');
            } else {
                // ONLINE FLOW
                // Theoretically, here we would redirect to paymentResponse.gatewayUrl
                // For Mock, we simulate user action

                // Show Mock Payment Modal
                await MySwal.fire({
                    title: 'Secure Payment Gateway',
                    text: `Processing payment of ₹${totalAmount}...`,
                    icon: 'info',
                    showConfirmButton: false,
                    timer: 2000,
                    willClose: () => {
                        // verify logic placeholder for strict mode if needed
                    }
                });

                // 3. Verify Payment (Mock)
                const verifyResponse = await verifyPayment(
                    orderId,
                    'MOCK_PAY_ID_' + Date.now(),
                    paymentResponse.gatewayRef || 'MOCK_ORDER_REF',
                    'MOCK_SIGNATURE'
                );

                if (verifyResponse.success) {
                    await processOrderSuccess(newOrder, 'ONLINE');
                } else {
                    throw new Error('Payment verification failed');
                }
            }

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Order Failed',
                text: error.message || error.response?.data?.message || 'Something went wrong processing your order.',
            });
        } finally {
            setLoading(false);
        }
    };

    const processOrderSuccess = async (order, method) => {
        // Send Order Email (Customer)
        await sendOrderEmail(user.email, user.fullName, order.id, totalAmount);
        // Notify Sellers
        await notifySellers(order.id);

        clearCart();

        Swal.fire({
            icon: 'success',
            title: method === 'COD' ? 'Order Placed!' : 'Payment Successful!',
            text: `Your order #${order.id.substring(0, 8)} has been confirmed.`,
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center font-serif">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Addresses & Payment */}
                    <div className="space-y-6">

                        {/* Address Section */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                    <MapPin size={20} className="text-orange-500" /> Delivery Address
                                </h2>
                                <button
                                    onClick={() => setIsAddressModalOpen(true)}
                                    className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                                >
                                    <Plus size={16} /> Add New
                                </button>
                            </div>

                            {isAddressLoading ? (
                                <div className="flex justify-center p-4">
                                    <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                                </div>
                            ) : addresses.length === 0 ? (
                                <div className="text-center p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">No saved addresses found.</p>
                                    <button
                                        onClick={() => setIsAddressModalOpen(true)}
                                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                                    >
                                        Add Delivery Address
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr.id}
                                            onClick={() => setSelectedAddressId(addr.id)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition relative ${selectedAddressId === addr.id
                                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-orange-200'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedAddressId === addr.id ? 'border-orange-600' : 'border-gray-300'
                                                    }`}>
                                                    {selectedAddressId === addr.id && (
                                                        <div className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                                                        {addr.street}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {addr.city}, {addr.state} - {addr.zipCode}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1 uppercase">{addr.country}</p>
                                                    {addr.default && (
                                                        <span className="absolute top-2 right-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full flex items-center gap-1">
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
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <CreditCard size={20} className="text-orange-500" /> Payment Method
                            </h2>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('UPI')}
                                    className={`p-4 border rounded-lg cursor-pointer transition flex flex-col items-center gap-2 ${paymentMethod === 'UPI' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'}`}
                                >
                                    <ShieldCheck className={paymentMethod === 'UPI' ? 'text-orange-600' : 'text-gray-400'} />
                                    <span className="font-medium text-gray-900 dark:text-white text-sm">UPI</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('CARD')}
                                    className={`p-4 border rounded-lg cursor-pointer transition flex flex-col items-center gap-2 ${paymentMethod === 'CARD' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'}`}
                                >
                                    <CreditCard className={paymentMethod === 'CARD' ? 'text-orange-600' : 'text-gray-400'} />
                                    <span className="font-medium text-gray-900 dark:text-white text-sm">Card</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('NET_BANKING')}
                                    className={`p-4 border rounded-lg cursor-pointer transition flex flex-col items-center gap-2 ${paymentMethod === 'NET_BANKING' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'}`}
                                >
                                    <CheckCircle className={paymentMethod === 'NET_BANKING' ? 'text-orange-600' : 'text-gray-400'} />
                                    <span className="font-medium text-gray-900 dark:text-white text-sm">Net Banking</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('COD')}
                                    className={`p-4 border rounded-lg cursor-pointer transition flex flex-col items-center gap-2 ${paymentMethod === 'COD' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'}`}
                                >
                                    <Truck className={paymentMethod === 'COD' ? 'text-orange-600' : 'text-gray-400'} />
                                    <span className="font-medium text-gray-900 dark:text-white text-sm">COD</span>
                                </button>
                            </div>

                            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                {paymentMethod === 'COD' ? (
                                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                        <CheckCircle size={16} className="text-green-500" />
                                        Pay cash or UPI when the order is delivered to your doorstep.
                                    </div>
                                ) : paymentMethod === 'UPI' ? (
                                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                        <ShieldCheck size={16} className="text-blue-500" />
                                        Pay instantly using Google Pay, PhonePe, Paytm, or any UPI app.
                                    </div>
                                ) : ( // Covers 'CARD' and 'NET_BANKING'
                                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                        <ShieldCheck size={16} className="text-blue-500" />
                                        You will be redirected to our secure payment gateway to complete the payment.
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading || !isFormValid}
                                className="w-full mt-6 py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-lg transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
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
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 h-fit sticky top-24">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                            <CheckCircle size={20} className="text-orange-500" /> Order Summary
                        </h2>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0">
                                    <img src={item.images?.[0]?.imageUrl || item.imageUrl || '/placeholder.png'} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.name}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-orange-600 dark:text-orange-400">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <span className="text-lg font-medium text-gray-900 dark:text-white">Total To Pay</span>
                            <span className="text-2xl font-bold text-orange-600">₹{totalAmount}</span>
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
