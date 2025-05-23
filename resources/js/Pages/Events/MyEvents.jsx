import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { format } from 'date-fns';
import { useState } from 'react';
import EventModal from '@/Components/EventModal';
import ParticipantsModal from '@/Components/ParticipantsModal';
import ParticipantListModal from '@/Components/ParticipantListModal';
import { motion, AnimatePresence } from 'framer-motion';

const TabButton = ({ active, onClick, children }) => (
    <motion.button
        onClick={onClick}
        className={`
            relative px-6 py-3 text-sm font-medium transition-all duration-200 ease-in-out
            ${active 
                ? 'text-white' 
                : 'text-gray-400 hover:text-gray-200'
            }
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md
        `}
        whileTap={{ scale: 0.95 }}
    >
        {children}
        {active && (
            <motion.span 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full" 
                layoutId="tabIndicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            />
        )}
    </motion.button>
);

const MyEvents = ({ organizedEvents, enrolledEvents }) => {
    const { can, auth } = usePage().props;
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
    const [isParticipantListModalOpen, setIsParticipantListModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('organized');
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [showCertificateOptions, setShowCertificateOptions] = useState(false);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: i => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.5,
                ease: "easeOut"
            }
        }),
        hover: {
            y: -5,
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        }
    };

    const fadeVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.4 }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    const handleViewEvent = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleAssignCertificates = (event) => {
        router.get(route('certificates.create', {
            event: event.event_id,
            participants: selectedParticipants
        }));
    };

    const EventTable = ({ events, showEditButton = false }) => (
        <motion.div 
            className="bg-white/5 backdrop-blur-sm border border-gray-800 shadow-xl rounded-xl overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {events.length === 0 ? (
                <motion.div 
                    className="p-8 text-gray-400 text-center"
                    variants={itemVariants}
                >
                    <p className="text-lg">No events found.</p>
                </motion.div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden sm:block">
                        <table className="min-w-full divide-y divide-gray-700/50">
                            <thead className="bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Event
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        {activeTab === 'organized' ? 'Participants' : 'Type'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {events.map((event, index) => (
                                    <motion.tr 
                                        key={event.event_id} 
                                        className="hover:bg-gray-800/50 transition-colors"
                                        custom={index}
                                        variants={cardVariants}
                                        whileHover="hover"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-100">
                                                        {event.title}
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        {event.event_type}
                                                        {event.is_external && (
                                                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-400">
                                                                External
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-100">
                                                {format(new Date(event.date), 'MMM dd, yyyy')}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {event.formatted_time}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                event.status === 'Upcoming' ? 'bg-green-500/10 text-green-400' :
                                                event.status === 'Ongoing' ? 'bg-blue-500/10 text-blue-400' :
                                                'bg-gray-500/10 text-gray-400'
                                            }`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {activeTab === 'organized' ? (
                                                <div className="flex items-center">
                                                    {!event.is_external && (
                                                        <>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => {
                                                                    setSelectedEvent(event);
                                                                    setIsParticipantListModalOpen(true);
                                                                }}
                                                                className="text-gray-400 hover:text-gray-300 transition-colors mr-2"
                                                                title="View Participants"
                                                            >
                                                                <span className="material-symbols-outlined text-base">group</span>
                                                            </motion.button>
                                                        </>
                                                    )}
                                                    <span className="text-sm text-gray-400">
                                                        {event.is_external 
                                                            ? 'External Registration' 
                                                            : event.is_team_event
                                                                ? `${event.enrolled_teams_count || 0}/${event.max_participants} teams`
                                                                : `${event.enrolled_count}/${event.max_participants} participants`
                                                        }
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">
                                                    {event.is_external ? 'External Event' : 'Internal Event'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {activeTab === 'organized' && event.status === 'Completed' && !event.is_external && (
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        setSelectedEvent(event);
                                                        setShowCertificateOptions(true);
                                                        setIsParticipantsModalOpen(true);
                                                    }}
                                                    className="text-yellow-400 hover:text-yellow-300 transition-colors mr-4"
                                                    title="Assign Certificates"
                                                >
                                                    <span className="material-symbols-outlined text-base">workspace_premium</span>
                                                </motion.button>
                                            )}
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleViewEvent(event)}
                                                className="text-blue-400 hover:text-blue-300 transition-colors mr-4"
                                            >
                                                View
                                            </motion.button>
                                            {activeTab === 'enrolled' && event.status === 'Completed' && can.event_feedback && (
                                                <motion.a
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    href={route('feedback.create', event.event_id)}
                                                    className="text-yellow-400 hover:text-yellow-300 transition-colors mr-4"
                                                >
                                                    Feedback
                                                </motion.a>
                                            )}
                                            {activeTab === 'organized' && event.status === 'Completed' && can.event_feedbackview && (
                                                <motion.a
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    href={route('feedback.index', event.event_id)}
                                                    className="text-purple-400 hover:text-purple-300 transition-colors mr-4"
                                                >
                                                    View Feedback
                                                </motion.a>
                                            )}
                                            {showEditButton && can.event_edit && (
                                                <motion.a
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    href={route('events.edit', event.event_id)}
                                                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                                >
                                                    Edit
                                                </motion.a>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="sm:hidden divide-y divide-gray-700/50">
                        {events.map((event, index) => (
                            <motion.div 
                                key={event.event_id} 
                                className="p-4 space-y-4"
                                custom={index}
                                variants={cardVariants}
                                whileHover="hover"
                            >
                                {/* Event Title and Type */}
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className="text-gray-100 font-medium">{event.title}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-400">{event.event_type}</span>
                                            {event.is_external && (
                                                <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-400">
                                                    External
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        event.status === 'Upcoming' ? 'bg-green-500/10 text-green-400' :
                                        event.status === 'Ongoing' ? 'bg-blue-500/10 text-blue-400' :
                                        'bg-gray-500/10 text-gray-400'
                                    }`}>
                                        {event.status}
                                    </span>
                                </div>

                                {/* Date and Time */}
                                <div className="flex items-center gap-2 text-gray-400">
                                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                                    <span className="text-sm">
                                        {format(new Date(event.date), 'MMM dd, yyyy')} • {event.formatted_time}
                                    </span>
                                </div>

                                {/* Participants Info */}
                                {activeTab === 'organized' && (
                                    <div className="flex items-center gap-3">
                                        {!event.is_external && (
                                            <div className="flex gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        setSelectedEvent(event);
                                                        setIsParticipantListModalOpen(true);
                                                    }}
                                                    className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-gray-300"
                                                >
                                                    <span className="material-symbols-outlined text-base">group</span>
                                                </motion.button>
                                                {event.status === 'Completed' && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => {
                                                            setSelectedEvent(event);
                                                            setShowCertificateOptions(true);
                                                            setIsParticipantsModalOpen(true);
                                                        }}
                                                        className="p-2 rounded-lg bg-gray-800/50 text-yellow-400 hover:text-yellow-300"
                                                    >
                                                        <span className="material-symbols-outlined text-base">workspace_premium</span>
                                                    </motion.button>
                                                )}
                                            </div>
                                        )}
                                        <span className="text-sm text-gray-400">
                                            {event.is_external 
                                                ? 'External Registration' 
                                                : event.is_team_event
                                                    ? `${event.enrolled_teams_count || 0}/${event.max_participants} teams`
                                                    : `${event.enrolled_count}/${event.max_participants} participants`
                                            }
                                        </span>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex items-center gap-3 pt-2">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleViewEvent(event)}
                                        className="flex-1 py-2 px-4 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-medium"
                                    >
                                        View Details
                                    </motion.button>
                                    {activeTab === 'enrolled' && event.status === 'Completed' && can.event_feedback && (
                                        <motion.a
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            href={route('feedback.create', event.event_id)}
                                            className="flex-1 py-2 px-4 rounded-lg bg-yellow-500/10 text-yellow-400 text-sm font-medium text-center"
                                        >
                                            Feedback
                                        </motion.a>
                                    )}
                                    {activeTab === 'organized' && event.status === 'Completed' && can.event_feedbackview && (
                                        <motion.a
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            href={route('feedback.index', event.event_id)}
                                            className="flex-1 py-2 px-4 rounded-lg bg-purple-500/10 text-purple-400 text-sm font-medium text-center"
                                        >
                                            View Feedback
                                        </motion.a>
                                    )}
                                    {showEditButton && can.event_edit && (
                                        <motion.a
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            href={route('events.edit', event.event_id)}
                                            className="flex-1 py-2 px-4 rounded-lg bg-indigo-500/10 text-indigo-400 text-sm font-medium text-center"
                                        >
                                            Edit
                                        </motion.a>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}
        </motion.div>
    );

    return (
        <AuthenticatedLayout>
            <Head title="My Events" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="flex flex-col space-y-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <motion.h2 
                                className="text-2xl sm:text-3xl font-semibold text-white"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                My Events
                            </motion.h2>
                        </div>

                        {/* Tab Navigation - Mobile Friendly */}
                        <motion.div 
                            className="flex overflow-x-auto scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <div className="flex gap-2 mx-auto bg-gray-800/50 rounded-lg p-1">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveTab('organized')}
                                    className={`
                                        px-4 sm:px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2
                                        ${activeTab === 'organized'
                                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                            : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                        }
                                    `}
                                >
                                    <span className="material-symbols-outlined text-base">edit_calendar</span>
                                    <span>Organized</span>
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveTab('enrolled')}
                                    className={`
                                        px-4 sm:px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2
                                        ${activeTab === 'enrolled'
                                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                            : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                        }
                                    `}
                                >
                                    <span className="material-symbols-outlined text-base">event_available</span>
                                    <span>Enrolled</span>
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Event Table/Cards */}
                        <div className="mt-4 sm:mt-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={fadeVariants}
                                >
                                    {activeTab === 'organized' ? (
                                        <EventTable events={organizedEvents} showEditButton={true} />
                                    ) : (
                                        <EventTable events={enrolledEvents} />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>

            {selectedEvent && (
                <>
                    <EventModal
                        event={selectedEvent}
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedEvent(null);
                        }}
                        auth={auth}
                    />
                    {!selectedEvent.is_external && (
                        <>
                            {/* Certificate Assignment Modal */}
                            <ParticipantsModal
                                event={selectedEvent}
                                isOpen={isParticipantsModalOpen}
                                onClose={() => {
                                    setIsParticipantsModalOpen(false);
                                    setSelectedEvent(null);
                                    setSelectedParticipants([]);
                                    setShowCertificateOptions(false);
                                }}
                            />
                            
                            {/* Participant List Modal - New */}
                            <ParticipantListModal
                                event={selectedEvent}
                                isOpen={isParticipantListModalOpen}
                                onClose={() => {
                                    setIsParticipantListModalOpen(false);
                                    setSelectedEvent(null);
                                }}
                            />
                        </>
                    )}
                </>
            )}
        </AuthenticatedLayout>
    );
};

export default MyEvents; 