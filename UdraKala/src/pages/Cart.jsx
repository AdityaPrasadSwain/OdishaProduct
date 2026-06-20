import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applyCoupon, clearCoupon, resetError } from '../store/slices/couponSlice';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Trash2, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
import { motion as Motion } from 'motion/react';
import Swal from 'sweetalert2';

import CartSkeleton from '../components/skeletons/CartSkeleton';

const Cart = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart, removeFromCart, updateCartQuantity, loading } = useData();
    const total = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);



    const [couponCode, setCouponCode] = useState('');
    const dispatch = useDispatch();
    const { activeCoupon, discount, applicationLoading, applicationError, successMessage } = useSelector(state => state.coupon);

    useEffect(() => {
        if (successMessage) Swal.fire({ icon: 'success', title: 'Success', text: successMessage, timer: 2000, showConfirmButton: false });
        if (applicationError) Swal.fire({ icon: 'error', title: 'Oops...', text: applicationError });
        if (applicationError || successMessage) dispatch(resetError());
    }, [successMessage, applicationError, dispatch]);

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) return;
        if (!user) {
            Swal.fire({ icon: 'info', title: 'Login Required', text: 'Please login to apply coupons', showCancelButton: true, confirmButtonText: 'Login' })
                .then((result) => { if (result.isConfirmed) navigate('/login'); });
            return;
        }
        dispatch(applyCoupon({ code: couponCode, orderAmount: total, userId: user.id }));
    };

    const handleRemoveCoupon = () => {
        dispatch(clearCoupon());
        setCouponCode('');
    };

    const handleCheckout = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    if (loading) return <CartSkeleton />;

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <Motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                    <ShoppingBag size={64} className="mx-auto text-text-secondary dark:text-text-secondary mb-6" />
                    <h2 className="text-3xl font-bold text-text-primary dark:text-text-onDark mb-4">Your cart is empty</h2>
                    <p className="text-text-secondary dark:text-text-secondary mb-8">Looks like you haven't added any unique handlooms yet.</p>
                    <Link to="/products" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-text-onDark bg-primary hover:bg-primary-hover transition">
                        Start Shopping <ArrowRight className="ml-2" size={20} />
                    </Link>
                </Motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-8 text-text-primary dark:text-text-onDark font-serif tracking-tight">Shopping Cart</h1>
            <div className="bg-bg-surface dark:bg-bg-dark shadow-xl rounded-2xl overflow-hidden border border-border dark:border-border transition-colors">
                <ul className="divide-y divide-secondary-100 dark:divide-secondary-700">
                    {cart.map((item, index) => (
                        <Motion.li
                            key={`${item.id}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-bg-page dark:hover:bg-bg-dark/50 transition border-b border-border dark:border-border last:border-b-0 gap-4"
                        >
                            <div className="flex items-center space-x-6">
                                <Link to={`/products/${item.id}`} className="block h-24 w-24 bg-bg-band dark:bg-bg-dark rounded-xl overflow-hidden border border-border dark:border-border flex-shrink-0">
                                    <img src={item.images?.[0]?.imagePath || item.imagePath || '/placeholder.png'} alt={item.name} className="h-full w-full object-cover" />
                                </Link>
                                <div>
                                    <Link to={`/products/${item.id}`} className="text-xl font-bold text-text-primary dark:text-text-onDark font-serif hover:text-primary transition">
                                        {item.name}
                                    </Link>
                                    <p className="text-text-secondary dark:text-text-secondary text-sm mt-1">Quantity: {item.quantity}</p>
                                    <p className="text-primary font-bold mt-2 md:hidden">₹{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between w-full md:w-auto md:space-x-8 mt-4 md:mt-0">
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center border border-border dark:border-border rounded-xl overflow-hidden shadow-sm">
                                        <button
                                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className="px-3 py-1.5 bg-bg-page dark:bg-bg-dark hover:bg-bg-band dark:hover:bg-bg-dark disabled:opacity-50 disabled:cursor-not-allowed text-text-secondary dark:text-text-secondary transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1.5 font-medium text-text-primary dark:text-text-onDark bg-bg-surface dark:bg-bg-dark border-x border-border dark:border-border">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                            disabled={item.quantity >= (item.stockQuantity || 100)}
                                            className="px-3 py-1.5 bg-bg-page dark:bg-bg-dark hover:bg-bg-band dark:hover:bg-bg-dark disabled:opacity-50 disabled:cursor-not-allowed text-text-secondary dark:text-text-secondary transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-xs mt-2 text-text-secondary dark:text-text-secondary">
                                        {item.stockQuantity && item.quantity >= item.stockQuantity ? (
                                            <span className="text-status-error font-medium">Max Stock Reached</span>
                                        ) : (
                                            <span>In Stock: {item.stockQuantity ? item.stockQuantity - item.quantity : 'Yes'}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="hidden md:block text-xl font-bold text-text-primary dark:text-text-onDark">₹{(item.price * item.quantity).toLocaleString()}</div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-2 text-text-secondary hover:text-status-error transition-colors hover:bg-red-50 dark:hover:text-status-error/10 rounded-full"
                                    title="Remove Item"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </Motion.li>
                    ))}
                </ul>

                {/* Coupon Section */}
                <div className="bg-bg-page dark:bg-bg-dark/30 px-8 py-6 border-t border-border dark:border-border">
                    <div className="flex items-center gap-4 max-w-md">
                        <Tag className="text-primary" size={20} />
                        <div className="flex-1 flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter Coupon Code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                disabled={!!activeCoupon}
                                className="flex-1 px-4 py-2 rounded-lg border border-border dark:border-border focus:ring-2 focus:ring-primary bg-bg-surface dark:bg-bg-dark text-text-primary dark:text-text-onDark"
                            />
                            {activeCoupon ? (
                                <button
                                    onClick={handleRemoveCoupon}
                                    className="px-4 py-2 text-status-error text-status-error hover:text-status-error rounded-lg font-medium transition"
                                >
                                    Remove
                                </button>
                            ) : (
                                <button
                                    onClick={handleApplyCoupon}
                                    disabled={applicationLoading || !couponCode}
                                    className="px-4 py-2 bg-bg-dark dark:bg-bg-surface text-text-onDark dark:text-text-primary hover:opacity-90 rounded-lg font-medium transition disabled:opacity-50"
                                >
                                    {applicationLoading ? 'Applying...' : 'Apply'}
                                </button>
                            )}
                        </div>
                    </div>
                    {activeCoupon && (
                        <p className="text-status-success mt-2 text-sm font-medium flex items-center gap-1">
                            <Tag size={14} /> Coupon {activeCoupon.code} applied!
                        </p>
                    )}
                </div>

                <div className="bg-bg-page dark:bg-bg-dark/50 px-8 py-8 border-t border-border dark:border-border transition-colors">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-text-secondary text-sm">
                            <p>Taxes and shipping calculated at checkout</p>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto">
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-4 text-text-secondary">
                                    <span className="text-lg">Subtotal</span>
                                    <span className="text-xl font-medium">₹{total.toLocaleString()}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex items-center gap-4 text-status-success">
                                        <span className="text-lg">Discount</span>
                                        <span className="text-xl font-bold">-₹{discount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-2xl text-text-secondary dark:text-text-secondary font-bold">Total</span>
                                    <span className="text-4xl font-bold text-primary">₹{(total - discount).toLocaleString()}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full md:w-auto px-8 py-4 bg-primary text-text-onDark font-bold rounded-xl hover:bg-primary-hover transition shadow-lg shadow-primary-200 dark:shadow-none flex items-center justify-center gap-2 transform active:scale-95 duration-200"
                            >
                                Checkout Securely <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
