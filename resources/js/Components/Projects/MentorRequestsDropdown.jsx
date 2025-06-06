import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MentorRequestsDropdown({ isOpen, onClose, requests, onAccept, onReject, auth, loadingStates = {} }) {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const dropdownVariants = {
        hidden: { opacity: 0, scale: 0.95, y: -10 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.95, 
            y: -10,
            transition: { duration: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (index) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: index * 0.05,
                duration: 0.3
            }
        })
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={dropdownRef}
                    className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <span className="material-symbols-outlined text-green-600 mr-2">
                                group_add
                            </span>
                            Mentor Requests
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Students requesting you as their mentor
                        </p>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {requests.length === 0 ? (
                            <div className="p-6 text-center">
                                <span className="material-symbols-outlined text-4xl text-gray-400 mb-2 block">
                                    sentiment_satisfied
                                </span>
                                <p className="text-gray-500">No pending mentor requests</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {requests.map((request, index) => (
                                    <motion.div
                                        key={request.id}
                                        custom={index}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                {request.student?.student?.profile_photo_path ? (
                                                    <img 
                                                        src={`/storage/${request.student.student.profile_photo_path}`}
                                                        alt={request.student.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-medium text-sm">
                                                            {request.student?.name?.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                                        {request.student?.name}
                                                    </h4>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(request.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {request.student?.email}
                                                </p>
                                                
                                                {request.student?.student && (
                                                    <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                                                        <span>ID: {request.student.student.student_id}</span>
                                                        <span>Year {request.student.student.year}</span>
                                                        <span>{request.student.student.department}</span>
                                                    </div>
                                                )}

                                                {request.message && (
                                                    <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                                                        <p className="text-sm text-gray-700 italic">
                                                            "{request.message}"
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="flex space-x-2 mt-3">
                                                    <motion.button
                                                        onClick={() => !loadingStates[request.id] && onAccept(request.id)}
                                                        whileHover={!loadingStates[request.id] ? { scale: 1.05 } : {}}
                                                        whileTap={!loadingStates[request.id] ? { scale: 0.95 } : {}}
                                                        disabled={loadingStates[request.id]}
                                                        className={`px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors ${
                                                            loadingStates[request.id] === 'accepting' ? 'opacity-75 cursor-not-allowed' : ''
                                                        }`}
                                                    >
                                                        {loadingStates[request.id] === 'accepting' ? (
                                                            <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        ) : (
                                                            <span className="material-symbols-outlined text-sm">
                                                                check
                                                            </span>
                                                        )}
                                                        <span>Accept</span>
                                                    </motion.button>
                                                    
                                                    <motion.button
                                                        onClick={() => !loadingStates[request.id] && onReject(request.id)}
                                                        whileHover={!loadingStates[request.id] ? { scale: 1.05 } : {}}
                                                        whileTap={!loadingStates[request.id] ? { scale: 0.95 } : {}}
                                                        disabled={loadingStates[request.id]}
                                                        className={`px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors ${
                                                            loadingStates[request.id] === 'rejecting' ? 'opacity-75 cursor-not-allowed' : ''
                                                        }`}
                                                    >
                                                        {loadingStates[request.id] === 'rejecting' ? (
                                                            <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        ) : (
                                                            <span className="material-symbols-outlined text-sm">
                                                                close
                                                            </span>
                                                        )}
                                                        <span>Reject</span>
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {requests.length > 0 && (
                        <div className="p-3 bg-gray-50 rounded-b-xl">
                            <p className="text-xs text-gray-600 text-center">
                                {requests.length} pending mentor request{requests.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
} 