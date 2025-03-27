import React from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function TeamInvitationCard({ invitation }) {
    const handleAccept = async () => {
        try {
            await axios.post(route('teams.accept-invitation', invitation.team.id));
            window.location.reload();
        } catch (error) {
            console.error('Error accepting invitation:', error);
        }
    };

    const handleReject = async () => {
        try {
            await axios.post(route('teams.reject-invitation', invitation.team.id));
            window.location.reload();
        } catch (error) {
            console.error('Error rejecting invitation:', error);
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-gray-950/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
            <div className="flex flex-col items-center">
                {/* Team Icon */}
                <div className="w-20 h-20 rounded-full bg-gray-700/50 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl text-gray-400">
                        group
                    </span>
                </div>

                {/* Team Name */}
                <h3 className="text-xl font-medium text-white mb-1">
                    {invitation.team.name}
                </h3>

                {/* Creator Info */}
                <p className="text-gray-400 text-sm mb-4">
                    Created by: {invitation.team.creator.name}
                </p>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAccept}
                        className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors duration-200"
                    >
                        Accept
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleReject}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-200"
                    >
                        Reject
                    </motion.button>
                </div>
            </div>
        </div>
    );
} 