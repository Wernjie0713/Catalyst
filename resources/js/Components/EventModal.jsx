import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function EventModal({ event: initialEvent, isOpen, onClose, onEventUpdate }) {
    if (!isOpen) return null;

    const [isEnrolling, setIsEnrolling] = useState(false);
    const [event, setEvent] = useState(initialEvent);
    const { post, delete: destroy } = useForm();

    // Update local event state when prop changes
    useEffect(() => {
        setEvent({
            ...initialEvent,
            is_enrolled: Boolean(initialEvent.is_enrolled)
        });
    }, [initialEvent]);

    const enrollmentPercentage = (event.enrolled_count / event.max_participants) * 100;

    const handleEnrollment = () => {
        setIsEnrolling(true);
        post(route('events.enroll', event.event_id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEnrolling(false);
                // Update local event state
                setEvent(prev => ({
                    ...prev,
                    is_enrolled: true,
                    enrolled_count: prev.enrolled_count + 1
                }));
                // Notify parent component about the update
                if (onEventUpdate) {
                    onEventUpdate({
                        ...event,
                        is_enrolled: true,
                        enrolled_count: event.enrolled_count + 1
                    });
                }
            },
            onError: () => setIsEnrolling(false)
        });
    };

    const handleUnenroll = () => {
        setIsEnrolling(true);
        destroy(route('events.unenroll', event.event_id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEnrolling(false);
                // Update local event state
                setEvent(prev => ({
                    ...prev,
                    is_enrolled: false,
                    enrolled_count: prev.enrolled_count - 1
                }));
                // Notify parent component about the update
                if (onEventUpdate) {
                    onEventUpdate({
                        ...event,
                        is_enrolled: false,
                        enrolled_count: event.enrolled_count - 1
                    });
                }
            },
            onError: () => setIsEnrolling(false)
        });
    };

    const handleExternalRegistration = () => {
        window.open(event.registration_url, '_blank');
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-screen items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full max-w-2xl rounded-2xl bg-[#1E1E2E] shadow-xl"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        {/* Event Cover Image */}
                        <div className="relative h-48 rounded-t-2xl overflow-hidden">
                            <img
                                src={event.cover_image ? `/${event.cover_image}` : '/default-event-image.jpg'}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E2E] to-transparent" />
                        </div>

                        <div className="p-6">
                            {/* Header */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-white">{event.title}</h2>
                                    <div className="flex items-center space-x-2">
                                        {event.is_external && (
                                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400">
                                                External Event
                                            </span>
                                        )}
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            event.status === 'Upcoming' ? 'bg-green-500/20 text-green-400' :
                                            event.status === 'Ongoing' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {event.status}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-400 mt-1">
                                    {event.is_external ? `Organized by ${event.organizer_name}` : `Created by ${event.creator.name}`}
                                </p>
                            </div>

                            {/* Event Details Grid */}
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-2">Date & Time</h3>
                                    <div className="flex items-center text-white">
                                        <span className="material-symbols-outlined mr-2 text-blue-400">calendar_today</span>
                                        <span>{format(new Date(event.date), 'MMMM dd, yyyy')} at {event.formatted_time}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-2">Location</h3>
                                    <div className="flex items-center text-white">
                                        <span className="material-symbols-outlined mr-2 text-green-400">location_on</span>
                                        <span>{event.location}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-2">Event Type</h3>
                                    <div className="flex items-center text-white">
                                        <span className="material-symbols-outlined mr-2 text-purple-400">category</span>
                                        <span>{event.event_type}</span>
                                    </div>
                                </div>

                                {!event.is_external && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400 mb-2">Enrollment Status</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-white">
                                                    {event.enrolled_count} enrolled of {event.max_participants} spots
                                                </span>
                                                <span className="text-white">
                                                    {((event.enrolled_count / event.max_participants) * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${
                                                        (event.enrolled_count / event.max_participants) >= 0.9 ? 'bg-red-500' :
                                                        (event.enrolled_count / event.max_participants) >= 0.75 ? 'bg-yellow-500' :
                                                        'bg-green-500'
                                                    }`}
                                                    style={{ width: `${(event.enrolled_count / event.max_participants) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {event.is_external && event.organizer_website && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400 mb-2">Organizer Website</h3>
                                        <div className="flex items-center text-white">
                                            <span className="material-symbols-outlined mr-2 text-blue-400">language</span>
                                            <a 
                                                href={event.organizer_website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                Visit Website
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                                <p className="text-white whitespace-pre-line">{event.description}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    Close
                                </button>
                                
                                {event.is_external ? (
                                    <button
                                        onClick={handleExternalRegistration}
                                        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                                    >
                                        Register at External Site
                                    </button>
                                ) : (
                                    event.is_enrolled ? (
                                        <button
                                            onClick={handleUnenroll}
                                            disabled={isEnrolling || event.status !== 'Upcoming'}
                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isEnrolling ? 'Processing...' : 'Unenroll'}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleEnrollment}
                                            disabled={isEnrolling || event.enrolled_count >= event.max_participants || event.status !== 'Upcoming'}
                                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isEnrolling ? 'Processing...' : 
                                             event.enrolled_count >= event.max_participants ? 'Event Full' : 
                                             'Enroll Now'}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
} 