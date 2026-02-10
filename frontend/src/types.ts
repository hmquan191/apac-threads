export type UserRole = 'user' | 'lt';

export interface User {
    username: string; // 'ltteam' or any string for normal user (though normal user has no login, we can assign a temp ID or just 'anonymous')
    // Actually, per plan: "Normal user (Question asker)". 
    // We might just track the role in localStorage.
    role: UserRole;
}

export interface Comment {
    id: string;
    threadId: string;
    content: string;
    author: string;
    role: UserRole; // To display (LT) tag
    createdAt: number;
    parentId?: string;
    isPinned?: boolean;
}

export interface Thread {
    id: string;
    title: string;
    content: string;
    author: string; // 'Anonymous' or similar for now
    role?: UserRole;
    createdAt: number;
    commentsCount: number;
}

export interface AppState {
    user: User | null;
}
