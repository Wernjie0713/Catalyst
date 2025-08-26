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
                    className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-orange-200 z-[9999]"
                    style={{ zIndex: 9999 }}
                >
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-800">Incoming Friend Requests</h3>
                            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
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
                                    <span className="material-symbols-outlined text-4xl text-orange-500 mb-2">
                                        person_off
                                    </span>
                                    <p className="text-gray-700">No friend requests yet</p>
                                    <p className="text-gray-600 text-sm">
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