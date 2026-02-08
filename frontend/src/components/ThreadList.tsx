import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Clock } from 'lucide-react';
import { Thread } from '../types';

interface ThreadListProps {
    threads: Thread[];
}

const ITEMS_PER_PAGE = 5;

const ThreadList: React.FC<ThreadListProps> = ({ threads }) => {
    const [currentPage, setCurrentPage] = React.useState(1);

    // Calculate pagination
    const totalPages = Math.ceil(threads.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentThreads = threads.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (threads.length === 0) {
        return (
            <div className="text-center py-20 text-white/50">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg">No questions yet. Be the first to ask!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {currentThreads.map((thread) => (
                    <Link
                        key={thread.id}
                        to={`/thread/${thread.id}`}
                        className="block p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                    >
                        <div className="flex items-start justify-between">
                            <h3 className="text-lg font-semibold text-white group-hover:text-hnk-green transition-colors line-clamp-2 mb-2">
                                {thread.title}
                            </h3>
                            <span className="text-xs text-white/40 whitespace-nowrap ml-4 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(thread.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        <p className="text-white/60 text-sm line-clamp-3 mb-4">
                            {thread.content}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-white/40">
                            <div className="flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>{thread.commentsCount} answers</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-white/20"></div>
                            <span>Posted by {thread.author}</span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-4 border-t border-white/10">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-white/70 bg-white/5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>

                    <span className="text-sm text-white/50">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm font-medium text-white/70 bg-white/5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ThreadList;
