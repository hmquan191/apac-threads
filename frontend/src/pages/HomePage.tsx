import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import ThreadList from '../components/ThreadList';
import CreateThread from '../components/CreateThread';
import { storage } from '../utils/storage';
import { Thread } from '../types';

const HomePage: React.FC = () => {
    const [threads, setThreads] = useState<Thread[]>([]);

    const loadThreads = useCallback(() => {
        setThreads(storage.getThreads());
    }, []);

    useEffect(() => {
        loadThreads();
    }, [loadThreads]);

    return (
        <Layout>
            <div className="space-y-8">
                <section>
                    <CreateThread onThreadCreated={loadThreads} />
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-4 text-white/90">Recent Questions</h2>
                    <ThreadList threads={threads} />
                </section>
            </div>
        </Layout>
    );
};

export default HomePage;
