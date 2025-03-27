import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TeamInvitationCard from './TeamInvitationCard';

export default function TeamInvitationsDropdown({ 
    isOpen, 
    onClose, 
    pendingInvitations,
    onAccept,
    onReject
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
                            <h3 className="text-lg font-medium text-white">Team Invitations</h3>
                            <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                                {pendingInvitations.length} pending
                            </span>
                        </div>
                        
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {pendingInvitations.length > 0 ? (
                                pendingInvitations.map((invitation) => (
                                    <TeamInvitationCard
                                        key={invitation.id}
                                        invitation={invitation}
                                        onAccept={() => onAccept(invitation.team_id)}
                                        onReject={() => onReject(invitation.team_id)}
                                        compact={true}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-6">
                                    <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">
                                        groups
                                    </span>
                                    <p className="text-gray-400">No team invitations</p>
                                    <p className="text-gray-500 text-sm">
                                        When someone invites you to a team, it will appear here
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