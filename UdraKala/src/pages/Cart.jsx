import { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion as Motion } from 'motion/react';
import Swal from 'sweetalert2';

import CartSkeleton from '../components/skeletons/CartSkeleton';

const Cart = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart, removeFromCart, loading } = useData();
    const total = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);



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
                    <ShoppingBag size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-6" />
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">Looks like you haven't added any unique handlooms yet.</p>
                    <Link to="/products" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 transition">
                        Start Shopping <ArrowRight className="ml-2" size={20} />
                    </Link>
                </Motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white" style={{ fontFamily: 'serif' }}>Shopping Cart</h1>
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors">
                <ul className="divide-y divide-gray-200">
                    {cart.map((item, index) => (
                        <Motion.li
                            key={`${item.id}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition border-b dark:border-gray-700 last:border-b-0"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="h-16 w-16 bg-gray-200 dark:bg-gray-600 rounded-md overflow-hidden">
                                    <img src={item.images?.[0]?.imageUrl || item.imageUrl || '/placeholder.png'} alt={item.name} className="h-full w-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.name}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6">
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1 font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                            disabled={item.quantity >= (item.stockQuantity || 100)} // Fallback 100 if stock logic fails
                                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                                        {item.stockQuantity && item.quantity >= item.stockQuantity ? (
                                            <span className="text-red-500 font-medium">Out of Stock Limit Reached</span>
                                        ) : (
                                            <span>Stock Left: {item.stockQuantity ? item.stockQuantity - item.quantity : 'Unknown'}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-lg font-bold text-orange-700 dark:text-orange-400">₹{(item.price * item.quantity).toLocaleString()}</div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-gray-400 hover:text-red-500 transition"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </Motion.li>
                    ))}
                </ul>
                <div className="bg-gray-50 dark:bg-gray-900 px-6 py-8 border-t border-gray-200 dark:border-gray-700 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xl text-gray-600 dark:text-gray-300">Total Amount</span>
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={handleCheckout}
                            className="w-full md:w-auto px-8 py-3 bg-gray-900 dark:bg-orange-600 text-white font-bold rounded-lg hover:bg-gray-800 dark:hover:bg-orange-700 transition shadow-lg flex items-center justify-center gap-2"
                        >
                            Proceed to Checkout <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
