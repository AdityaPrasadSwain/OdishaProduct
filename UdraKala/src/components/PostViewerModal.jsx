import React, { useState, useEffect } from 'react';
import { X, Heart, MessageCircle, Send, Share2, MoreHorizontal, User, Image } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import defaultUser from '../assets/default-user.jpg';

const PostViewerModal = ({ isOpen, onClose, post, isReel = false }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [likesCount, setLikesCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);

    // Reset state when post changes
    useEffect(() => {
        if (isOpen && post) {
            fetchComments();
            fetchLikeStatus();
        }
    }, [isOpen, post]);

    const fetchComments = async () => {
        setLoadingComments(true);
        try {
            // Identify endpoint based on type (currently simplified to reels Logic as base)
            // Ideally backend should have unified endpoint or we switch based on type
            // For this Implementation, we assumed Product ID is universal.
            const endpoint = isReel
                ? `/api/reels/${post.id}/comments`
                : `/api/reels/${post.id}/comments`; // Fallback/Universal for now

            const response = await axios.get(`http://localhost:8086${endpoint}`, {
                withCredentials: true
            });
            setComments(response.data);
        } catch (error) {
            console.error("Error fetching comments", error);
        } finally {
            setLoadingComments(false);
        }
    };

    const fetchLikeStatus = async () => {
        try {
            // Reusing Reel endpoints as they are attached to Products
            const response = await axios.get(`http://localhost:8086/api/reels/${post.id}/likes/count`, {
                withCredentials: true
            });
            setLikesCount(response.data.count);
            setIsLiked(response.data.isLiked);
        } catch (error) {
            console.error("Error fetching likes", error);
            // Fallback if endpoint fails
            setLikesCount(post.likes || 0);
        }
    };

    const handleLike = async () => {
        if (!user) return alert("Please login to like");
        try {
            if (isLiked) {
                await axios.delete(`http://localhost:8086/api/reels/${post.id}/like`, { withCredentials: true });
                setLikesCount(prev => prev - 1);
            } else {
                await axios.post(`http://localhost:8086/api/reels/${post.id}/like`, {}, { withCredentials: true });
                setLikesCount(prev => prev + 1);
            }
            setIsLiked(!isLiked);
        } catch (error) {
            console.error("Like failed", error);
        }
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        try {
            const response = await axios.post(`http://localhost:8086/api/reels/${post.id}/comments`,
                { comment: newComment },
                { withCredentials: true }
            );
            setComments([response.data, ...comments]); // Prepend new comment
            setNewComment('');
        } catch (error) {
            console.error("Comment failed", error);
        }
    };

    if (!isOpen || !post) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-bg-dark/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-text-onDark hover:text-text-secondary z-50 p-2"
            >
                <X size={32} />
            </button>

            <div className="bg-bg-surface dark:bg-bg-dark w-full max-w-6xl h-[85vh] rounded-xl overflow-hidden flex flex-col md:flex-row shadow-2xl">

                {/* Media Section (Left) */}
                <div className="w-full md:w-[60%] bg-bg-dark flex items-center justify-center relative group">
                    {isReel || post.videoUrl ? (
                        <video
                            src={post.videoUrl}
                            className="w-full h-full object-contain"
                            controls
                            autoPlay
                            loop
                        />
                    ) : (
                        post.thumbnail ? (
                            <img
                                src={post.thumbnail}
                                alt={post.name}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Image size={64} className="text-text-secondary" />
                            </div>
                        )
                    )}
                </div>

                {/* Interaction Section (Right) */}
                <div className="w-full md:w-[40%] flex flex-col h-full bg-bg-surface dark:bg-bg-dark border-l dark:border-border relative">

                    {/* Header */}
                    <div className="p-4 border-b dark:border-border flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[2px]">
                                {post.sellerImage ? (
                                    <img
                                        className="w-full h-full rounded-full border-2 border-white dark:border-border object-cover"
                                        src={post.sellerImage}
                                        alt="Seller"
                                    />
                                ) : (
                                    <img
                                        className="w-full h-full rounded-full border-2 border-white dark:border-border object-cover"
                                        src={defaultUser}
                                        alt="Seller"
                                    />
                                )}
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-text-primary dark:text-text-onDark hover:underline cursor-pointer">
                                    {post.sellerName || "Seller Name"}
                                </h3>
                                <p className="text-xs text-text-secondary dark:text-text-secondary">
                                    {post.location || "Odisha, India"}
                                </p>
                            </div>
                        </div>
                        <MoreHorizontal className="text-text-secondary cursor-pointer hover:text-text-primary dark:hover:text-text-onDark" />
                    </div>

                    {/* Comments List (Scrollable) */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {/* Caption as first comment */}
                        <div className="flex gap-3">
                            {post.sellerImage ? (
                                <img
                                    src={post.sellerImage}
                                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
                                    alt="Seller"
                                />
                            ) : (
                                <img
                                    src={defaultUser}
                                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
                                    alt="Seller"
                                />
                            )}
                            <div className="text-sm">
                                <span className="font-semibold text-text-primary dark:text-text-onDark mr-2">
                                    {post.sellerName}
                                </span>
                                <span className="text-text-primary dark:text-text-secondary">
                                    {post.name || post.caption || "No caption provided."}
                                </span>
                                <div className="mt-1 text-xs text-text-secondary">2h</div>
                            </div>
                        </div>

                        {loadingComments ? (
                            <div className="flex justify-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-border dark:border-white"></div>
                            </div>
                        ) : comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3 group">
                                    <div className="w-8 h-8 rounded-full bg-bg-band shrink-0 flex items-center justify-center text-xs font-bold">
                                        {comment.user.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm">
                                            <span className="font-semibold text-text-primary dark:text-text-onDark mr-2">
                                                {comment.user}
                                            </span>
                                            <span className="text-text-primary dark:text-text-secondary">
                                                {comment.content}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 text-xs text-text-secondary">
                                            <span>{comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'Just now'}</span>
                                            {comment.likesCount > 0 && <span>{comment.likesCount} likes</span>}
                                            <button className="font-semibold hover:text-text-primary dark:hover:text-text-onDark">Reply</button>
                                        </div>
                                    </div>
                                    <Heart size={12} className="text-text-secondary hover:text-status-error cursor-pointer mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-text-secondary text-sm py-10">No comments yet.</div>
                        )}
                    </div>

                    {/* Action Bar (Fixed at bottom) */}
                    <div className="border-t dark:border-border bg-bg-surface dark:bg-bg-dark shrink-0">
                        <div className="p-3 grid grid-flow-col justify-start gap-4">
                            <button onClick={handleLike} className="hover:scale-110 transition-transform">
                                <Heart
                                    size={26}
                                    className={`${isLiked ? 'fill-red-500 text-status-error' : 'text-text-primary dark:text-text-onDark hover:text-text-secondary'}`}
                                />
                            </button>
                            <button onClick={() => document.getElementById('comment-input').focus()} className="hover:scale-110 transition-transform">
                                <MessageCircle size={26} className="text-text-primary dark:text-text-onDark hover:text-text-secondary" />
                            </button>
                            <button className="hover:scale-110 transition-transform">
                                <Share2 size={26} className="text-text-primary dark:text-text-onDark hover:text-text-secondary" />
                            </button>
                        </div>
                        <div className="px-3 pb-2 text-sm font-semibold text-text-primary dark:text-text-onDark">
                            {likesCount} likes
                        </div>
                        <div className="px-3 pb-3 border-t dark:border-border pt-3">
                            <form onSubmit={handlePostComment} className="flex items-center gap-2">
                                <input
                                    id="comment-input"
                                    type="text"
                                    placeholder="Add a comment..."
                                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-text-primary dark:text-text-onDark placeholder-gray-500"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                {newComment.trim() && (
                                    <button
                                        type="submit"
                                        className="text-primary font-semibold text-sm hover:text-primary"
                                    >
                                        Post
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PostViewerModal;
