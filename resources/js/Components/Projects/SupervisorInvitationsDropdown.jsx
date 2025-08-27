import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SupervisorInvitationsDropdown({
    isOpen,
    onClose,
    invitations,
    onAccept,
    onReject,
    auth,
    loadingStates = {}
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
                            <span className="material-symbols-outlined text-blue-600 mr-2">
                                school
                            </span>
                            Supervisor Invitations
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Students requesting you as their supervisor
                        </p>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {invitations.length === 0 ? (
                            <div className="p-6 text-center">
                                <span className="material-symbols-outlined text-4xl text-gray-400 mb-2 block">
                                    assignment_ind
                                </span>
                                <p className="text-gray-500">No pending supervisor invitations</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    When students request you as supervisor, they will appear here
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {invitations.map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        custom={index}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 rounded-full bg-[#F37022] flex items-center justify-center shadow-sm">
                                                    <span className="text-white font-medium text-sm select-none">
                                                        {project.student_name?.slice(0,2).toUpperCase() || '?'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                                        {project.title}
                                                    </h4>
                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                        {project.type}
                                                    </span>
                                                </div>
                                                
                                                <p className="text-sm text-gray-600 mt-1">
                                                    By: {project.student_name}
                                                </p>
                                                
                                                {project.team_name && project.team_name !== 'Individual Project' && (
                                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                                        <span className="material-symbols-outlined text-xs mr-1">
                                                            group
                                                        </span>
                                                        <span>{project.team_name}</span>
                                                    </div>
                                                )}

                                                <div className="flex space-x-2 mt-3">
                                                    <motion.button
                                                        onClick={() => !loadingStates[project.id] && onAccept(project.id)}
                                                        whileHover={!loadingStates[project.id] ? { scale: 1.05 } : {}}
                                                        whileTap={!loadingStates[project.id] ? { scale: 0.95 } : {}}
                                                        disabled={loadingStates[project.id]}
                                                        className={`px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors ${
                                                            loadingStates[project.id] === 'accepting' ? 'opacity-75 cursor-not-allowed' : ''
                                                        }`}
                                                    >
                                                        {loadingStates[project.id] === 'accepting' ? (
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
                                                        onClick={() => !loadingStates[project.id] && onReject(project.id)}
                                                        whileHover={!loadingStates[project.id] ? { scale: 1.05 } : {}}
                                                        whileTap={!loadingStates[project.id] ? { scale: 0.95 } : {}}
                                                        disabled={loadingStates[project.id]}
                                                        className={`px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors ${
                                                            loadingStates[project.id] === 'rejecting' ? 'opacity-75 cursor-not-allowed' : ''
                                                        }`}
                                                    >
                                                        {loadingStates[project.id] === 'rejecting' ? (
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

                    {invitations.length > 0 && (
                        <div className="p-3 bg-gray-50 rounded-b-xl">
                            <p className="text-xs text-gray-600 text-center">
                                {invitations.length} pending supervisor invitation{invitations.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
