import React from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'motion/react';
import { useWishlist } from '../context/WishlistContext';
import { useData } from '../context/DataContext';
import { ShoppingCart, Trash2, Heart } from 'lucide-react';

const Wishlist = () => {
    const { wishlistItems, loading, removeFromWishlist } = useWishlist();
    const { addToCart } = useData();

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Heart className="text-red-500 fill-red-500" /> My Wishlist
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                </p>
            </div>

            {wishlistItems.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <div className="mb-4 flex justify-center">
                        <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">Save items you love in your wishlist and they will appear here.</p>
                    <Link
                        to="/products"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-orange-600 hover:bg-orange-700 transition-colors"
                    >
                        Explore Products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlistItems.map((product) => (
                        <Motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group hover:shadow-md transition-shadow"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <Link to={`/product/${product.id}`}>
                                    <img
                                        src={product.images?.[0]?.imageUrl || 'https://via.placeholder.com/400'}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </Link>
                                <button
                                    onClick={() => removeFromWishlist(product.id)}
                                    className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                                    title="Remove from wishlist"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="p-4">
                                <div className="mb-1">
                                    <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                                        {product.category?.name || 'Uncategorized'}
                                    </span>
                                </div>
                                <Link to={`/product/${product.id}`}>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-orange-600 transition-colors mb-2 truncate">
                                        {product.name}
                                    </h3>
                                </Link>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex flex-col">
                                        {product.discountPrice > 0 ? (
                                            <>
                                                <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
                                                <span className="text-xl font-bold text-gray-900 dark:text-white">₹{product.discountPrice}</span>
                                            </>
                                        ) : (
                                            <span className="text-xl font-bold text-gray-900 dark:text-white">₹{product.price}</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm active:scale-95"
                                        title="Add to cart"
                                    >
                                        <ShoppingCart size={20} />
                                    </button>
                                </div>
                            </div>
                        </Motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
