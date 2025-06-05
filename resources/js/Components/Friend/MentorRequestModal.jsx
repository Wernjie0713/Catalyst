import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MentorRequestModal({ isOpen, onClose, lecturer, onSubmit }) {
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await onSubmit(message);
            setMessage('');
        } catch (error) {
            console.error('Error submitting mentor request:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const modalVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const contentVariants = {
        hidden: { scale: 0.95, opacity: 0 },
        visible: { 
            scale: 1, 
            opacity: 1,
            transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
            }
        },
        exit: { 
            scale: 0.95, 
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    if (!lecturer) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 rounded-2xl p-6 w-full max-w-lg border border-white/10 shadow-2xl"
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Request Mentorship</h2>
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-xl">close</span>
                            </motion.button>
                        </div>

                        {/* Lecturer Info */}
                        <div className="flex items-center space-x-4 mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="relative">
                                {lecturer.profile_photo_path ? (
                                    <img 
                                        src={`/storage/${lecturer.profile_photo_path}`}
                                        alt={lecturer.name}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <span className="text-white font-medium text-xl">
                                            {lecturer.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-semibold text-lg">{lecturer.name}</h3>
                                <p className="text-gray-400 text-sm">{lecturer.department}</p>
                                <p className="text-gray-400 text-sm">{lecturer.specialization}</p>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-white font-medium mb-2">
                                    Message (Optional)
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tell the lecturer why you'd like them as your mentor..."
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
                                    rows="4"
                                    maxLength="500"
                                />
                                <p className="text-gray-400 text-xs mt-1">
                                    {message.length}/500 characters
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-3 pt-2">
                                <motion.button
                                    type="button"
                                    onClick={onClose}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 px-4 py-3 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 rounded-lg transition-all duration-200 border border-gray-600/30 hover:border-gray-600/50"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-sm">send</span>
                                            <span>Send Request</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
} 