import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion as Motion } from 'motion/react';
import { ArrowLeft, Star, ShoppingBag, Truck, ShieldCheck, Heart, Info, Package, MapPin, Ruler, ChevronRight, Tag, Zap, Award, Minus, Plus, Film, AlertTriangle, XCircle, RefreshCcw } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useWishlist } from '../context/WishlistContext';
import Badge from '../components/ui/Badge';
import API from '../api/axios';
import reviewApi from '../api/reviewApi';
import Swal from 'sweetalert2';
import FollowButton from '../components/FollowButton';
import ReviewModal from '../components/customer/ReviewModal';
import ProductDetailsSkeleton from '../components/skeletons/ProductDetailsSkeleton';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const ProductDetails = () => {
    const { productId } = useParams();
    const { addToCart, cart, updateCartQuantity, removeFromCart } = useData();

    const { toggleWishlist, isInWishlist } = useWishlist();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const cartItem = cart.find(item => item.id === product?.id);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const [reviews, setReviews] = useState([]);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [eligibleOrderItemId, setEligibleOrderItemId] = useState(null);

    useEffect(() => {
        fetchProductDetails();
        checkReviewEligibility();
    }, [productId]);

    const checkReviewEligibility = async () => {
        try {
            // Only check if user is logged in
            if (localStorage.getItem('token')) {
                const orderItemId = await reviewApi.checkProductEligibility(productId);
                setEligibleOrderItemId(orderItemId);
            }
        } catch (error) {
            console.error("Eligibility check failed", error);
        }
    };

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/customer/products/${productId}`);
            setProduct(response.data);
            if (response.data.images && response.data.images.length > 0) {
                setActiveImage(response.data.images[0].imageUrl);
            }

            // Fetch Reviews
            try {
                const reviewsData = await reviewApi.getProductReviews(productId);
                setReviews(reviewsData);
            } catch (err) {
                console.error("Failed to load reviews", err);
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
            Swal.fire({
                icon: 'error',
                title: 'Product Not Found',
                text: 'The product you are looking for does not exist or has been removed.',
                confirmButtonColor: '#ea580c'
            });
        } finally {
            setLoading(false);
        }
    };

    const sortedImages = useMemo(() => {
        if (!product?.images) return [];
        return [...product.images].sort((a, b) => a.position - b.position);
    }, [product]);

    // Star Rating Helper
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<Star key={i} size={18} fill="#facc15" className="text-yellow-400" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<Star key={i} size={18} fill="url(#halfGrad)" className="text-yellow-400" />);
            } else {
                stars.push(<Star key={i} size={18} fill="transparent" className="text-gray-300 dark:text-gray-600" />);
            }
        }
        return (
            <>
                <svg width="0" height="0" className="absolute">
                    <defs>
                        <linearGradient id="halfGrad">
                            <stop offset="50%" stopColor="#facc15" />
                            <stop offset="50%" stopColor="transparent" stopOpacity="1" />
                        </linearGradient>
                    </defs>
                </svg>
                {stars}
            </>
        );
    };

    if (loading) {
        return <ProductDetailsSkeleton />;
    }

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Product not found</h2>
            <Link to="/products" className="text-orange-600 hover:underline">Return to Shop</Link>
        </div>
    );

    const isOutOfStock = product.stockQuantity <= 0;

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();

        // Calculate percentages for the background position (0-100)
        let x = ((e.pageX - left) / width) * 100;
        let y = ((e.pageY - top) / height) * 100;

        // Clamp values between 0 and 100
        x = Math.max(0, Math.min(100, x));
        y = Math.max(0, Math.min(100, y));

        setZoomPos({ x, y });
    };

    const handleNotifyMe = async () => {
        try {
            if (!localStorage.getItem('token')) {
                // Determine logic for guest. Prompt says "Peaceful user communication", 
                // but stockController requires login currently.
                Swal.fire({
                    icon: 'info',
                    title: 'Please Log In',
                    text: 'You need to be logged in to subscribe for notifications.',
                    confirmButtonText: 'Log In',
                    showCancelButton: true
                }).then((result) => {
                    if (result.isConfirmed) navigate('/login');
                });
                return;
            }

            const response = await API.post(`/stock/${product.id}/notify-me`);

            Swal.fire({
                title: "You’re All Set 😊",
                html: `
                  <p>Thank you for your interest.</p>
                  <p>This product is currently out of stock.</p>
                  <p>We will notify you as soon as it becomes available again.</p>
                  <p class="mt-2 text-sm text-gray-500">We truly appreciate your patience and your choice to shop with us.</p>
                `,
                icon: 'success',
                confirmButtonColor: '#ea580c'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.message || 'Something went wrong.',
            });
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
            {/* Breadcrumbs */}

            <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Link to="/" className="hover:text-orange-600 transition">Home</Link>
                        <ChevronRight size={14} />
                        <Link to="/products" className="hover:text-orange-600 transition">Collection</Link>
                        <ChevronRight size={14} />
                        <span className="text-orange-600 dark:text-orange-400 font-medium truncate max-w-[200px]">{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* LEFT: VERTICAL GALLERY & STICKY MAIN PREVIEW */}
                    <div className="lg:w-[48%] lg:sticky lg:top-24 h-fit">
                        <div className="flex flex-col-reverse lg:flex-row gap-4">
                            {/* Vertical Thumbnail List */}
                            {sortedImages.length > 1 && (
                                <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[500px] pr-2 scrollbar-none">
                                    {sortedImages.map((img, idx) => (
                                        <button
                                            key={img.id || idx}
                                            onClick={() => setActiveImage(img.imageUrl)}
                                            onMouseEnter={() => setActiveImage(img.imageUrl)}
                                            className={`w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === img.imageUrl
                                                ? 'border-orange-500 shadow-md ring-2 ring-orange-500/20'
                                                : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                                                }`}
                                        >
                                            <img src={img.imageUrl} className="w-full h-full object-cover" alt="thumbnail" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main Preview */}
                            <div className="flex-1 relative">
                                <div
                                    ref={containerRef}
                                    className="aspect-square bg-white dark:bg-gray-800 rounded-xl overflow-hidden relative border border-gray-200 dark:border-gray-700 shadow-sm group cursor-crosshair transition-all"
                                    onMouseMove={handleMouseMove}
                                    onMouseEnter={() => setIsZoomed(true)}
                                    onMouseLeave={() => setIsZoomed(false)}
                                >
                                    {product.discountPrice > 0 && (
                                        <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1.5 rounded-md font-black shadow-md z-10 text-xs tracking-tight">
                                            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                                        </div>
                                    )}

                                    {/* Lens Overlay */}
                                    {isZoomed && (
                                        <div
                                            className="absolute pointer-events-none border border-orange-500/50 bg-orange-500/10 z-20"
                                            style={{
                                                width: '150px',
                                                height: '150px',
                                                left: `${zoomPos.x}%`,
                                                top: `${zoomPos.y}%`,
                                                transform: 'translate(-50%, -50%)'
                                            }}
                                        />
                                    )}

                                    <button
                                        onClick={() => toggleWishlist(product)}
                                        className="absolute top-4 right-4 z-10 bg-white/80 dark:bg-gray-900/80 p-2.5 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-all"
                                    >
                                        <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} className={isInWishlist(product.id) ? "text-red-500" : ""} />
                                    </button>

                                    <Motion.img
                                        key={activeImage}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ opacity: { duration: 0.3 } }}
                                        src={activeImage || (product.images?.[0]?.imageUrl)}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-2"
                                    />
                                </div>

                                {/* SIDE ZOOM WINDOW (Desktop Only) */}
                                {isZoomed && (
                                    <Motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="hidden lg:block absolute top-0 left-full ml-6 w-full h-full z-[100] bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden pointer-events-none"
                                    >
                                        <div
                                            className="w-full h-full"
                                            style={{
                                                backgroundImage: `url(${activeImage || product.images?.[0]?.imageUrl})`,
                                                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundSize: '250%' // Zoom magnitude
                                            }}
                                        />
                                    </Motion.div>
                                )}
                            </div>
                        </div>

                        {/* Desktop Actions Buttons (Sticky on Desktop) */}
                        <div className="hidden lg:grid grid-cols-2 gap-4 mt-8">
                            {cartItem ? (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            if (cartItem.quantity > 1) {
                                                updateCartQuantity(product.id, cartItem.quantity - 1);
                                            } else {
                                                removeFromCart(product.id);
                                            }
                                        }}
                                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="px-2">{cartItem.quantity}</span>
                                    <button
                                        onClick={() => updateCartQuantity(product.id, cartItem.quantity + 1)}
                                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {!isOutOfStock ? (
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold bg-[#ff9f00] text-white hover:bg-[#f39700] transition active:scale-95 shadow-lg shadow-orange-100 dark:shadow-none"
                                        >
                                            <ShoppingBag size={20} /> ADD TO CART
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleNotifyMe}
                                            className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-100 dark:shadow-none col-span-2"
                                        >
                                            <AlertTriangle size={20} /> NOTIFY ME
                                        </button>
                                    )}
                                </>
                            )}

                            {!isOutOfStock && (
                                <button
                                    onClick={() => {
                                        addToCart(product);
                                        navigate('/checkout');
                                    }}
                                    className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold bg-[#fb641b] text-white hover:bg-[#e65a18] transition active:scale-95 shadow-lg shadow-orange-100 dark:shadow-none"
                                >
                                    <Zap size={20} /> BUY NOW
                                </button>
                            )}

                            <button
                                onClick={() => navigate(`/reels?productId=${product.id}`)}
                                className="col-span-2 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold bg-pink-600 text-white hover:bg-pink-700 transition active:scale-95 shadow-lg shadow-pink-100 dark:shadow-none"
                            >
                                <Film size={20} /> WATCH REEL
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: PRODUCT INFO */}
                    <div className="lg:w-[52%] space-y-8">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                                <Link to={product.seller?.id ? `/seller/${product.seller.id}` : '#'} className="hover:text-orange-600 transition">
                                    {product.seller?.shopName || 'Odisha Handloom'}
                                </Link>
                            </p>
                            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-3">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center bg-green-600 text-white px-2 py-0.5 rounded text-sm font-bold gap-1">
                                    {product.averageRating?.toFixed(1) || '0.0'} <Star size={12} fill="white" />
                                </div>
                                <span className="text-gray-400 font-medium text-sm">
                                    {product.totalReviews || 0} Ratings & Reviews
                                </span>
                            </div>

                            <div className="flex items-baseline gap-3 mb-1">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{product.discountPrice > 0 ? product.discountPrice?.toLocaleString() : product.price?.toLocaleString()}</span>
                                {product.discountPrice > 0 && (
                                    <>
                                        <span className="text-gray-500 line-through text-lg">₹{product.price?.toLocaleString()}</span>
                                        <span className="text-green-600 font-bold">{Math.round(((product.price - product.discountPrice) / product.price) * 100)}% off</span>
                                    </>
                                )}
                            </div>
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Inclusive of all taxes</p>
                        </div>

                        {/* Offers Section */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold flex items-center gap-2">Available Offers</h3>
                            <div className="space-y-2">
                                {[
                                    "Bank Offer: 10% instant discount on SBI Credit Cards, up to ₹1,500.",
                                    "Bank Offer: 5% Unlimited Cashback on UdraKala Axis Bank Credit Card.",
                                    "Special Price: Get extra ₹500 off (price inclusive of cashback/coupon)"
                                ].map((offer, i) => (
                                    <div key={i} className="flex gap-2 text-sm items-start">
                                        <Tag size={16} className="text-green-600 mt-1 shrink-0" />
                                        <p className="text-gray-700 dark:text-gray-300"><span className="font-bold">Offer:</span> {offer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Highlights & Services Toggle/List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y border-gray-100 dark:border-gray-800 py-8">
                            <div>
                                <h3 className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-wider mb-4">Highlights & Services</h3>
                                <ul className="space-y-3 text-sm text-gray-800 dark:text-gray-200">
                                    <li className="flex gap-2 items-center"><Award size={16} className="text-orange-600 shrink-0" /> 100% Authentic Handloom</li>
                                    <li className="flex gap-2 items-center"><Truck size={16} className="text-orange-600 shrink-0" /> Free Delivery across India</li>
                                    <li className="flex gap-2 items-center">
                                        <RefreshCcw size={16} className="text-orange-600 shrink-0" />
                                        <span>7 Days <span className="font-semibold">Return & Exchange</span></span>
                                    </li>
                                    <li className="flex gap-2 items-center">
                                        <XCircle size={16} className="text-orange-600 shrink-0" />
                                        <span>Cancel anytime before <span className="font-semibold">Delivery</span></span>
                                    </li>
                                    <li className="flex gap-2 items-center"><Zap size={16} className="text-orange-600 shrink-0" /> Traditionally Woven by Artisans</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-wider mb-4">Seller</h3>
                                <div className="space-y-1">
                                    <p className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 justify-between">
                                        <span className="flex items-center gap-2">
                                            <Link to={`/seller/${product.seller?.id}`} className="hover:underline">
                                                {product.seller?.shopName || 'Odisha Handloom'}
                                            </Link>
                                            <Badge variant="success" className="text-[10px] px-1.5 h-4">4.8 ★</Badge>
                                        </span>
                                        {product.seller?.id && <FollowButton sellerId={product.seller.id} sellerName={product.seller.shopName} />}
                                    </p>
                                    <p className="text-sm text-gray-500">7 Days Service Policy</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-bold mb-4">Description</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>

                        {/* Tabular Specifications */}
                        <div>
                            <h3 className="text-lg font-bold mb-6">Specifications</h3>
                            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        <tr className="flex flex-col md:table-row">
                                            <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium md:w-1/3">Material</td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">{product.material || 'N/A'}</td>
                                        </tr>
                                        <tr className="flex flex-col md:table-row">
                                            <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium md:w-1/3">Color</td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">{product.color || 'N/A'}</td>
                                        </tr>
                                        <tr className="flex flex-col md:table-row">
                                            <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium md:w-1/3">Size / Dimensions</td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">{product.size || 'N/A'}</td>
                                        </tr>
                                        <tr className="flex flex-col md:table-row">
                                            <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium md:w-1/3">Origin</td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">{product.origin || 'Odisha'}</td>
                                        </tr>
                                        <tr className="flex flex-col md:table-row">
                                            <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium md:w-1/3">Pack Of</td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">{product.packOf || '1'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>



                        {/* RATINGS & REVIEWS SECTION */}
                        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 mt-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    Ratings & Reviews
                                    <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                                        {reviews.length}
                                    </span>
                                </h3>
                                {eligibleOrderItemId && (
                                    <button
                                        onClick={() => setReviewModalOpen(true)}
                                        className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-700 transition shadow-sm flex items-center gap-2"
                                    >
                                        <Star size={16} /> Write a Review
                                    </button>
                                )}
                            </div>

                            {reviews.length === 0 ? (
                                <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                    <Star size={32} className="mx-auto text-gray-300 mb-2" />
                                    <p className="text-gray-500">No reviews yet. Be the first to rate this product!</p>
                                    {eligibleOrderItemId && (
                                        <button
                                            onClick={() => setReviewModalOpen(true)}
                                            className="mt-4 text-orange-600 font-bold hover:underline"
                                        >
                                            Write a usage Review
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`px-2 py-0.5 rounded text-xs font-bold text-white flex items-center gap-1 ${review.rating >= 4 ? 'bg-green-600' : review.rating >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}>
                                                    {review.rating} <Star size={10} fill="currentColor" />
                                                </div>
                                                <p className="font-semibold text-sm text-gray-900 dark:text-gray-200">
                                                    {review.customerName}
                                                </p>
                                            </div>

                                            <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                                                {review.reviewText}
                                            </p>

                                            {/* Review Images */}
                                            {review.imageUrls && review.imageUrls.length > 0 && (
                                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-3">
                                                    {review.imageUrls.map((url, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={url}
                                                            alt={`Review ${idx}`}
                                                            className="w-20 h-20 object-cover rounded-lg border border-gray-100 dark:border-gray-700 cursor-pointer hover:opacity-90 transition"
                                                            onClick={() => window.open(url, '_blank')}
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            <p className="text-xs text-gray-400">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Mobile Actions (Fixed at bottom on Mobile) */}
            <div className="lg:hidden fixed bottom-14 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                {cartItem ? (
                    <div className="flex items-center gap-2 justify-center">
                        <button
                            onClick={() => {
                                if (cartItem.quantity > 1) {
                                    updateCartQuantity(product.id, cartItem.quantity - 1);
                                } else {
                                    removeFromCart(product.id);
                                }
                            }}
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="px-2">{cartItem.quantity}</span>
                        <button
                            onClick={() => updateCartQuantity(product.id, cartItem.quantity + 1)}
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                ) : (
                    <>
                        {!isOutOfStock ? (
                            <>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="py-4 font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-900 hover:bg-gray-50 transition border-r border-gray-100 dark:border-gray-800 uppercase tracking-tight text-sm"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => {
                                        addToCart(product);
                                        navigate('/checkout');
                                    }}
                                    className="py-4 font-bold text-white bg-[#fb641b] hover:bg-[#e65a18] transition uppercase tracking-tight text-sm"
                                >
                                    Buy Now
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleNotifyMe}
                                className="col-span-2 py-4 font-bold text-white bg-blue-600 hover:bg-blue-700 transition uppercase tracking-tight text-sm flex items-center justify-center gap-2"
                            >
                                <AlertTriangle size={16} /> Notify Me
                            </button>
                        )}
                    </>
                )}
                <button
                    onClick={() => navigate(`/reels?productId=${product.id}`)}
                    className="col-span-2 py-4 font-bold text-white bg-pink-600 hover:bg-pink-700 transition uppercase tracking-tight text-sm flex items-center justify-center gap-2"
                >
                    <Film size={16} /> Watch Reel
                </button>
            </div>

            {/* Review Modal */}
            <ReviewModal
                isOpen={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                product={product}
                orderItemId={eligibleOrderItemId}
                onReviewSubmitted={() => {
                    setEligibleOrderItemId(null); // Hide button after submission
                    fetchProductDetails(); // Refresh reviews
                }}
            />
        </div>
    );
};

export default ProductDetails;
