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

    saveThread: (title: string, content: string, role: UserRole = 'user'): Thread => {
        const threads = storage.getThreads();
        const newThread: Thread = {
            id: generateId(),
            title,
            content,
            author: role === 'lt' ? 'Leadership Team' : 'Anonymous User',
            role,
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
            parentId,
            isPinned: false
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
    },

    deleteThread: (id: string) => {
        // Delete thread
        const threads = storage.getThreads();
        const newThreads = threads.filter(t => t.id !== id);
        localStorage.setItem(THREADS_KEY, JSON.stringify(newThreads));

        // Delete associated comments
        const data = localStorage.getItem(COMMENTS_KEY);
        if (data) {
            const allComments: Comment[] = JSON.parse(data);
            const newComments = allComments.filter(c => c.threadId !== id);
            localStorage.setItem(COMMENTS_KEY, JSON.stringify(newComments));
        }
    },

    deleteComment: (id: string) => {
        const data = localStorage.getItem(COMMENTS_KEY);
        if (!data) return;

        const allComments: Comment[] = JSON.parse(data);
        const commentToDelete = allComments.find(c => c.id === id);

        if (!commentToDelete) return;

        // Recursive delete for children
        const getIdsToDelete = (parentId: string): string[] => {
            const children = allComments.filter(c => c.parentId === parentId);
            let ids = [parentId];
            children.forEach(child => {
                ids = [...ids, ...getIdsToDelete(child.id)];
            });
            return ids;
        };

        const idsToDelete = getIdsToDelete(id);
        const newComments = allComments.filter(c => !idsToDelete.includes(c.id));

        localStorage.setItem(COMMENTS_KEY, JSON.stringify(newComments));

        // Update thread comment count
        const threads = storage.getThreads();
        const threadIndex = threads.findIndex(t => t.id === commentToDelete.threadId);
        if (threadIndex > -1) {
            threads[threadIndex].commentsCount = Math.max(0, threads[threadIndex].commentsCount - idsToDelete.length);
            localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
        }
    },

    pinComment: (threadId: string, commentId: string) => {
        const data = localStorage.getItem(COMMENTS_KEY);
        if (!data) return;

        let allComments: Comment[] = JSON.parse(data);
        const commentIndex = allComments.findIndex(c => c.id === commentId);

        if (commentIndex > -1) {
            // Unpin others in the same thread? Usually only one pinned, or multiple? 
            // Let's assume multiple allowed for now, or just toggle.
            // But typically pinning brings to top. 
            // Let's just toggle for now. 

            // Actually, if we want "Pin a comment", usually it implies one or few. 
            // Let's just toggle isPinned.
            allComments[commentIndex].isPinned = !allComments[commentIndex].isPinned;
            localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
        }
    }
};
