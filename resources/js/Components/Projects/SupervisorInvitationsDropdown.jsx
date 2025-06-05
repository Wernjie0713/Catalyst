import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SupervisorInvitationsDropdown({
    isOpen,
    onClose,
    invitations,
    onAccept,
    onReject,
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
                    className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
                >
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Supervisor Invitations</h3>
                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                                {invitations.length} pending
                            </span>
                        </div>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {invitations.length > 0 ? (
                                invitations.map((project) => (
                                    <div
                                        key={project.id}
                                        className="bg-gradient-to-br from-indigo-50 to-white rounded-lg p-4 shadow flex flex-col gap-2"
                                    >
                                        <div>
                                            <div className="font-semibold text-gray-900">{project.title}</div>
                                            <div className="text-sm text-gray-500">{project.student_name}</div>
                                            {project.team_name && (
                                                <div className="text-xs text-gray-400">{project.team_name}</div>
                                            )}
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => onAccept(project.id)}
                                                className="flex-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => onReject(project.id)}
                                                className="flex-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6">
                                    <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">
                                        mail
                                    </span>
                                    <p className="text-gray-500">No supervisor invitations yet</p>
                                    <p className="text-gray-400 text-sm">
                                        When a student requests you as supervisor, it will appear here.
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
