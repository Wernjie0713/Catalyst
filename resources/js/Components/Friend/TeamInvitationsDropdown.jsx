import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TeamInvitationCard from './TeamInvitationCard';

export default function TeamInvitationsDropdown({ 
    isOpen, 
    onClose, 
    pendingInvitations,
    onAccept,
    onReject,
    buttonRef,
    loadingStates = {}
}) {
    const dropdownRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, right: 0 });

    // Calculate position based on button position
    useEffect(() => {
        if (isOpen && buttonRef?.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: buttonRect.bottom + 8,
                right: window.innerWidth - buttonRect.right
            });
        }
    }, [isOpen, buttonRef]);

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

    const dropdownContent = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed w-96 bg-white rounded-xl shadow-xl border border-orange-200 z-[9999]"
                    style={{ 
                        top: position.top,
                        right: position.right,
                        zIndex: 9999 
                    }}
                >
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-800">Team Invitations</h3>
                            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
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
                                        isLoading={loadingStates[invitation.team_id]}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-6">
                                    <span className="material-symbols-outlined text-4xl text-orange-500 mb-2">
                                        groups
                                    </span>
                                    <p className="text-gray-700">No team invitations</p>
                                    <p className="text-gray-600 text-sm">
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

    return typeof document !== 'undefined' ? createPortal(dropdownContent, document.body) : null;
} 