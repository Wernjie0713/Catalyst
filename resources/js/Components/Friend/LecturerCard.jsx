import React from 'react';
import { motion } from 'framer-motion';

export default function LecturerCard({ lecturer, onRequestMentor }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Request Pending';
            case 'accepted':
                return 'Your Mentor';
            case 'rejected':
                return 'Request Rejected';
            default:
                return 'Request Mentor';
        }
    };

    const canRequestMentor = !lecturer.request_status || lecturer.request_status === 'rejected';

    return (
        <motion.div 
            className="bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-gray-950/30 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 h-full flex flex-col"
            whileHover={{ y: -2 }}
            layout
        >
            <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                    {lecturer.profile_photo_path ? (
                        <img 
                            src={`/storage/${lecturer.profile_photo_path}`}
                            alt={lecturer.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-medium text-lg">
                                {lecturer.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">{lecturer.name}</h3>
                    <p className="text-gray-400 text-sm">{lecturer.email}</p>
                </div>
            </div>

            <div className="space-y-2 mb-4 flex-1">
                <div className="flex items-center text-sm min-h-[20px]">
                    <span className="material-symbols-outlined text-blue-400 mr-2 text-lg">
                        domain
                    </span>
                    <span className="text-gray-300 truncate">{lecturer.department}</span>
                </div>
                
                <div className="flex items-center text-sm min-h-[20px]">
                    <span className="material-symbols-outlined text-purple-400 mr-2 text-lg">
                        psychology
                    </span>
                    <span className="text-gray-300 truncate">{lecturer.specialization}</span>
                </div>
                
                <div className="flex items-center text-sm min-h-[20px]">
                    <span className="material-symbols-outlined text-amber-400 mr-2 text-lg">
                        school
                    </span>
                    <span className="text-gray-300 truncate">{lecturer.university}</span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                {lecturer.request_status && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lecturer.request_status)}`}>
                        {getStatusText(lecturer.request_status)}
                    </span>
                )}
                
                {canRequestMentor && (
                    <motion.button
                        onClick={() => onRequestMentor(lecturer)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 text-white rounded-lg text-sm border border-white/10 hover:border-white/20 transition-all duration-200 flex items-center space-x-2"
                    >
                        <span className="material-symbols-outlined text-sm">
                            person_add
                        </span>
                        <span>Request Mentor</span>
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
} 