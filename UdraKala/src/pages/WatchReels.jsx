import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { X, VolumeX, Volume2, Heart, MessageCircle, Share2, UserPlus, ShoppingBag, Eye, Send, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Swal from 'sweetalert2';

const WatchReels = ({ isEmbedded, onClose }) => {
    const [searchParams] = useSearchParams();
    const productId = searchParams.get('productId');
    const navigate = useNavigate();

    const [reels, setReels] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isMuted, setIsMuted] = useState(true);

    const videoRefs = useRef([]);
    const containerRef = useRef(null);

    // --- Social State (Optimistic) ---
    // Map of reelId -> { liked, likeCount, comments[], commentCount, followed, isMe }
    const [socialData, setSocialData] = useState({});
    const [activeCommentReelId, setActiveCommentReelId] = useState(null); // For modal

    useEffect(() => {
        fetchReels();
    }, [productId]);

    const fetchReels = async () => {
        try {
            setLoading(true);
            const url = productId ? `/customer/reels?productId=${productId}` : `/customer/reels`;
            const response = await API.get(url);
            if (response.data && response.data.length > 0) {
                setReels(response.data);
                // Initialize social data 
                const initialSocial = {};
                response.data.forEach(r => {
                    initialSocial[r.productId] = {
                        liked: false,
                        likeCount: 0,
                        commentCount: 0,
                        followed: false,
                        sellerId: r.sellerId
                    };
                    fetchSocialCounts(r.productId, r.sellerId);
                });
                setSocialData(prev => ({ ...prev, ...initialSocial }));
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

    const fetchSocialCounts = async (productId, sellerId) => {
        try {
            const [likesRes, commentsRes] = await Promise.all([
                API.get(`/reels/${productId}/likes/count`).catch(() => ({ data: { count: 0, isLiked: false } })),
                API.get(`/reels/${productId}/comments/count`).catch(() => ({ data: { count: 0 } }))
            ]);

            // Separate fetch for follow status if sellerId exists
            let followData = { count: 0, isFollowing: false };
            if (sellerId) {
                try {
                    const fRes = await API.get(`/sellers/${sellerId}/followers/count`);
                    followData = fRes.data;
                } catch (e) { }
            }

            setSocialData(prev => ({
                ...prev,
                [productId]: {
                    ...prev[productId],
                    likeCount: likesRes.data.count,
                    liked: likesRes.data.isLiked,
                    commentCount: commentsRes.data.count,
                    followed: followData.isFollowing
                }
            }));
        } catch (e) {
            console.error("Social fetch error", e);
        }
    };

    // --- INTERACTION HANDLERS ---

    const handleLike = async (reel) => {
        const id = reel.productId;
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

    const toggleFollow = async (reel) => {
        const id = reel.productId;
        const sellerId = reel.sellerId;

        if (!sellerId) return;

        const current = socialData[id] || { followed: false };
        const newFollowed = !current.followed;

        // Optimistic
        setSocialData(prev => ({
            ...prev,
            [id]: { ...current, followed: newFollowed }
        }));

        try {
            if (newFollowed) await API.post(`/sellers/${sellerId}/follow`);
            else await API.delete(`/sellers/${sellerId}/follow`);
        } catch (error) {
            setSocialData(prev => ({
                ...prev,
                [id]: current
            }));
            if (error.response?.status === 400 && error.response.data.message === "Cannot follow yourself") {
                Swal.fire("Info", "You cannot follow yourself", "info");
            } else if (error.response?.status === 401) {
                Swal.fire("Login Required", "Please login to follow sellers", "warning");
            }
        }
    };

    // --- VIDEO OBSERVER ---
    useEffect(() => {
        const options = { threshold: 0.6 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const index = parseInt(entry.target.dataset.index);
                const video = videoRefs.current[index];

                if (entry.isIntersecting) {
                    if (video) {
                        // Only play if ready to avoid errors
                        if (video.readyState >= 2) {
                            const playPromise = video.play();
                            if (playPromise !== undefined) {
                                playPromise.catch(error => {
                                    console.log("Autoplay prevented:", error);
                                });
                            }
                        }
                        setCurrentIndex(index);
                    }
                } else {
                    if (video) {
                        video.pause();
                        // Optional: Reset time logic if needed (disabled to keep state)
                        // video.currentTime = 0; 
                    }
                }
            });
        }, options);

        videoRefs.current.forEach(v => v && observer.observe(v));
        return () => videoRefs.current.forEach(v => v && observer.unobserve(v));
    }, [reels]);

    const toggleMute = (e) => {
        e?.stopPropagation();
        if (isMuted) {
            // Unmuting: Set volume 1 explicitly for cross-browser safety
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
                const social = socialData[reel.productId] || { liked: false, likeCount: 0, commentCount: 0, followed: false };

                // Safety check for video URL
                const isValidVideo = reel.videoUrl && reel.videoUrl.includes('/video/upload/'); // Basic Cloudinary check
                if (!isValidVideo && reel.videoUrl) console.warn("Potential invalid video URL:", reel.videoUrl);

                return (
                    <div key={reel.id} className="h-screen w-full snap-start relative flex items-center justify-center bg-gray-900">
                        {/* Video */}
                        <video
                            ref={el => videoRefs.current[index] = el}
                            data-index={index}
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

                            onClick={toggleMute}
                        />

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
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold border-2 border-white text-xs">
                                        {reel.sellerName ? reel.sellerName.charAt(0).toUpperCase() : 'S'}
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-bold text-sm shadow-sm">{reel.sellerName || 'Seller'}</span>
                                            {reel.sellerId && (
                                                <button
                                                    onClick={() => toggleFollow(reel)}
                                                    className={`text-[10px] px-2 py-0.5 rounded font-bold transition flex items-center gap-1 ${social.followed
                                                        ? "border border-white/40 text-white bg-transparent"
                                                        : "bg-white text-black hover:bg-white/90"
                                                        }`}
                                                >
                                                    {social.followed ? "Following" : "Follow"}
                                                </button>
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
