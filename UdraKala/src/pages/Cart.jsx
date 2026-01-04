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
    const { cart, removeFromCart, updateCartQuantity, loading } = useData();
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
            <h1 className="text-4xl font-bold mb-8 text-secondary-900 dark:text-white font-serif tracking-tight">Shopping Cart</h1>
            <div className="bg-white dark:bg-secondary-800 shadow-xl rounded-2xl overflow-hidden border border-secondary-100 dark:border-secondary-700 transition-colors">
                <ul className="divide-y divide-secondary-100 dark:divide-secondary-700">
                    {cart.map((item, index) => (
                        <Motion.li
                            key={`${item.id}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition border-b border-secondary-100 dark:border-secondary-700 last:border-b-0 gap-4"
                        >
                            <div className="flex items-center space-x-6">
                                <Link to={`/products/${item.id}`} className="block h-24 w-24 bg-secondary-100 dark:bg-secondary-700 rounded-xl overflow-hidden border border-secondary-200 dark:border-secondary-600 flex-shrink-0">
                                    <img src={item.images?.[0]?.imageUrl || item.imageUrl || '/placeholder.png'} alt={item.name} className="h-full w-full object-cover" />
                                </Link>
                                <div>
                                    <Link to={`/products/${item.id}`} className="text-xl font-bold text-secondary-900 dark:text-white font-serif hover:text-primary-600 transition">
                                        {item.name}
                                    </Link>
                                    <p className="text-secondary-500 dark:text-secondary-400 text-sm mt-1">Quantity: {item.quantity}</p>
                                    <p className="text-primary-600 font-bold mt-2 md:hidden">₹{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between w-full md:w-auto md:space-x-8 mt-4 md:mt-0">
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center border border-secondary-200 dark:border-secondary-600 rounded-xl overflow-hidden shadow-sm">
                                        <button
                                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className="px-3 py-1.5 bg-secondary-50 dark:bg-secondary-800 hover:bg-secondary-100 dark:hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed text-secondary-600 dark:text-secondary-300 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1.5 font-medium text-secondary-900 dark:text-white bg-white dark:bg-secondary-900 border-x border-secondary-200 dark:border-secondary-600">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                            disabled={item.quantity >= (item.stockQuantity || 100)}
                                            className="px-3 py-1.5 bg-secondary-50 dark:bg-secondary-800 hover:bg-secondary-100 dark:hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed text-secondary-600 dark:text-secondary-300 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-xs mt-2 text-secondary-500 dark:text-secondary-400">
                                        {item.stockQuantity && item.quantity >= item.stockQuantity ? (
                                            <span className="text-red-500 font-medium">Max Stock Reached</span>
                                        ) : (
                                            <span>In Stock: {item.stockQuantity ? item.stockQuantity - item.quantity : 'Yes'}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="hidden md:block text-xl font-bold text-secondary-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString()}</div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-2 text-secondary-400 hover:text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full"
                                    title="Remove Item"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </Motion.li>
                    ))}
                </ul>
                <div className="bg-secondary-50 dark:bg-secondary-900/50 px-8 py-8 border-t border-secondary-200 dark:border-secondary-700 transition-colors">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-secondary-500 text-sm">
                            <p>Taxes and shipping calculated at checkout</p>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto">
                            <div className="flex items-center gap-4">
                                <span className="text-xl text-secondary-600 dark:text-secondary-300">Subtotal</span>
                                <span className="text-3xl font-bold text-secondary-900 dark:text-white">₹{total.toLocaleString()}</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full md:w-auto px-8 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-200 dark:shadow-none flex items-center justify-center gap-2 transform active:scale-95 duration-200"
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
