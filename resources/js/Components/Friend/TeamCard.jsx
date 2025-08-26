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
            <div className="relative p-6 bg-white rounded-2xl border border-orange-200 hover:border-orange-300 transition-all duration-300 shadow-lg hover:shadow-xl">
                {/* Background Pattern Effect */}
                <div className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                <div className="relative flex flex-col items-center space-y-4">
                    {/* Team Icon */}
                    <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-orange-600">
                                group
                            </span>
                        </div>
                    </div>

                    {/* Team Info */}
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                            {team.name}
                        </h3>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
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
                                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg shadow-md transition-all duration-200"
                            >
                                Accept
                            </button>
                            <button
                                onClick={onReject}
                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md transition-all duration-200"
                            >
                                Reject
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onClick}
                            className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg shadow-md transition-all duration-200"
                        >
                            View Details
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
} 
