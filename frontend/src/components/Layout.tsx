import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { storage } from '../utils/storage';
import { UserRole } from '../types';
import { LogOut, User as UserIcon } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<{ username: string; role: UserRole } | null>(null);

    useEffect(() => {
        setUser(storage.getUser());
    }, [location.pathname]); // Re-check user on route change

    const handleLogout = () => {
        storage.logout();
        setUser(null);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-hnk-green selection:text-white">
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <span className="font-bold text-xl tracking-tight">APAC Threads</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                    <UserIcon className="w-4 h-4" />
                                    <span>{user.username}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-white/40 hover:text-white transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="pt-20 pb-10 px-4 max-w-3xl mx-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;
