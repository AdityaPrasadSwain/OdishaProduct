import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../../api/api';
import CommentsSection from './components/CommentsSection';
import { motion } from 'motion/react';
import {
    Heart, MessageCircle, Eye, ShoppingBag,
    TrendingUp, Calendar, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const SellerReelDetails = () => {
    const { reelId } = useParams();
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        // Fetch Initial Data
        const fetchData = async () => {
            // In a real app we'd likely get video URL from a generic product detail or passed state
            // For now we assume analytics/reels returns everything we need including video URL if possible
            // Or verify with the existing `getReelAnalytics` in loop.
            // Since we added `getSingleReelAnalytics`, does it return video URL?
            // Checking controller... No, it returns stats. 
            // We might need to fetch the Product details separately or update endpoint.
            // Let's assume we can fetch product details for video URL.
            try {
                const [analyticsRes, commentsRes, productRes] = await Promise.all([
                    API.get(`/reels/${reelId}/analytics`),
                    API.get(`/reels/${reelId}/comments`),
                    API.get(`/products/${reelId}`) // Assuming this exists or we use a fallback
                ]);

                setAnalytics(analyticsRes.data);
                setComments(commentsRes.data);
                // Fallback for video URL if not in analytics (which it isn't currently)
                setVideoUrl(productRes.data.reelUrl || productRes.data.videoUrl);
            } catch (error) {
                console.error("Error loading reel details", error);
            } finally {
                setLoading(false);
            }
        };

        if (reelId) fetchData();
    }, [reelId]);

    const handleAddComment = async (text) => {
        try {
            const res = await API.post(`/reels/${reelId}/comments`, { comment: text });
            // Add new comment to top
            setComments([res.data, ...comments]);
        } catch (error) {
            console.error("Failed to post comment", error);
        }
    };

    const handleReply = async (commentId, text) => {
        try {
            const res = await API.post(`/comments/${commentId}/reply`, { comment: text });
            // We need to update the nested structure.
            // Deep update helper
            const addReplyToComments = (list) => {
                return list.map(c => {
                    if (c.id === commentId) {
                        return { ...c, replies: [...(c.replies || []), res.data] };
                    } else if (c.replies) {
                        return { ...c, replies: addReplyToComments(c.replies) };
                    }
                    return c;
                });
            };
            setComments(addReplyToComments(comments));
        } catch (error) {
            console.error("Failed to reply", error);
        }
    };

    if (loading) return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>;

    return (
        <div className="min-h-screen bg-bg-page dark:bg-bg-dark p-4 lg:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6 flex items-center gap-4">
                    <button onClick={() => window.history.back()} className="p-2 hover:bg-bg-band dark:hover:bg-bg-dark rounded-full transition">
                        <ArrowLeft />
                    </button>
                    <h1 className="text-2xl font-bold text-text-primary dark:text-text-onDark">Reel Insights</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Video & Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Video Player Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-bg-dark rounded-2xl overflow-hidden shadow-lg aspect-[9/16] relative group"
                        >
                            <video
                                src={videoUrl}
                                className="w-full h-full object-cover"
                                controls
                                loop
                            />
                        </motion.div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <StatsCard
                                icon={<Eye size={20} className="text-primary" />}
                                label="Views"
                                value={analytics?.views}
                            />
                            <StatsCard
                                icon={<Heart size={20} className="text-status-error" />}
                                label="Likes"
                                value={analytics?.likes}
                            />
                            <StatsCard
                                icon={<MessageCircle size={20} className="text-status-success" />}
                                label="Comments"
                                value={analytics?.comments}
                            />
                            <StatsCard
                                icon={<ShoppingBag size={20} className="text-primary" />}
                                label="Sold"
                                value={analytics?.totalSold}
                                highlight
                            />
                        </div>
                    </div>

                    {/* Right Column: Comments System */}
                    <div className="lg:col-span-2">
                        <CommentsSection
                            comments={comments}
                            onAddComment={handleAddComment}
                            onReply={handleReply}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatsCard = ({ icon, label, value, highlight }) => (
    <motion.div
        whileHover={{ y: -2 }}
        className={`p-4 rounded-xl border ${highlight ? 'bg-bg-band border-primary dark:bg-primary-hover/20 dark:border-primary' : 'bg-bg-surface dark:bg-bg-dark border-border dark:border-border'} shadow-sm flex flex-col items-center justify-center text-center gap-2`}
    >
        <div className={`p-2 rounded-full ${highlight ? 'bg-primary-light' : 'bg-bg-band dark:bg-bg-dark'}`}>
            {icon}
        </div>
        <div>
            <div className="text-xl font-bold text-text-primary dark:text-text-onDark">{value || 0}</div>
            <div className="text-xs text-text-secondary uppercase tracking-wide font-medium">{label}</div>
        </div>
    </motion.div>
);

export default SellerReelDetails;
