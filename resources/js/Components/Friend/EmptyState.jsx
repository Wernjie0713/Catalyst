import { motion } from 'framer-motion';

export default function EmptyState({ activeTab }) {
    const messages = {
        all: "Start connecting with others!",
        pending: "You don't have any pending friend requests.",
        teams: "You haven't created or joined any teams yet."
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
        >
            <div className="bg-gradient-to-br from-gray-800/80 via-gray-900/90 to-gray-950/95 p-8 rounded-2xl backdrop-blur-md border border-white/5 max-w-md mx-auto">
                <span className="material-symbols-outlined text-4xl text-purple-400 mb-3">
                    {activeTab === 'pending' ? 'person_add' : activeTab === 'teams' ? 'group' : 'people'}
                </span>
                <h3 className="text-xl font-medium text-white mb-2">
                    No {activeTab === 'all' ? 'Friends' : activeTab === 'pending' ? 'Pending Requests' : 'Teams'} Yet
                </h3>
                <p className="text-gray-400 mb-4">
                    {messages[activeTab]}
                </p>
                {activeTab === 'all' && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 text-white rounded-lg text-sm border border-white/10 hover:border-white/20 transition-all duration-200"
                    >
                        <span className="material-symbols-outlined text-sm mr-1">person_add</span>
                        Find People
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
} 