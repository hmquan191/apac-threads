import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { ArrowLeft } from 'lucide-react';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (username === 'ltteam' && password === 'apachub') {
            storage.login('lt');
            navigate('/');
        } else if (username === 'user' && password === 'user') {
            storage.login('user');
            navigate('/');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 text-white/50 hover:text-white flex items-center gap-2 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Feed
            </button>

            <div className="mb-8 text-center">
                <img src="/HNK_dark.png" alt="HNK Logo" className="h-24 w-auto mx-auto mb-6" />
            </div>

            <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm text-white/60 mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-hnk-green"
                            placeholder="Enter username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-white/60 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-hnk-green"
                            placeholder="Enter password"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-hnk-green transition-colors mt-2"
                    >
                        Log In
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-white/30">
                    <p>Demo Credentials:</p>
                    <p>User: user / user</p>
                    <p>LT: ltteam / apachub</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
