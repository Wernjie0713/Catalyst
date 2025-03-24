import { motion } from 'framer-motion';

export default function FriendTabs({ activeTab, onTabChange }) {
    return (
        <nav className="flex space-x-4 mb-6 justify-center">
            {['all', 'pending', 'teams'].map((tab) => (
                <motion.button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === tab
                            ? 'bg-gradient-to-r from-blue-500/10 to-purple-600/10 text-white border border-white/10'
                            : 'text-gray-400 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </motion.button>
            ))}
        </nav>
    );
} 