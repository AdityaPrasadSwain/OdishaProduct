import React from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'motion/react';
import { useWishlist } from '../context/WishlistContext';
import { useData } from '../context/DataContext';
import { ShoppingCart, Trash2, Heart, Image } from 'lucide-react';
import ProductCardSkeleton from '../components/skeletons/ProductCardSkeleton';

const Wishlist = () => {
    const { wishlistItems, loading, removeFromWishlist } = useWishlist();
    const { addToCart } = useData();

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div className="h-8 bg-bg-band dark:bg-bg-dark w-48 rounded animate-pulse"></div>
                    <div className="h-4 bg-bg-band dark:bg-bg-dark w-24 rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-text-primary dark:text-text-onDark flex items-center gap-2">
                    <Heart className="text-status-error fill-red-500" /> My Wishlist
                </h1>
                <p className="text-text-secondary dark:text-text-secondary">
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                </p>
            </div>

            {wishlistItems.length === 0 ? (
                <div className="text-center py-20 bg-bg-page dark:bg-bg-dark/50 rounded-2xl border-2 border-dashed border-border dark:border-border">
                    <div className="mb-4 flex justify-center">
                        <Heart className="w-16 h-16 text-text-secondary dark:text-text-secondary" />
                    </div>
                    <h2 className="text-2xl font-semibold text-text-primary dark:text-text-onDark mb-2">Your wishlist is empty</h2>
                    <p className="text-text-secondary dark:text-text-secondary mb-8">Save items you love in your wishlist and they will appear here.</p>
                    <Link
                        to="/products"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-text-onDark bg-primary hover:bg-primary-hover transition-colors"
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
                            className="bg-bg-surface dark:bg-bg-dark rounded-xl shadow-sm border border-border dark:border-border overflow-hidden group hover:shadow-md transition-shadow"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <Link to={`/product/${product.id}`}>
                                    {product.images?.[0]?.imagePath ? (
                                        <img
                                            src={product.images[0].imagePath}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-bg-band dark:bg-bg-dark flex items-center justify-center">
                                            <Image size={40} className="text-text-secondary dark:text-text-secondary" />
                                        </div>
                                    )}
                                </Link>
                                <button
                                    onClick={() => removeFromWishlist(product.id)}
                                    className="absolute top-2 right-2 p-2 bg-bg-surface/90 dark:bg-bg-dark/90 rounded-full text-status-error hover:bg-red-50 transition-colors shadow-sm"
                                    title="Remove from wishlist"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="p-4">
                                <div className="mb-1">
                                    <span className="text-xs font-semibold text-primary dark:text-primary uppercase tracking-wider">
                                        {product.category?.name || 'Uncategorized'}
                                    </span>
                                </div>
                                <Link to={`/product/${product.id}`}>
                                    <h3 className="text-lg font-bold text-text-primary dark:text-text-onDark hover:text-primary transition-colors mb-2 truncate">
                                        {product.name}
                                    </h3>
                                </Link>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex flex-col">
                                        {product.discountPrice > 0 ? (
                                            <>
                                                <span className="text-sm text-text-secondary line-through">₹{product.price}</span>
                                                <span className="text-xl font-bold text-text-primary dark:text-text-onDark">₹{product.discountPrice}</span>
                                            </>
                                        ) : (
                                            <span className="text-xl font-bold text-text-primary dark:text-text-onDark">₹{product.price}</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="p-2 bg-primary text-text-onDark rounded-lg hover:bg-primary-hover transition-colors shadow-sm active:scale-95"
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
