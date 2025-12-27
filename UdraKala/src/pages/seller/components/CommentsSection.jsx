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
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Comments ({comments.length})</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin h-6 w-6 border-2 border-orange-500 rounded-full border-t-transparent"></div>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
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
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                        ME
                    </div>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full pl-5 pr-12 py-2.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm"
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="absolute right-1 top-1 p-1.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:bg-gray-300 transition-colors"
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
