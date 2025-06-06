import { useState } from 'react';
import { motion } from 'framer-motion';
import { router } from '@inertiajs/react';
import DisplayProfilePhoto from '@/Components/Profile/Common/DisplayProfilePhoto';

export default function FriendCard({ friend, otherUser, photoPath, isRequestReceiver, onAccept, onReject, compact = false, isLoading }) {
    const handleProfileClick = () => {
        router.visit(route('profile.view', { user: otherUser.id }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleProfileClick}
            className={`relative group ${compact ? 'p-3' : 'p-6'} bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-gray-950/50 rounded-xl backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer`}
        >
            <div className={`absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] rounded-2xl ${compact ? '' : ''}`} />
            <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl ${compact ? '' : ''}`} />

            <div className={`relative flex flex-col items-center space-y-4 ${compact ? 'gap-3' : 'gap-4'}`}>
                {/* Profile Photo */}
                <div className="relative">
                    <div className={`absolute -inset-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${compact ? '' : ''}`} />
                    <div className={`relative w-24 h-24 rounded-full overflow-hidden ${compact ? '' : ''}`}>
                        <DisplayProfilePhoto 
                            profilePhotoPath={photoPath} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* User Info - Name and Email */}
                <div className="text-center">
                    <h3 className={`text-lg font-medium text-white group-hover:text-purple-200 transition-colors duration-300 truncate max-w-[200px] ${compact ? 'text-sm' : ''}`}>
                        {otherUser?.name}
                    </h3>
                    <p className={`text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 ${compact ? '' : ''}`}>
                        {otherUser?.email}
                    </p>
                </div>

                {/* Action Buttons - Only show Accept/Reject for pending requests */}
                {friend.status === 'pending' && isRequestReceiver && (
                    <div className="flex justify-center space-x-2" onClick={e => e.stopPropagation()}>
                        <motion.button
                            whileHover={!isLoading ? { scale: 1.05 } : {}}
                            whileTap={!isLoading ? { scale: 0.95 } : {}}
                            onClick={() => !isLoading && onAccept(friend.id)}
                            disabled={isLoading}
                            className={`px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 text-white rounded-xl text-sm border border-white/10 hover:border-white/20 transition-all duration-200 flex items-center space-x-2 ${
                                isLoading === 'accepting' ? 'opacity-75 cursor-not-allowed' : ''
                            } ${compact ? '' : ''}`}
                        >
                            {isLoading === 'accepting' && (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            <span>Accept</span>
                        </motion.button>
                        <motion.button
                            whileHover={!isLoading ? { scale: 1.05 } : {}}
                            whileTap={!isLoading ? { scale: 0.95 } : {}}
                            onClick={() => !isLoading && onReject(friend.id)}
                            disabled={isLoading}
                            className={`px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-600/20 hover:from-red-500/30 hover:to-pink-600/30 text-white rounded-xl text-sm border border-white/10 hover:border-white/20 transition-all duration-200 flex items-center space-x-2 ${
                                isLoading === 'rejecting' ? 'opacity-75 cursor-not-allowed' : ''
                            } ${compact ? '' : ''}`}
                        >
                            {isLoading === 'rejecting' && (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            <span>Reject</span>
                        </motion.button>
                    </div>
                )}
            </div>
        </motion.div>
    );
} 