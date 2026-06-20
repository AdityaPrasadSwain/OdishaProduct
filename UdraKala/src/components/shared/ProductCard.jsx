import React from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useData } from '../../context/DataContext';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useData();

    // Safely extract data
    const imagePath = product.images && product.images.length > 0 ? product.images[0].imagePath : '/placeholder.jpg';
    const categoryName = product.category?.name || 'Uncategorized';
    const hasDiscount = product.discountPrice > 0;
    
    // Fake rating since it might not be in the model
    const rating = product.rating || "4.8";
    const reviewCount = product.reviews?.length || Math.floor(Math.random() * 100) + 12;

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    const handleWishlist = (e) => {
        e.stopPropagation();
        toggleWishlist(product);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            onClick={handleCardClick}
            className="group cursor-pointer bg-bg-surface dark:bg-bg-dark rounded-2xl shadow-[0_4px_16px_rgba(20,20,40,0.06)] hover:shadow-[0_8px_24px_rgba(20,20,40,0.10)] transition-all duration-300 flex flex-col overflow-hidden border border-border dark:border-border"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] bg-bg-page dark:bg-bg-dark overflow-hidden">
                <img 
                    src={imagePath} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Rating Badge */}
                <div className="absolute top-3 left-3 bg-bg-surface/90 backdrop-blur-sm dark:bg-bg-dark/90 px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star size={12} className="text-[#F5A623] fill-[#F5A623]" />
                    <span className="text-xs font-semibold text-text-primary dark:text-text-onDark">{rating}</span>
                    <span className="text-[10px] text-text-secondary">({reviewCount})</span>
                </div>

                {/* Floating Actions Bottom Right */}
                <div className="absolute bottom-3 right-3 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button 
                        onClick={handleWishlist}
                        className="w-10 h-10 rounded-full bg-bg-surface dark:bg-bg-dark flex items-center justify-center shadow-md text-text-secondary hover:text-status-error transition-colors"
                        aria-label="Add to wishlist"
                    >
                        <Heart size={18} className={isInWishlist(product.id) ? 'fill-red-500 text-status-error' : ''} />
                    </button>
                    {product.stockQuantity > 0 && (
                        <button 
                            onClick={handleAddToCart}
                            className="w-10 h-10 rounded-full bg-bg-band dark:bg-bg-dark flex items-center justify-center shadow-md text-primary hover:bg-primary hover:text-text-onDark transition-colors"
                            aria-label="Add to cart"
                        >
                            <ShoppingBag size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Product Details */}
            <div className="p-4 flex flex-col flex-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-text-secondary mb-1">
                    {categoryName}
                </span>
                
                <h3 className="font-semibold text-text-primary dark:text-text-onDark text-sm sm:text-base line-clamp-1 mb-2">
                    {product.name}
                </h3>
                
                <div className="mt-auto flex items-baseline gap-2">
                    <span className="font-bold text-text-primary dark:text-text-onDark text-lg">
                        ₹{hasDiscount ? product.discountPrice : product.price}
                    </span>
                    {hasDiscount && (
                        <span className="text-sm text-text-secondary line-through">
                            ₹{product.price}
                        </span>
                    )}
                </div>
                
                {product.stockQuantity <= 0 && (
                    <div className="mt-2 text-xs font-bold text-status-error bg-red-50 dark:bg-status-error/10 inline-block px-2 py-1 rounded-md w-fit">
                        Out of Stock
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ProductCard;
