import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FriendCard from './FriendCard';
import EmptyState from './EmptyState';

export default function FriendRequestsDropdown({ 
    isOpen, 
    onClose, 
    friendRequests, 
    onAccept, 
    onReject,
    getOtherUser,
    getProfilePhotoPath,
    isRequestReceiver,
    auth 
}) {
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute right-0 mt-2 w-96 bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-gray-950/95 rounded-xl shadow-lg border border-white/10 backdrop-blur-xl z-50"
                >
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-white">Incoming Friend Requests</h3>
                            <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                                {friendRequests.length} pending
                            </span>
                        </div>
                        
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {friendRequests.length > 0 ? (
                                friendRequests.map((friend) => (
                                    <FriendCard
                                        key={`friend-${friend.id}`}
                                        friend={friend}
                                        otherUser={getOtherUser(friend)}
                                        photoPath={getProfilePhotoPath(getOtherUser(friend))}
                                        isRequestReceiver={isRequestReceiver(friend)}
                                        onAccept={onAccept}
                                        onReject={onReject}
                                        compact={true}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-6">
                                    <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">
                                        person_off
                                    </span>
                                    <p className="text-gray-400">No friend requests yet</p>
                                    <p className="text-gray-500 text-sm">
                                        When someone adds you, their request will appear here
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
} 