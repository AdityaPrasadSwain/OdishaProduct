import React, { useState } from 'react';
import { Send } from 'lucide-react';
import CommentItem from './CommentItem';
import { motion } from 'motion/react';

const CommentsSection = ({ comments, onAddComment, onReply, loading }) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        onAddComment(newComment);
        setNewComment('');
    };

    return (
        <div className="bg-bg-surface dark:bg-bg-dark rounded-xl shadow-sm border border-border dark:border-border overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-border dark:border-border">
                <h3 className="font-bold text-lg text-text-primary dark:text-text-onDark">Comments ({comments.length})</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-10 text-text-secondary">
                        No comments yet. Be the first to start the conversation!
                    </div>
                ) : (
                    comments.map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onReply={onReply}
                        />
                    ))
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-bg-page dark:bg-bg-dark/50 border-t border-border dark:border-border">
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-xs">
                        ME
                    </div>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full bg-bg-surface dark:bg-bg-dark border border-border dark:border-border rounded-full pl-5 pr-12 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="absolute right-1 top-1 p-1.5 bg-primary text-text-onDark rounded-full hover:bg-primary disabled:opacity-50 disabled:bg-bg-band transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CommentsSection;
