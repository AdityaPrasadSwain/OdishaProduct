import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Reply, Heart, User, MoreHorizontal, CornerDownRight } from 'lucide-react';
import API from '../../api/api';

const CommentItem = ({ comment, onReply, depth = 0 }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [showReplies, setShowReplies] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        setIsSubmitting(true);
        try {
            await onReply(comment.id, replyText);
            setReplyText('');
            setIsReplying(false);
            setShowReplies(true); // Ensure replies are shown after adding one
        } catch (error) {
            console.error("Failed to reply", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 mb-4 ${depth > 0 ? 'ml-0' : ''}`}
        >
            {/* Avatar */}
            <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <User size={16} />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className={`bg-gray-50 dark:bg-gray-800 rounded-2xl px-4 py-3 ${comment.isSellerReply ? 'border border-orange-200 dark:border-orange-900/30' : ''}`}>
                    <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                {comment.user || 'Unknown User'}
                            </span>
                            {comment.isSellerReply && (
                                <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-medium">Seller</span>
                            )}
                            <span className="text-xs text-gray-400">
                                {formatDate(comment.createdAt)}
                            </span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {comment.content}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-gray-500 font-medium">
                    <button className="hover:text-gray-800 transition">Like</button>
                    <button
                        onClick={() => setIsReplying(!isReplying)}
                        className="hover:text-gray-800 transition flex items-center gap-1"
                    >
                        Reply
                    </button>
                    {comment.likesCount > 0 && <span>{comment.likesCount} likes</span>}
                </div>

                {/* Reply Input */}
                <AnimatePresence>
                    {isReplying && (
                        <motion.form
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={handleReplySubmit}
                            className="mt-3 flex gap-2"
                        >
                            <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={`Reply to ${comment.user}...`}
                                className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting || !replyText.trim()}
                                className="bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 disabled:opacity-50 transition-colors"
                            >
                                <CornerDownRight size={16} />
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 border-l-2 border-gray-100 dark:border-gray-800 pl-4">
                        {showReplies && comment.replies.map(reply => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                onReply={onReply}
                                depth={depth + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default CommentItem;
