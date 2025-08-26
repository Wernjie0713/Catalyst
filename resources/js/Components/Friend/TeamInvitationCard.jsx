import React from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function TeamInvitationCard({ invitation, onAccept, onReject, compact = false, isLoading }) {

    return (
        <div className="bg-white rounded-xl p-6 border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="flex flex-col items-center">
                {/* Team Icon */}
                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl text-orange-600">
                        group
                    </span>
                </div>

                {/* Team Name */}
                <h3 className="text-xl font-medium text-gray-800 mb-1">
                    {invitation.team.name}
                </h3>

                {/* Creator Info */}
                <p className="text-gray-600 text-sm mb-4">
                    Created by: {invitation.team.creator.name}
                </p>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    <motion.button
                        whileHover={!isLoading ? { scale: 1.02 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                        onClick={() => !isLoading && onAccept && onAccept()}
                        disabled={isLoading}
                        className={`px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 shadow-md ${
                            isLoading === 'accepting' ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
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
                        whileHover={!isLoading ? { scale: 1.02 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                        onClick={() => !isLoading && onReject && onReject()}
                        disabled={isLoading}
                        className={`px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 shadow-md ${
                            isLoading === 'rejecting' ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
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
            </div>
        </div>
    );
} 