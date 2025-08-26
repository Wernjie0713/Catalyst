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
            className={`relative group ${compact ? 'p-3' : 'p-6'} bg-white rounded-xl border border-orange-200 hover:border-orange-300 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl`}
        >
            <div className={`absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl ${compact ? '' : ''}`} />

            <div className={`relative flex flex-col items-center space-y-4 ${compact ? 'gap-3' : 'gap-4'}`}>
                {/* Profile Photo */}
                <div className="relative">
                    <div className={`absolute -inset-2 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${compact ? '' : ''}`} />
                    <div className={`relative w-24 h-24 rounded-full overflow-hidden ${compact ? '' : ''}`}>
                        <DisplayProfilePhoto 
                            profilePhotoPath={photoPath} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* User Info - Name and Email */}
                <div className="text-center">
                    <h3 className={`text-lg font-medium text-gray-800 group-hover:text-orange-600 transition-colors duration-300 truncate max-w-[200px] ${compact ? 'text-sm' : ''}`}>
                        {otherUser?.name}
                    </h3>
                    <p className={`text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 ${compact ? '' : ''}`}>
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
                            className={`px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-sm border border-orange-500 transition-all duration-200 flex items-center space-x-2 shadow-lg ${
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
                            className={`px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl text-sm border border-red-500 transition-all duration-200 flex items-center space-x-2 shadow-lg ${
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