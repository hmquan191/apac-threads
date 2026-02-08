import { Thread, Comment, User, UserRole } from '../types';

const THREADS_KEY = 'apac_threads_data';
const COMMENTS_KEY = 'apac_comments_data';
const USER_KEY = 'apac_user_role';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export const storage = {
    // User Session
    getUser: (): User | null => {
        const role = localStorage.getItem(USER_KEY) as UserRole | null;
        if (!role) return null;
        return {
            username: role === 'lt' ? 'Leadership Team' : 'User',
            role: role
        };
    },

    login: (role: UserRole) => {
        localStorage.setItem(USER_KEY, role);
        // If LT, we might want to store the specific username if needed, 
        // but for this prototype, just the role is enough to determine identity.
    },

    logout: () => {
        localStorage.removeItem(USER_KEY);
    },

    // Threads
    getThreads: (): Thread[] => {
        const data = localStorage.getItem(THREADS_KEY);
        return data ? JSON.parse(data) : [];
    },

    saveThread: (title: string, content: string): Thread => {
        const threads = storage.getThreads();
        const newThread: Thread = {
            id: generateId(),
            title,
            content,
            author: 'Anonymous User', // Normal users are anonymous
            createdAt: Date.now(),
            commentsCount: 0,
        };
        localStorage.setItem(THREADS_KEY, JSON.stringify([newThread, ...threads]));
        return newThread;
    },

    getThreadById: (id: string): Thread | undefined => {
        const threads = storage.getThreads();
        return threads.find(t => t.id === id);
    },

    // Comments
    getComments: (threadId: string): Comment[] => {
        const data = localStorage.getItem(COMMENTS_KEY);
        const allComments: Comment[] = data ? JSON.parse(data) : [];
        return allComments.filter(c => c.threadId === threadId).sort((a, b) => a.createdAt - b.createdAt);
    },

    saveComment: (threadId: string, content: string, role: UserRole, parentId?: string): Comment => {
        const data = localStorage.getItem(COMMENTS_KEY);
        const allComments: Comment[] = data ? JSON.parse(data) : [];

        const newComment: Comment = {
            id: generateId(),
            threadId,
            content,
            author: role === 'lt' ? 'Leadership Team' : 'Anonymous',
            role,
            createdAt: Date.now(),
            parentId
        };

        localStorage.setItem(COMMENTS_KEY, JSON.stringify([...allComments, newComment]));

        // Update thread comment count
        const threads = storage.getThreads();
        const threadIndex = threads.findIndex(t => t.id === threadId);
        if (threadIndex > -1) {
            threads[threadIndex].commentsCount += 1;
            localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
        }

        return newComment;
    }
};
