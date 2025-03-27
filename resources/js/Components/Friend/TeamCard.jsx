import { useState } from 'react';
import { motion } from 'framer-motion';
import DisplayProfilePhoto from '@/Components/Profile/Common/DisplayProfilePhoto';
import axios from 'axios';

export default function TeamCard({ team, status, isInvited, onAccept, onReject, onClick }) {
    if (!team) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
        >
            <div className="relative p-6 bg-gradient-to-br from-gray-800/80 via-gray-900/90 to-gray-950/95 rounded-2xl backdrop-blur-md border border-white/5 hover:border-white/10 transition-all duration-300">
                {/* Background Pattern Effect */}
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] rounded-2xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                <div className="relative flex flex-col items-center space-y-4">
                    {/* Team Icon */}
                    <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="w-20 h-20 rounded-full bg-gray-700/50 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-gray-400">
                                group
                            </span>
                        </div>
                    </div>

                    {/* Team Info */}
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-white group-hover:text-purple-200 transition-colors duration-300">
                            {team.name}
                        </h3>
                        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                            Created by: {team.creator?.name}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                            Members: {team.member_count}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    {status === 'pending' && isInvited ? (
                        <div className="flex justify-center space-x-2">
                            <button
                                onClick={onAccept}
                                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-white rounded-lg"
                            >
                                Accept
                            </button>
                            <button
                                onClick={onReject}
                                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg"
                            >
                                Reject
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onClick}
                            className="w-full px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-white rounded-lg"
                        >
                            View Details
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
} 