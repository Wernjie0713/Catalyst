import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TiltedEventCard from '@/Components/TiltedEventCard';
import ModernPagination from '@/Components/ModernPagination';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Index = ({ events: initialEvents }) => {
    const [events, setEvents] = useState(initialEvents);
    const [showTeamEvents, setShowTeamEvents] = useState(false);
    const { can } = usePage().props;

    const handleEventUpdate = (updatedEvent) => {
        setEvents(prev => ({
            ...prev,
            data: prev.data.map(event => 
                event.event_id === updatedEvent.event_id ? updatedEvent : event
            )
        }));
    };

    // Filter events based on the selected tab
    const filteredEvents = events.data.filter(event => 
        showTeamEvents ? event.is_team_event : !event.is_team_event
    );

    // Softer page animation
    const pageVariants = {
        initial: {
            opacity: 0,
        },
        animate: {
            opacity: 1,
            transition: {
                duration: 0.7,
                ease: "easeInOut"
            }
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    // Gentler container animation for cards
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1,
                ease: "easeOut",
                duration: 0.5
            }
        }
    };

    const item = {
        hidden: { opacity: 0 },
        show: { 
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Events" />

            <AnimatePresence mode="wait">
                <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    className="py-12"
                >
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        {/* Header Section with Gentle Animation */}
                        <motion.div 
                            className="flex justify-between items-center mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                        >
                            <div className="space-y-1">
                                <h2 className="text-3xl font-semibold text-white">Events</h2>
                                <p className="text-gray-400">
                                    Discover and join amazing events
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                {/* Mobile Toggle Buttons */}
                                <div className="sm:hidden flex items-center bg-[#1E1E2E]/50 rounded-lg p-1.5 w-full">
                                    <button
                                        onClick={() => setShowTeamEvents(false)}
                                        className={`
                                            flex-1 px-4 py-2 rounded-md text-sm font-medium 
                                            transition-colors duration-300 flex items-center justify-center gap-2
                                            ${!showTeamEvents 
                                                ? 'bg-blue-500 text-white' 
                                                : 'text-gray-400 hover:text-white'
                                            }
                                        `}
                                    >
                                        <span className="material-symbols-outlined text-sm">person</span>
                                        <span>Individual</span>
                                    </button>
                                    <button
                                        onClick={() => setShowTeamEvents(true)}
                                        className={`
                                            flex-1 px-4 py-2 rounded-md text-sm font-medium 
                                            transition-colors duration-300 flex items-center justify-center gap-2
                                            ${showTeamEvents 
                                                ? 'bg-blue-500 text-white' 
                                                : 'text-gray-400 hover:text-white'
                                            }
                                        `}
                                    >
                                        <span className="material-symbols-outlined text-sm">groups</span>
                                        <span>Team</span>
                                    </button>
                                </div>

                                {/* Desktop Toggle Switch */}
                                <div className="hidden sm:flex items-center space-x-3 bg-[#1E1E2E]/50 px-4 py-2 rounded-xl">
                                    <div className="flex items-center space-x-2">
                                        <span className="material-symbols-outlined text-gray-400">person</span>
                                        <span className={`text-sm font-medium transition-colors duration-300 ${!showTeamEvents ? 'text-white' : 'text-gray-400'}`}>
                                            Individual
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => setShowTeamEvents(!showTeamEvents)}
                                        className={`
                                            relative inline-flex h-7 w-14 items-center rounded-full
                                            transition-all duration-300 ease-in-out focus:outline-none
                                            ${showTeamEvents 
                                                ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                                                : 'bg-gradient-to-r from-rose-400 to-amber-400'
                                            }
                                            shadow-lg
                                        `}
                                    >
                                        <span
                                            className={`
                                                inline-block h-5 w-5 transform rounded-full
                                                transition-all duration-300 ease-in-out
                                                ${showTeamEvents ? 'translate-x-8' : 'translate-x-1'}
                                                bg-white shadow-md
                                                flex items-center justify-center
                                            `}
                                        >
                                            <span className={`
                                                material-symbols-outlined text-[12px]
                                                ${showTeamEvents ? 'text-blue-500' : 'text-amber-500'}
                                            `}>
                                                {showTeamEvents ? 'groups' : 'person'}
                                            </span>
                                        </span>
                                    </button>

                                    <div className="flex items-center space-x-2">
                                        <span className="material-symbols-outlined text-gray-400">groups</span>
                                        <span className={`text-sm font-medium transition-colors duration-300 ${showTeamEvents ? 'text-white' : 'text-gray-400'}`}>
                                            Team
                                        </span>
                                    </div>
                                </div>

                                {can.event_upload && (
                                    <motion.a
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        href={route('events.create')}
                                        className="
                                            bg-blue-500 hover:bg-blue-600 text-white font-bold 
                                            py-2 px-4 sm:px-6 rounded-lg transition-colors duration-300 
                                            flex items-center space-x-2 text-sm sm:text-base shadow-lg
                                            fixed bottom-6 right-6 sm:relative sm:bottom-auto sm:right-auto
                                            z-50
                                        "
                                    >
                                        <span className="material-symbols-outlined text-sm">add</span>
                                        <span>Create Event</span>
                                    </motion.a>
                                )}
                            </div>
                        </motion.div>

                        {filteredEvents.length > 0 ? (
                            <>
                                <motion.div 
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 justify-items-center px-4 sm:px-0"
                                >
                                    {filteredEvents.map((event) => (
                                        <motion.div 
                                            key={event.event_id} 
                                            variants={item}
                                            className="w-full max-w-sm"
                                        >
                                            <TiltedEventCard 
                                                event={event} 
                                                onEventUpdate={handleEventUpdate}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.7, delay: 0.2 }}
                                    className="mt-8"
                                >
                                    <ModernPagination links={events.links} />
                                </motion.div>
                            </>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.7 }}
                                className="text-center py-12"
                            >
                                <div className="text-gray-400 text-6xl mb-4">
                                    <span className="material-symbols-outlined" style={{ fontSize: '4rem' }}>
                                        event_busy
                                    </span>
                                </div>
                                <h3 className="text-xl font-medium text-gray-300 mb-2">
                                    No {showTeamEvents ? 'Team' : 'Individual'} Events Found
                                </h3>
                                <p className="text-gray-400">
                                    There are no {showTeamEvents ? 'team' : 'individual'} events available at the moment.
                                </p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </AuthenticatedLayout>
    );
};

export default Index; 
