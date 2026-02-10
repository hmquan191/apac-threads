import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Thread } from '../types';
import { storage } from '../utils/storage';
import { ArrowLeft, Clock, User } from 'lucide-react';
import CommentSection from './CommentSection';

const ThreadDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [thread, setThread] = useState<Thread | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<{ username: string; role: 'user' | 'lt' } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const found = storage.getThreadById(id);
            setThread(found);
        }
        setCurrentUser(storage.getUser());
        setLoading(false);
    }, [id]);

    const handleDeleteThread = () => {
        if (!thread) return;
        if (window.confirm('Are you sure you want to delete this thread? This action cannot be undone.')) {
            storage.deleteThread(thread.id);
            navigate('/');
        }
    };

    if (loading) return <div className="text-center py-20 text-white/50">Loading...</div>;

    if (!thread) {
        return (
            <div className="text-center py-20 text-white/50">
                <h2 className="text-xl font-bold mb-4">Question not found</h2>
                <Link to="/" className="text-hnk-green hover:underline">Return to Home</Link>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Feed
                </Link>

                {currentUser?.role === 'lt' && (
                    <button
                        onClick={handleDeleteThread}
                        className="text-red-500 hover:text-red-400 text-sm font-medium px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-colors"
                    >
                        Delete Thread
                    </button>
                )}
            </div>

            <article className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
                <div className="flex items-center gap-3 text-sm text-white/40 mb-4">
                    <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {thread.author}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(thread.createdAt).toLocaleDateString()}
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-white mb-6">
                    {thread.title}
                </h1>

                <div className="text-white/80 leading-relaxed whitespace-pre-wrap">
                    {thread.content}
                </div>
            </article>

            <CommentSection threadId={thread.id} />
        </div>
    );
};

export default ThreadDetail;
