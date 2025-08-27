import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MentorRequestModal({ isOpen, onClose, lecturer, onSubmit }) {
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return; // prevent double submit
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
                        onClick={() => { if (!isSubmitting) onClose(); }}
                    />

                    {/* Modal Content */}
                    <motion.div
                        className={`relative bg-white rounded-2xl p-6 w-full max-w-lg border border-orange-200 shadow-2xl ${isSubmitting ? 'cursor-wait' : ''}`}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        aria-busy={isSubmitting}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Request Mentorship</h2>
                            <motion.button
                                onClick={() => { if (!isSubmitting) onClose(); }}
                                whileHover={isSubmitting ? {} : { scale: 1.1 }}
                                whileTap={isSubmitting ? {} : { scale: 0.9 }}
                                disabled={isSubmitting}
                                className={`text-gray-400 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:text-orange-600'} transition-colors`}
                            >
                                <span className="material-symbols-outlined text-xl">close</span>
                            </motion.button>
                        </div>

                        {/* Lecturer Info */}
                        <div className="flex items-center space-x-4 mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="relative">
                                {lecturer.profile_photo_path ? (
                                    <img 
                                        src={`/storage/${lecturer.profile_photo_path}`}
                                        alt={lecturer.name}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-orange-200"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                        <span className="text-white font-medium text-xl">
                                            {lecturer.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-gray-800 font-semibold text-lg">{lecturer.name}</h3>
                                <p className="text-gray-600 text-sm">{lecturer.department}</p>
                                <p className="text-gray-600 text-sm">{lecturer.specialization}</p>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Message (Optional)
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tell the lecturer why you'd like them as your mentor..."
                                    className={`w-full px-4 py-3 bg-white border border-orange-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200 resize-none ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    rows="4"
                                    maxLength="500"
                                    disabled={isSubmitting}
                                />
                                <p className="text-gray-500 text-xs mt-1">
                                    {message.length}/500 characters
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-3 pt-2">
                                <motion.button
                                    type="button"
                                    onClick={() => { if (!isSubmitting) onClose(); }}
                                    whileHover={isSubmitting ? {} : { scale: 1.02 }}
                                    whileTap={isSubmitting ? {} : { scale: 0.98 }}
                                    disabled={isSubmitting}
                                    className={`flex-1 px-4 py-3 ${isSubmitting ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-gray-100 hover:bg-gray-200'} text-gray-700 rounded-lg transition-all duration-200 border border-gray-200`}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
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