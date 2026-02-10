import React, { useEffect, useState } from 'react';
import { Comment, UserRole } from '../types';
import { storage } from '../utils/storage';
import { Send, User as UserIcon, Shield, MessageCircle } from 'lucide-react';

interface CommentSectionProps {
    threadId: string;
}

// Recursive Comment Component
const CommentItem: React.FC<{
    comment: Comment;
    allComments: Comment[];
    onReply: (parentId: string, content: string) => void;
    onDelete: (commentId: string) => void;
    onPin: (commentId: string) => void;
    currentUserRole: UserRole | undefined;
}> = ({ comment, allComments, onReply, onDelete, onPin, currentUserRole }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const children = allComments.filter(c => c.parentId === comment.id).sort((a, b) => a.createdAt - b.createdAt);

    const handleSubmitReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;
        onReply(comment.id, replyContent);
        setReplyContent('');
        setIsReplying(false);
    };

    return (
        <div className={`mb-4 ${comment.isPinned ? 'bg-hnk-green/10 -mx-4 px-4 py-4 rounded-xl border border-hnk-green/20' : ''}`}>
            <div className="flex gap-4">
                <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${comment.role === 'lt' ? 'bg-hnk-green' : 'bg-white/10'}`}>
                    {comment.role === 'lt' ? <Shield className="w-4 h-4 text-white" /> : <UserIcon className="w-4 h-4 text-white/50" />}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`font-semibold ${comment.role === 'lt' ? 'text-hnk-green' : 'text-white/90'}`}>
                            {comment.author}
                        </span>
                        {comment.isPinned && (
                            <span className="text-xs font-bold bg-hnk-green text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                                Pinned
                            </span>
                        )}
                        <span className="text-xs text-white/30 ml-auto">
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="text-white/80 text-sm leading-relaxed mb-2">
                        {comment.content}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Reply Button */}
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="text-xs text-white/40 hover:text-white flex items-center gap-1 transition-colors"
                        >
                            <MessageCircle className="w-3 h-3" />
                            Reply
                        </button>

                        {/* LT Actions */}
                        {currentUserRole === 'lt' && (
                            <>
                                <button
                                    onClick={() => onPin(comment.id)}
                                    className={`text-xs flex items-center gap-1 transition-colors ${comment.isPinned ? 'text-hnk-green' : 'text-white/40 hover:text-white'}`}
                                >
                                    {comment.isPinned ? 'Unpin' : 'Pin'}
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm('Delete this comment?')) onDelete(comment.id);
                                    }}
                                    className="text-xs text-red-500/60 hover:text-red-500 flex items-center gap-1 transition-colors"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>

                    {/* Reply Form */}
                    {isReplying && (
                        <form onSubmit={handleSubmitReply} className="mt-3 flex gap-2">
                            <input
                                type="text"
                                value={replyContent}
                                onChange={e => setReplyContent(e.target.value)}
                                placeholder="Write a reply..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-hnk-green"
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={!replyContent.trim()}
                                className="bg-white text-black text-sm font-medium px-3 py-2 rounded-lg hover:bg-hnk-green disabled:opacity-50"
                            >
                                Reply
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Nested Comments */}
            {children.length > 0 && (
                <div className="ml-12 mt-4 pl-4 border-l border-white/10">
                    {children.map(child => (
                        <CommentItem
                            key={child.id}
                            comment={child}
                            allComments={allComments}
                            onReply={onReply}
                            onDelete={onDelete}
                            onPin={onPin}
                            currentUserRole={currentUserRole}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const CommentSection: React.FC<CommentSectionProps> = ({ threadId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [currentUser, setCurrentUser] = useState<{ username: string; role: UserRole } | null>(null);

    useEffect(() => {
        setComments(storage.getComments(threadId));
        setCurrentUser(storage.getUser());
    }, [threadId]);

    const handleAddComment = (content: string, parentId?: string) => {
        const role = currentUser?.role || 'user';
        const addedComment = storage.saveComment(threadId, content, role, parentId);
        setComments([...comments, addedComment]);
    };

    const handleDeleteComment = (commentId: string) => {
        storage.deleteComment(commentId);
        setComments(storage.getComments(threadId)); // Reload from storage to reflect tree changes
    };

    const handlePinComment = (commentId: string) => {
        storage.pinComment(threadId, commentId);
        setComments(storage.getComments(threadId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        handleAddComment(newComment);
        setNewComment('');
    };

    // Filter top-level comments and sorting
    // Pinned first, then by date
    const rootComments = comments
        .filter(c => !c.parentId)
        .sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return b.createdAt - a.createdAt;
        });

    return (
        <div className="mt-8 border-t border-white/10 pt-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                Discussion ({comments.length})
            </h3>

            {/* List */}
            <div className="space-y-6 mb-8">
                {comments.length === 0 ? (
                    <p className="text-white/40 italic">No comments yet.</p>
                ) : (
                    rootComments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            allComments={comments}
                            onReply={(parentId, content) => handleAddComment(content, parentId)}
                            onDelete={handleDeleteComment}
                            onPin={handlePinComment}
                            currentUserRole={currentUser?.role}
                        />
                    ))
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="relative">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={currentUser?.role === 'lt' ? "Reply as Leadership Team..." : "Add to the discussion..."}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-hnk-green/50 focus:bg-black transition-colors min-h-[100px] pr-12"
                />
                <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="absolute bottom-3 right-3 p-2 bg-white text-black rounded-lg hover:bg-hnk-green transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
};

export default CommentSection;
