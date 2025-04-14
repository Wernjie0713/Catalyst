import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import DisplayProfilePhoto from '@/Components/Profile/Common/DisplayProfilePhoto';

const FriendSuggestionCard = ({ user, index }) => {
    return (
        <motion.div
            style={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: 0.2 + index * 0.1,
            }}
        >
            <Link
                href={route('profile.view', user.id)}
                className="group relative overflow-hidden block h-[200px]"
            >
                <div className="friend-card relative h-full p-6 bg-gradient-to-br from-gray-800/90 via-gray-900/95 to-gray-950/98 rounded-2xl backdrop-blur-md border border-white/5 hover:border-white/10 transition-all duration-300 shadow-xl hover:shadow-purple-500/10">
                    {/* Background Pattern Effect */}
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Content */}
                    <div className="relative flex items-center space-x-6 h-full">
                        {/* Profile Photo */}
                        <div className="relative flex-shrink-0">
                            <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative w-32 h-32 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-white/20 transition-all duration-300">
                                <DisplayProfilePhoto profilePhotoPath={user.profile_picture} />
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                            <h3 className="text-2xl font-medium text-white group-hover:text-purple-200 transition-colors duration-300 mb-3">
                                {user.name}
                            </h3>
                            <div className="flex items-center text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                <span className="material-symbols-outlined text-base mr-2 text-purple-400/70 group-hover:text-purple-400">
                                    person
                                </span>
                                <span className="group-hover:bg-gradient-to-r group-hover:from-purple-200 group-hover:to-blue-200 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                                    View Profile
                                </span>
                                <span className="material-symbols-outlined text-purple-400 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                                    arrow_forward
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default FriendSuggestionCard; 