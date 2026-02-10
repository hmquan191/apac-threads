import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { Send } from 'lucide-react';

interface CreateThreadProps {
    onThreadCreated?: () => void;
}

const CreateThread: React.FC<CreateThreadProps> = ({ onThreadCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        const user = storage.getUser();
        const role = user?.role || 'user';

        storage.saveThread(title, content, role);
        setTitle('');
        setContent('');

        if (onThreadCreated) {
            onThreadCreated();
        } else {
            navigate('/');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-white/70 mb-1">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What's your question?"
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-hnk-green focus:ring-1 focus:ring-hnk-green transition-colors"
                    required
                    autoFocus
                />
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium text-white/70 mb-1">
                    Details
                </label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Provide more context..."
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-hnk-green focus:ring-1 focus:ring-hnk-green transition-colors min-h-[150px]"
                    required
                />
            </div>

            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    className="flex items-center gap-2 bg-white text-black font-semibold px-6 py-2.5 rounded-full hover:bg-hnk-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!title.trim() || !content.trim()}
                >
                    <span>Post Question</span>
                </button>
            </div>
        </form>
    );
};

export default CreateThread;
