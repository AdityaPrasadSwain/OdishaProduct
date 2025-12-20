import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useWishlist } from '../../context/WishlistContext';
import { getMyOrders } from '../../api/orderApi';
import { motion as Motion } from 'motion/react';
import { Package, MapPin, User, Heart, Star, Sparkles, LogOut, Eye, Calendar, Clock, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const CustomerDashboard = () => {
    const { user } = useAuth();
    const { products, addToCart } = useData();
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [activeTab, setActiveTab] = useState('orders');

    useEffect(() => {
        const fetchOrders = async () => {
            if (user) {
                setLoadingOrders(true);
                try {
                    const data = await getMyOrders();
                    setOrders(Array.isArray(data) ? data : []);
                } catch (error) {
                    console.error("Failed to fetch orders", error);
                } finally {
                    setLoadingOrders(false);
                }
            }
        };
        fetchOrders();
    }, [user]);

    const myOrders = useMemo(() => {
        if (!orders) return [];
        const list = [...orders];
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return list;
    }, [orders]);

    const getProductName = (pid) => {
        const p = products.find(prod => prod.id === pid);
        return p ? p.name : 'Unknown Product';
    };

    const recommendedProducts = products.filter(p => p.approved).slice(0, 3);

    const tabs = [
        { id: 'orders', label: 'My Orders', icon: Package },
        { id: 'wishlist', label: 'Wishlist', icon: Heart },
        { id: 'profile', label: 'My Profile', icon: User },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-dark dark:text-white">Welcome back, {user?.fullName}</h2>
                    <p className="text-muted text-sm">Manage your orders and preferences</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-x-auto w-fit">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap
                                ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    {activeTab === 'orders' && (
                        <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            {myOrders.length === 0 ? (
                                <Card className="text-center py-12">
                                    <div className="flex flex-col items-center">
                                        <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                            <Package className="h-8 w-8 text-gray-400 ml-4" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No orders yet</h3>
                                        <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">Start shopping to see your orders here.</p>
                                        <Link to="/products">
                                            <Button>Browse Products</Button>
                                        </Link>
                                    </div>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {myOrders.map(order => (
                                        <Card key={order.id} className="group hover:border-primary/50 transition-colors">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b border-gray-100 dark:border-gray-700 gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-900 dark:text-white">Order #{order.id.toString().slice(0, 8)}</span>
                                                        <Badge variant={order.status === 'DELIVERED' ? 'success' : order.status === 'CANCELLED' ? 'danger' : 'info'}>{order.status}</Badge>
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(order.createdAt).toLocaleTimeString()}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-primary">₹{order.totalAmount}</p>
                                                    <p className="text-xs text-muted">{order.orderItems?.length} items</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                {order.orderItems?.map((item, idx) => (
                                                    <div key={idx} className="flex items-center justify-between text-sm py-2 px-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                                                                <img src={item.product?.images?.[0]?.imageUrl || item.product?.imageUrl || '/placeholder.png'} className="h-full w-full object-cover" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.product?.name || getProductName(item.productId)}</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                        <span className="font-semibold text-gray-900 dark:text-white">₹{item.price * item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-4 pt-3 flex justify-end">
                                                <Link to={`/customer/track-order/${order.id}`}>
                                                    <Button size="sm" variant="outline" className="flex items-center gap-1"><Eye size={14} /> View Details</Button>
                                                </Link>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </Motion.div>
                    )}

                    {activeTab === 'wishlist' && (
                        <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            {wishlistItems && wishlistItems.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {wishlistItems.map((product) => (
                                        <Card key={product.id} className="group overflow-hidden p-0">
                                            <div className="relative h-48 overflow-hidden">
                                                <Link to={`/product/${product.id}`}>
                                                    <img
                                                        src={product.images?.[0]?.imageUrl || '/placeholder.png'}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                </Link>
                                                <button
                                                    onClick={() => removeFromWishlist(product.id)}
                                                    className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                                                    title="Remove from wishlist"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="p-4">
                                                <Link to={`/product/${product.id}`}>
                                                    <h3 className="font-bold text-gray-900 dark:text-white hover:text-primary transition-colors mb-2 truncate">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="font-bold text-primary">₹{product.discountPrice || product.price}</span>
                                                    <button
                                                        onClick={() => addToCart(product)}
                                                        className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                                                        title="Add to cart"
                                                    >
                                                        <ShoppingCart size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="text-center py-16">
                                    <div className="flex flex-col items-center">
                                        <div className="h-20 w-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                                            <Heart size={32} className="text-danger" />
                                        </div>
                                        <h3 className="text-xl font-bold text-dark dark:text-white">Your wishlist is empty</h3>
                                        <p className="text-muted mt-2 mb-8 max-w-md mx-auto">Heart items you love to save them for later!</p>
                                        <Link to="/products">
                                            <Button>Explore Products</Button>
                                        </Link>
                                    </div>
                                </Card>
                            )}
                        </Motion.div>
                    )}

                    {activeTab === 'profile' && (
                        <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <Card title="My Profile">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-20 w-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
                                            {user?.fullName?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-dark dark:text-white">{user?.fullName}</h3>
                                            <p className="text-muted">{user?.email}</p>
                                            <Badge variant="success" className="mt-2">Customer Account</Badge>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border dark:border-dark-light">
                                        <div>
                                            <label className="text-sm font-medium text-muted block mb-1">Full Name</label>
                                            <div className="p-3 bg-gray-50 dark:bg-dark-light rounded-md text-dark dark:text-white font-medium border border-border dark:border-dark-light">
                                                {user?.fullName}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted block mb-1">Email Address</label>
                                            <div className="p-3 bg-gray-50 dark:bg-dark-light rounded-md text-dark dark:text-white font-medium border border-border dark:border-dark-light">
                                                {user?.email}
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-sm font-medium text-muted block mb-1">Shipping Address</label>
                                            <div className="p-3 bg-gray-50 dark:bg-dark-light rounded-md text-dark dark:text-white font-medium border border-border dark:border-dark-light min-h-[80px]">
                                                {user?.address || 'No address saved.'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button variant="outline" onClick={() => window.location.href = '/profile/edit'}>Edit Profile</Button>
                                    </div>
                                </div>
                            </Card>
                        </Motion.div>
                    )}
                </div>

                {/* Right Sidebar: Recommendations */}
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Recommended" className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-dark-light dark:to-dark border-orange-100 dark:border-dark-light">
                        <div className="space-y-4">
                            {recommendedProducts.map((p, i) => (
                                <Link to={`/product/${p.id}`} key={p.id} className="block group">
                                    <div className="flex gap-3 items-center p-2 rounded-lg hover:bg-white/60 dark:hover:bg-dark/60 transition-colors">
                                        <div className="h-12 w-12 rounded-md bg-white overflow-hidden shadow-sm flex-shrink-0">
                                            <img src={p.images?.[0]?.imageUrl || '/placeholder.png'} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm text-dark dark:text-white truncate group-hover:text-primary transition-colors">{p.name}</p>
                                            <p className="text-xs text-primary font-bold">₹{p.price}</p>
                                        </div>
                                    </div>
                                    {i < recommendedProducts.length - 1 && <div className="h-px bg-black/5 dark:bg-white/5 my-2" />}
                                </Link>
                            ))}
                            {recommendedProducts.length === 0 && <p className="text-sm text-muted">No recommendations available.</p>}
                        </div>
                    </Card>

                    <Card className="bg-primary/5 border-primary/10">
                        <div className="text-center p-4">
                            <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
                            <h4 className="font-bold text-dark dark:text-white">Become a Seller!</h4>
                            <p className="text-xs text-muted mt-1 mb-3">Sell your own products on UdraKala and reach millions.</p>
                            <Link to="/register?role=seller">
                                <Button size="sm" variant="outline" className="w-full bg-white dark:bg-dark hover:bg-gray-50">Register as Seller</Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
