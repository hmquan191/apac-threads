import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import ThreadList from '../components/ThreadList';
import CreateThread from '../components/CreateThread';
import Modal from '../components/Modal';
import { storage } from '../utils/storage';
import { Thread } from '../types';

const HomePage: React.FC = () => {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const loadThreads = useCallback(() => {
        setThreads(storage.getThreads());
    }, []);

    useEffect(() => {
        loadThreads();
    }, [loadThreads]);

    const handleThreadCreated = () => {
        loadThreads();
        setIsCreateModalOpen(false);
    };

    return (
        <Layout>
            <div className="space-y-8">
                <section className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white/90">Recent Questions</h2>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-white text-black font-semibold px-6 py-2.5 rounded-full hover:bg-hnk-green transition-colors"
                    >
                        Ask a Question
                    </button>
                </section>

                <section>
                    <ThreadList threads={threads} />
                </section>

                <Modal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    title="Ask a Question"
                >
                    <CreateThread onThreadCreated={handleThreadCreated} />
                </Modal>
            </div>
        </Layout>
    );
};

export default HomePage;
