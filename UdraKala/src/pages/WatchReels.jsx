import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { X, VolumeX, Volume2, Heart, MessageCircle, Share2, ShoppingBag, Send, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Swal from 'sweetalert2';
import FollowButton from '../components/FollowButton';

const WatchReels = ({ isEmbedded, onClose, filterSellerId, initialReelId }) => {
    // Helper to access props consistently if logic uses them
    const props = { filterSellerId, initialReelId };
    const [searchParams] = useSearchParams();
    const productId = searchParams.get('productId');
    const navigate = useNavigate();

    const [reels, setReels] = useState([]);
    // Use initialReelId to find index later, but default to 0
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);

    const videoRefs = useRef([]);

    // --- Social State (Optimistic) ---
    // Map of reelId -> { liked, likeCount, comments[], commentCount }
    const [socialData, setSocialData] = useState({});
    const [activeCommentReelId, setActiveCommentReelId] = useState(null); // For modal

    useEffect(() => {
        fetchReels();
    }, [productId, props.filterSellerId]); // Re-fetch if filter changes

    const fetchReels = async () => {
        try {
            setLoading(true);
            let url = `/customer/reels`;

            // If filtering by seller (Profile View)
            if (props.filterSellerId) {
                // Correct endpoint for public seller reels
                url = `/public/sellers/${props.filterSellerId}/reels`;
            } else if (productId) {
                url = `/customer/reels?productId=${productId}`;
            }

            const response = await API.get(url);

            let fetchedReels = [];

            if (props.filterSellerId) {
                // PublicSellerController returns List<Map<String, Object>> directly
                const reelsList = response.data; // It's an array, not an object with .reels
                fetchedReels = reelsList.map(r => ({
                    id: r.id, // backend 'id' is the UUID here
                    productId: r.id, // Map 'id' to 'productId' for consistency
                    videoUrl: r.videoUrl,
                    thumbnailUrl: r.thumbnail, // 'thumbnail' vs 'thumbnailUrl'
                    productName: r.name,
                    price: r.price,
                    sellerId: props.filterSellerId, // We know the seller
                    sellerName: "", // Might be missing in this concise DTO
                    caption: r.name // Fallback
                }));
            } else {
                fetchedReels = response.data;
            }

            if (fetchedReels && fetchedReels.length > 0) {
                setReels(fetchedReels);

                // Initialize social data 
                const initialSocial = {};
                fetchedReels.forEach(r => {
                    initialSocial[r.productId] = {
                        liked: false,
                        likeCount: 0,
                        commentCount: 0,
                        sellerId: r.sellerId
                    };
                    fetchSocialCounts(r.productId);
                });
                setSocialData(prev => ({ ...prev, ...initialSocial }));

                // Scroll to initial reel if specified
                if (props.initialReelId) {
                    const index = fetchedReels.findIndex(r => r.productId === props.initialReelId);
                    if (index !== -1) {
                        setCurrentIndex(index);
                        // Use setTimeout to allow DOM to render before scrolling
                        setTimeout(() => {
                            const element = document.getElementById(`reel-${index}`);
                            if (element) element.scrollIntoView();
                        }, 100);
                    }
                }

            } else {
                if (productId && !isEmbedded) {
                    Swal.fire({ icon: 'info', text: 'No reels available.' }).then(() => navigate(-1));
                }
            }
        } catch (error) {
            console.error("Error fetching reels:", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper for UUID validation
    const isValidUUID = (uuid) => {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
    };

    const fetchSocialCounts = async (productId) => {
        if (!productId || productId === 'undefined' || !isValidUUID(productId)) {
            // console.warn("Skipping social counts for invalid ID:", productId);
            return;
        }
        try {
            const [likesRes, commentsRes] = await Promise.all([
                API.get(`/reels/${productId}/likes/count`).catch(() => ({ data: { count: 0, isLiked: false } })),
                API.get(`/reels/${productId}/comments/count`).catch(() => ({ data: { count: 0 } }))
            ]);

            setSocialData(prev => ({
                ...prev,
                [productId]: {
                    ...prev[productId],
                    likeCount: likesRes.data.count,
                    liked: likesRes.data.isLiked,
                    commentCount: commentsRes.data.count
                }
            }));
        } catch (e) {
            console.error("Social fetch error", e);
        }
    };

    // --- INTERACTION HANDLERS ---

    const handleLike = async (reel) => {
        const id = reel.productId;

        if (!id || !isValidUUID(id)) {
            console.error("Invalid reel ID for like:", id);
            return;
        }

        const current = socialData[id] || { liked: false, likeCount: 0 };
        const newLiked = !current.liked;
        const newCount = newLiked ? current.likeCount + 1 : Math.max(0, current.likeCount - 1);

        // Optimistic Update
        setSocialData(prev => ({
            ...prev,
            [id]: { ...current, liked: newLiked, likeCount: newCount }
        }));

        try {
            if (newLiked) await API.post(`/reels/${id}/like`);
            else await API.delete(`/reels/${id}/like`);
        } catch (error) {
            // Revert
            setSocialData(prev => ({
                ...prev,
                [id]: current
            }));
            if (error.response?.status === 401) {
                Swal.fire("Login Required", "Please login to like reels", "warning");
            }
        }
    };

    const handleShare = async (reel) => {
        const url = `${window.location.origin}/product/${reel.productId}`;
        if (navigator.share) {
            try {
                await navigator.share({ title: reel.productName, url });
            } catch (e) { console.log(e); }
        } else {
            navigator.clipboard.writeText(url);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Link copied!',
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    // --- VIDEO OBSERVER & VIEW TRACKING ---
    useEffect(() => {
        const options = { threshold: 0.6 };
        // Store timeouts to clear them if user scrolls away quickly
        const viewTimers = {};

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const index = parseInt(entry.target.dataset.index);
                const video = videoRefs.current[index];
                const reelId = entry.target.dataset.reelid; // Needed for API call

                if (entry.isIntersecting) {
                    if (video) {
                        if (video.readyState >= 2) {
                            const playPromise = video.play();
                            if (playPromise !== undefined) {
                                playPromise.catch(console.error);
                            }
                        }
                        setCurrentIndex(index);
                        setIsPlaying(true);

                        // Start View Timer (2 seconds)
                        if (reelId && !viewTimers[reelId]) {
                            viewTimers[reelId] = setTimeout(() => {
                                trackView(reelId);
                                delete viewTimers[reelId]; // Prevent double counting in this session logic if needed, 
                                // though backend also dedups. Frontend dedup per scroll session is good too.
                            }, 2000);
                        }
                    }
                } else {
                    if (video) {
                        video.pause();
                        video.currentTime = 0; // Reset video when scrolled away
                    }
                    // Cancel view timer if scrolled away before 2s
                    if (reelId && viewTimers[reelId]) {
                        clearTimeout(viewTimers[reelId]);
                        delete viewTimers[reelId];
                    }
                }
            });
        }, options);

        videoRefs.current.forEach(v => v && observer.observe(v));
        return () => {
            videoRefs.current.forEach(v => v && observer.unobserve(v));
            // Clear all pending timers on unmount
            Object.values(viewTimers).forEach(clearTimeout);
        };
    }, [reels]);

    const trackView = async (reelId) => {
        try {
            // Log view
            // Generate simple session ID if not logged in? 
            // For now rely on backend handling auth user or implementing anon logic later
            // We'll pass a random session string for now if needed
            const sessionId = localStorage.getItem('reel_session_id') || Math.random().toString(36).substring(7);
            localStorage.setItem('reel_session_id', sessionId);

            await API.post(`/reels/${reelId}/view?sessionId=${sessionId}`);
            console.log(`View recorded for ${reelId}`);
        } catch (e) {
            // Ignore view tracking errors silently
        }
    };

    const togglePlayPause = (e) => {
        e?.stopPropagation();
        const video = videoRefs.current[currentIndex];
        if (video) {
            if (video.paused) {
                video.play();
                setIsPlaying(true);
            } else {
                video.pause();
                setIsPlaying(false);
            }
        }
    };

    const toggleMute = (e) => {
        e?.stopPropagation();
        if (isMuted) {
            const currentVideo = videoRefs.current[currentIndex];
            if (currentVideo) {
                currentVideo.muted = false;
                currentVideo.volume = 1.0;
            }
            setIsMuted(false);
        } else {
            setIsMuted(true);
        }
    };

    const handleClose = () => {
        if (isEmbedded && onClose) onClose();
        else navigate(-1);
    };

    if (loading) return <div className="h-screen w-full bg-black text-white flex items-center justify-center">Loading...</div>;

    return (
        <div className="bg-black h-screen w-full overflow-y-scroll snap-y snap-mandatory scrollbar-none relative font-sans">
            {/* Close Button */}
            <button onClick={handleClose} className="fixed top-4 right-4 z-50 bg-black/40 p-2 rounded-full text-white backdrop-blur-md">
                <X size={24} />
            </button>

            {reels.map((reel, index) => {
                const social = socialData[reel.productId] || { liked: false, likeCount: 0, commentCount: 0 };

                // Safety check for video URL
                const isValidVideo = reel.videoUrl && reel.videoUrl.includes('/video/upload/'); // Basic Cloudinary check
                if (!isValidVideo && reel.videoUrl) console.warn("Potential invalid video URL:", reel.videoUrl);

                return (
                    <div key={reel.id} id={`reel-${index}`} className="h-screen w-full snap-start relative flex items-center justify-center bg-gray-900">
                        {/* Video */}
                        <video
                            ref={el => videoRefs.current[index] = el}
                            data-index={index}
                            data-reelid={reel.productId}
                            src={reel.videoUrl}
                            poster={reel.thumbnailUrl}
                            className="h-full w-full object-cover md:max-w-md mx-auto"

                            // CRITICAL FIXES
                            autoPlay
                            loop
                            muted={isMuted} // React controls attribute
                            playsInline
                            webkit-playsinline="true" // iOS Safari fix
                            preload="metadata" // Performance

                            onClick={togglePlayPause}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                        />

                        {/* Play/Pause Overlay Icon */}
                        {!isPlaying && index === currentIndex && (
                            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                                <div className="bg-black/40 p-4 rounded-full backdrop-blur-sm">
                                    <Play fill="white" size={48} className="text-white ml-1" />
                                </div>
                            </div>
                        )}

                        {/* Mute Overlay */}
                        <button onClick={toggleMute} className="absolute top-4 left-4 z-40 p-2 bg-black/40 rounded-full text-white">
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>

                        {/* RIGHT SIDE ACTION BAR (Instagram Style) */}
                        <div className="absolute right-4 bottom-24 flex flex-col gap-6 items-center z-50 text-white md:right-[calc(50%-224px+1rem)]">
                            {/* LIKE */}
                            <div className="flex flex-col items-center gap-1">
                                <button onClick={() => handleLike(reel)} className="p-2 transition active:scale-90">
                                    <Heart size={32} fill={social.liked ? "#ef4444" : "transparent"} color={social.liked ? "#ef4444" : "white"} />
                                </button>
                                <span className="text-xs font-medium">{social.likeCount}</span>
                            </div>

                            {/* COMMENT */}
                            <div className="flex flex-col items-center gap-1">
                                <button onClick={() => setActiveCommentReelId(reel.productId)} className="p-2 transition active:scale-90">
                                    <MessageCircle size={32} color="white" />
                                </button>
                                <span className="text-xs font-medium">{social.commentCount}</span>
                            </div>

                            {/* SHARE */}
                            <div className="flex flex-col items-center gap-1">
                                <button onClick={() => handleShare(reel)} className="p-2 transition active:scale-90">
                                    <Share2 size={30} color="white" />
                                </button>
                                <span className="text-xs font-medium">Share</span>
                            </div>

                            {/* Product specific CTA icon if needed */}
                            <Link to={`/product/${reel.productId}`} className="p-2 bg-white/20 backdrop-blur-md rounded-full mt-2">
                                <ShoppingBag size={24} />
                            </Link>
                        </div>

                        {/* BOTTOM INFO OVERLAY */}
                        <div className="absolute bottom-0 left-0 w-full md:max-w-md md:left-1/2 md:-translate-x-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-24 pb-8 px-5 z-40 pointer-events-none">
                            <div className="pointer-events-auto flex flex-col gap-3">
                                {/* Seller Info Row */}
                                <div className="flex items-center gap-3 mb-1">
                                    <Link to={`/seller/${reel.sellerId}`} className="block">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold border-2 border-white text-xs">
                                            {reel.sellerName ? reel.sellerName.charAt(0).toUpperCase() : 'S'}
                                        </div>
                                    </Link>
                                    <div className="flex flex-col items-start">
                                        <div className="flex items-center gap-2">
                                            <Link to={`/seller/${reel.sellerId}`} className="text-white font-bold text-sm shadow-sm hover:underline">
                                                {reel.sellerName || 'Seller'}
                                            </Link>
                                            {reel.sellerId && (
                                                <div className="scale-90 origin-left">
                                                    <FollowButton sellerId={reel.sellerId} sellerName={reel.sellerName} source="REEL" sourceReelId={reel.productId} />
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-white/80 flex items-center gap-1">
                                            <Volume2 size={10} /> Original Audio
                                        </span>
                                    </div>
                                </div>

                                {/* Caption & Product */}
                                <div className="space-y-1">
                                    <h2 className="text-white text-lg font-bold line-clamp-1 drop-shadow-md">{reel.productName}</h2>
                                    {reel.caption && <p className="text-sm text-white/95 line-clamp-2 leading-relaxed drop-shadow-md">{reel.caption}</p>}
                                    <p className="text-orange-400 font-bold drop-shadow-md">₹{reel.price}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* COMMENTS SHEET/MODAL */}
            <AnimatePresence>
                {activeCommentReelId && (
                    <CommentSheet
                        reelId={activeCommentReelId}
                        onClose={() => setActiveCommentReelId(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const CommentSheet = ({ reelId, onClose }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComments();
    }, [reelId]);

    const fetchComments = async () => {
        if (!reelId || reelId === 'undefined') return;
        // Simple regex check if needed, but 'undefined' check is main fix
        try {
            const res = await API.get(`/reels/${reelId}/comments`);
            setComments(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const submitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const res = await API.post(`/reels/${reelId}/comments`, { comment: newComment });
            // Adapt response to state format
            const savedComment = {
                id: res.data.id,
                content: res.data.content,
                user: res.data.user,
                createdAt: res.data.createdAt
            };
            setComments([savedComment, ...comments]);
            setNewComment("");
        } catch (error) {
            Swal.fire("Error", "Could not post comment", "error");
        }
    };

    return (
        <>
            <motion.div
                className="fixed inset-0 bg-black/60 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />
            <motion.div
                className="fixed bottom-0 w-full md:max-w-md md:left-1/2 md:-translate-x-1/2 h-[60vh] bg-gray-900 rounded-t-2xl z-50 flex flex-col border-t border-gray-700"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                    <h3 className="text-white font-bold">Comments</h3>
                    <button onClick={onClose}><X className="text-gray-400" size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? <p className="text-white/50 text-center">Loading...</p> : (
                        comments.length === 0 ? <p className="text-white/50 text-center text-sm">No comments yet. Be the first!</p> :
                            comments.map((c) => (
                                <div key={c.id} className="space-y-2">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                            {c.user ? c.user.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-white/60 font-medium">{c.user} <span className="text-[10px] ml-2 opacity-50">{new Date(c.createdAt).toLocaleDateString()}</span></span>
                                            <p className="text-sm text-white/90">{c.content}</p>
                                        </div>
                                    </div>
                                    {/* Replies */}
                                    {c.replies && c.replies.length > 0 && (
                                        <div className="pl-11 space-y-2">
                                            {c.replies.map(reply => (
                                                <div key={reply.id} className="flex gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                                                        {reply.user.charAt(0)}
                                                    </div>
                                                    <div className={`bg-gray-800 p-2 rounded-lg ${reply.isSellerReply ? 'border-l-2 border-orange-500' : ''}`}>
                                                        <span className="text-xs text-white/60 font-medium flex items-center gap-2">
                                                            {reply.user}
                                                            {reply.isSellerReply && <span className="text-[9px] bg-orange-500 text-white px-1 rounded">SELLER</span>}
                                                        </span>
                                                        <p className="text-xs text-white/90 mt-0.5">{reply.content}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                    )}
                </div>

                <form onSubmit={submitComment} className="p-4 border-t border-gray-800 flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <button type="submit" disabled={!newComment.trim()} className="text-orange-500 font-bold p-2 hover:bg-white/10 rounded-full disabled:opacity-50">
                        <Send size={20} />
                    </button>
                </form>
            </motion.div>
        </>
    );
};

export default WatchReels;
