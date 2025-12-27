import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion as Motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { useWishlist } from '../context/WishlistContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectCreative, Navigation } from 'swiper/modules';
import { Minus, Plus, Heart } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-creative';
import 'swiper/css/navigation';



import ProductCardSkeleton from '../components/skeletons/ProductCardSkeleton';

import CategoryNavbar from '../components/category/CategoryNavbar';

const ProductList = () => {
    // ... existing hook calls ...
    const { products, loading, addToCart, cart, updateCartQuantity, removeFromCart } = useData();
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get('category') || 'All';

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState(initialCategory);
    const { toggleWishlist, isInWishlist } = useWishlist();
    const navigate = useNavigate();


    // Update filter if URL param changes
    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl) {
            setCategoryFilter(categoryFromUrl);
        }
    }, [searchParams]);

    // ... existing filter logic ...
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryName = product.category?.name || 'Uncategorized';
        const matchesCategory = categoryFilter === 'All' || categoryName === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', ...new Set(products.map(p => p.category?.name || 'Uncategorized'))];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
            <CategoryNavbar />
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-orange-900 dark:text-orange-400" style={{ fontFamily: 'serif' }}>Our Collection</h1>

                <div className="w-full md:w-96 relative">
                    <input
                        type="text"
                        placeholder="Search for handlooms..."
                        className="w-full p-3 pl-10 border border-gray-200 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-orange-500 bg-gray-50 dark:bg-gray-800 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))
                ) : (
                    filteredProducts.map(product => (
                        <Motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3 }}
                            onClick={() => navigate(`/product/${product.id}`)}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer group flex flex-col"
                        >
                            {/* Image Section with Swiper */}
                            <div className="h-64 bg-gray-100 dark:bg-gray-700 relative overflow-hidden group">

                                {product.images && product.images.length > 0 ? (
                                    product.images.length > 1 ? (
                                        <Swiper
                                            modules={[Pagination, Autoplay, EffectCreative, Navigation]}
                                            effect={'creative'}
                                            creativeEffect={{
                                                prev: {
                                                    shadow: true,
                                                    translate: [0, 0, -400],
                                                },
                                                next: {
                                                    translate: ['100%', 0, 0],
                                                },
                                            }}
                                            navigation={true}
                                            pagination={{ clickable: true, dynamicBullets: true }}
                                            spaceBetween={0}
                                            slidesPerView={1}
                                            loop={true}
                                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                                            className="h-full w-full"
                                            style={{
                                                '--swiper-navigation-color': '#ea580c',
                                                '--swiper-pagination-color': '#ea580c',
                                                '--swiper-navigation-size': '25px',
                                            }}
                                        >
                                            {product.images.map((img, index) => (
                                                <SwiperSlide key={img.id || index}>
                                                    <div className="block w-full h-full">
                                                        <img
                                                            src={img.imageUrl}
                                                            alt={`${product.name} - ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    ) : (
                                        <div className="block w-full h-full">
                                            <img
                                                src={product.images[0].imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                    )
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                                        No Image
                                    </div>
                                )}

                                {product.discountPrice > 0 && (
                                    <span className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                        {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                                    </span>
                                )}
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold uppercase">{product.category?.name || 'Uncategorized'}</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleWishlist(product);
                                        }}
                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                        aria-label="Add to wishlist"
                                    >
                                        <Heart
                                            size={20}
                                            className={isInWishlist(product.id) ? 'text-red-500 fill-red-500' : ''}
                                        />
                                    </button>

                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate group-hover:text-orange-700 dark:group-hover:text-orange-400 transition">{product.name}</h3>

                                {product.seller?.id && (
                                    <div className="mb-2 flex items-center justify-between" onClick={e => e.stopPropagation()}>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">By {product.seller.shopName || "Seller"}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-end mt-auto">
                                    <div>
                                        {product.discountPrice > 0 ? (
                                            <div className="flex flex-col">
                                                <span className="text-gray-400 line-through text-sm">₹{product.price}</span>
                                                <span className="text-xl font-bold text-orange-700 dark:text-orange-400">₹{product.discountPrice}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xl font-bold text-orange-700 dark:text-orange-400">₹{product.price}</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(product);
                                        }}
                                        className="px-4 py-2 bg-orange-700 text-white rounded-lg text-sm font-semibold hover:bg-orange-800 transition shadow-md active:transform active:scale-95"
                                    >
                                        Add +
                                    </button>
                                </div>
                            </div>
                        </Motion.div>
                    ))
                )}
            </div>
            {!loading && filteredProducts.length === 0 && (
                <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                    <p className="text-xl">No products found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default ProductList;
