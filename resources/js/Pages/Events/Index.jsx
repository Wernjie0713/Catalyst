import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TiltedEventCard from '@/Components/TiltedEventCard';
import ModernPagination from '@/Components/ModernPagination';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import ScrollingRainbow from '@/Components/ScrollingRainbow';

const Index = ({ events: initialEvents }) => {
    const [events, setEvents] = useState(initialEvents);
    const [isLoading, setIsLoading] = useState(false);
    const [eventFilter, setEventFilter] = useState('individual'); // 'individual', 'team', 'external'
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [eventTypeFilter, setEventTypeFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const { can } = usePage().props;
    const isInitialRender = useRef(true);

    // Update events when props change (from backend filtering)
    useEffect(() => {
        setEvents(initialEvents);
        setIsLoading(false);
    }, [initialEvents]);

    // Function to apply filters via backend
    const applyFilters = () => {
        setIsLoading(true);
        const params = {};
        
        if (searchTerm) params.search = searchTerm;
        if (eventFilter) params.eventFilter = eventFilter;
        if (statusFilter !== 'all') params.statusFilter = statusFilter;
        if (eventTypeFilter !== 'all') params.eventTypeFilter = eventTypeFilter;
        if (dateFilter !== 'all') params.dateFilter = dateFilter;
        
        router.get(route('events.index'), params, {
            preserveState: true,
            preserveScroll: true,
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
        });
    };

    // Apply filters when any filter changes (but not on initial load)
    useEffect(() => {
        // Skip the initial render to prevent immediate filtering
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }

        const timeoutId = setTimeout(() => {
            applyFilters();
        }, 300); // Debounce for search

        return () => clearTimeout(timeoutId);
    }, [searchTerm, eventFilter, statusFilter, eventTypeFilter, dateFilter]);

    // Function to handle pagination with current filters
    const handlePageChange = (url) => {
        setIsLoading(true);
        const params = new URLSearchParams(url.split('?')[1] || '');
        
        // Add current filters to pagination URL
        if (searchTerm) params.set('search', searchTerm);
        if (eventFilter) params.set('eventFilter', eventFilter);
        if (statusFilter !== 'all') params.set('statusFilter', statusFilter);
        if (eventTypeFilter !== 'all') params.set('eventTypeFilter', eventTypeFilter);
        if (dateFilter !== 'all') params.set('dateFilter', dateFilter);
        
        router.get(route('events.index') + '?' + params.toString(), {}, {
            preserveState: true,
            preserveScroll: true,
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
        });
    };

    const handleEventUpdate = (updatedEvent) => {
        setEvents(prev => ({
            ...prev,
            data: prev.data.map(event => 
                event.event_id === updatedEvent.event_id ? updatedEvent : event
            )
        }));
    };

    // Check for URL parameters on initial load
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlEventFilter = urlParams.get('eventFilter');
        const urlSearchTerm = urlParams.get('search');
        const urlStatusFilter = urlParams.get('statusFilter');
        const urlEventTypeFilter = urlParams.get('eventTypeFilter');
        const urlDateFilter = urlParams.get('dateFilter');

        // Only set filters if they exist in URL and are different from defaults
        if (urlEventFilter && urlEventFilter !== 'individual') {
            setEventFilter(urlEventFilter);
        }
        if (urlSearchTerm) {
            setSearchTerm(urlSearchTerm);
        }
        if (urlStatusFilter && urlStatusFilter !== 'all') {
            setStatusFilter(urlStatusFilter);
        }
        if (urlEventTypeFilter && urlEventTypeFilter !== 'all') {
            setEventTypeFilter(urlEventTypeFilter);
        }
        if (urlDateFilter && urlDateFilter !== 'all') {
            setDateFilter(urlDateFilter);
        }

        // If there are URL parameters, we need to apply filters immediately
        if (urlEventFilter || urlSearchTerm || urlStatusFilter || urlEventTypeFilter || urlDateFilter) {
            isInitialRender.current = false;
        }
    }, []);

    const clearAllFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setEventTypeFilter('all');
        setDateFilter('all');
        setEventFilter('individual');
        // Clear filters will trigger useEffect which will call applyFilters()
    };

    // Use events directly from backend (already filtered)
    const filteredEvents = events.data;

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
            <ScrollingRainbow circleCount={1200} />

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
                                <h2 className="text-3xl font-semibold text-black">Events</h2>
                                <p className="text-gray-600">
                                    Discover and join amazing events
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                {/* Filter Buttons */}
                                <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1.5 gap-1 shadow-sm">
                                    <button
                                        onClick={() => setEventFilter('individual')}
                                        className={`
                                            w-12 sm:w-28 px-3 py-2 rounded-md text-sm font-medium 
                                            transition-colors duration-300 flex items-center justify-center gap-2
                                            ${eventFilter === 'individual' 
                                                ? 'bg-[#F37022] text-white' 
                                                : 'text-gray-700 hover:text-black'
                                            }
                                        `}
                                    >
                                        <span className="material-symbols-outlined text-sm">person</span>
                                        <span className="hidden sm:inline">Individual</span>
                                    </button>
                                    <button
                                        onClick={() => setEventFilter('team')}
                                        className={`
                                            w-12 sm:w-28 px-3 py-2 rounded-md text-sm font-medium 
                                            transition-colors duration-300 flex items-center justify-center gap-2
                                            ${eventFilter === 'team' 
                                                ? 'bg-[#F37022] text-white' 
                                                : 'text-gray-700 hover:text-black'
                                            }
                                        `}
                                    >
                                        <span className="material-symbols-outlined text-sm">groups</span>
                                        <span className="hidden sm:inline">Team</span>
                                    </button>
                                    <button
                                        onClick={() => setEventFilter('external')}
                                        className={`
                                            w-12 sm:w-28 px-3 py-2 rounded-md text-sm font-medium 
                                            transition-colors duration-300 flex items-center justify-center gap-2
                                            ${eventFilter === 'external' 
                                                ? 'bg-[#F37022] text-white' 
                                                : 'text-gray-700 hover:text-black'
                                            }
                                        `}
                                    >
                                        <span className="material-symbols-outlined text-sm">public</span>
                                        <span className="hidden sm:inline">External</span>
                                    </button>
                                </div>

                                {can.event_upload && (
                                    <motion.a
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        href={route('events.create')}
                                        className="
                                            bg-[#F37022] hover:bg-[#e3641a] text-white font-bold 
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

                        {/* Search and Advanced Filters Section */}
                        <motion.div 
                            className="mb-6 space-y-4"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {/* Search Bar */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-gray-400">search</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search events by title, description, location, or organizer..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F37022] focus:border-[#F37022]"
                                />
                                <AnimatePresence>
                                    {searchTerm && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.15 }}
                                            onClick={() => setSearchTerm('')}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            <span className="material-symbols-outlined text-gray-400 hover:text-black">close</span>
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Advanced Filters Toggle */}
                            <div className="flex items-center justify-between">
                                <motion.button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:border-[#F37022] hover:shadow-md transition-all duration-300 group"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <motion.span 
                                        className="material-symbols-outlined text-sm text-[#F37022]"
                                        animate={{ rotate: showFilters ? 180 : 0 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                    >
                                        expand_more
                                    </motion.span>
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-[#F37022] transition-colors">
                                        Advanced Filters
                                    </span>
                                    <motion.div
                                        className="w-2 h-2 rounded-full bg-[#F37022]"
                                        animate={{ 
                                            scale: (searchTerm || statusFilter !== 'all' || eventTypeFilter !== 'all' || dateFilter !== 'all') ? 1 : 0,
                                            opacity: (searchTerm || statusFilter !== 'all' || eventTypeFilter !== 'all' || dateFilter !== 'all') ? 1 : 0
                                        }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </motion.button>

                                <AnimatePresence>
                                    {(searchTerm || statusFilter !== 'all' || eventTypeFilter !== 'all' || dateFilter !== 'all') && (
                                        <motion.button
                                            onClick={clearAllFilters}
                                            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-orange-50 border border-orange-200 text-[#F37022] hover:bg-orange-100 transition-all duration-300"
                                            initial={{ opacity: 0, scale: 0.8, x: 20 }}
                                            animate={{ opacity: 1, scale: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.8, x: 20 }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span className="material-symbols-outlined text-sm">clear_all</span>
                                            <span className="text-sm font-medium">Clear Filters</span>
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Advanced Filters */}
                            <AnimatePresence>
                                {showFilters && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                        transition={{ 
                                            duration: 0.4, 
                                            ease: "easeOut",
                                            opacity: { duration: 0.3 },
                                            scale: { duration: 0.3 }
                                        }}
                                        className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-white rounded-xl border border-orange-200/50 shadow-lg backdrop-blur-sm"
                                    >
                                        {/* Decorative background elements */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#F37022]/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#F37022]/5 to-transparent rounded-full translate-y-12 -translate-x-12" />
                                        
                                        <div className="relative p-6">
                                            <motion.div 
                                                className="flex items-center space-x-2 mb-4"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1, duration: 0.3 }}
                                            >
                                                <span className="material-symbols-outlined text-[#F37022]">tune</span>
                                                <h3 className="text-lg font-semibold text-gray-800">Filter Options</h3>
                                            </motion.div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {/* Status Filter */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2, duration: 0.3 }}
                                                >
                                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                                                        <span className="material-symbols-outlined text-[#F37022] text-sm">schedule</span>
                                                        <span>Status</span>
                                                    </label>
                                                    <select
                                                        value={statusFilter}
                                                        onChange={(e) => setStatusFilter(e.target.value)}
                                                        className="w-full bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F37022] focus:border-[#F37022] transition-all duration-200 hover:border-[#F37022]/50"
                                                    >
                                                        <option value="all">All Status</option>
                                                        <option value="Upcoming">Upcoming</option>
                                                        <option value="Ongoing">Ongoing</option>
                                                        <option value="Completed">Completed</option>
                                                    </select>
                                                </motion.div>

                                                {/* Event Type Filter */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3, duration: 0.3 }}
                                                >
                                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                                                        <span className="material-symbols-outlined text-[#F37022] text-sm">category</span>
                                                        <span>Event Type</span>
                                                    </label>
                                                    <select
                                                        value={eventTypeFilter}
                                                        onChange={(e) => setEventTypeFilter(e.target.value)}
                                                        className="w-full bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F37022] focus:border-[#F37022] transition-all duration-200 hover:border-[#F37022]/50"
                                                    >
                                                        <option value="all">All Types</option>
                                                        <option value="Workshop">Workshop</option>
                                                        <option value="Competition">Competition</option>
                                                        <option value="Seminar">Seminar</option>
                                                    </select>
                                                </motion.div>

                                                {/* Date Filter */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.4, duration: 0.3 }}
                                                >
                                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                                                        <span className="material-symbols-outlined text-[#F37022] text-sm">calendar_today</span>
                                                        <span>Date</span>
                                                    </label>
                                                    <select
                                                        value={dateFilter}
                                                        onChange={(e) => setDateFilter(e.target.value)}
                                                        className="w-full bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F37022] focus:border-[#F37022] transition-all duration-200 hover:border-[#F37022]/50"
                                                    >
                                                        <option value="all">All Dates</option>
                                                        <option value="today">Today</option>
                                                        <option value="tomorrow">Tomorrow</option>
                                                        <option value="this_week">This Week</option>
                                                        <option value="this_month">This Month</option>
                                                        <option value="upcoming">Upcoming</option>
                                                        <option value="past">Past Events</option>
                                                    </select>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Results Count */}
                            <motion.div 
                                className="text-sm text-gray-600"
                                key={`${filteredEvents.length}-${events.total}-${isLoading}`}
                                initial={{ opacity: 0.7, y: 2 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isLoading ? (
                                    <span className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#F37022]"></div>
                                        <span>Loading...</span>
                                    </span>
                                ) : (
                                    <>
                                        Showing {filteredEvents.length} of {events.total} events
                                        {(searchTerm || statusFilter !== 'all' || eventTypeFilter !== 'all' || dateFilter !== 'all') && (
                                            <span className="ml-2 text-[#F37022]">
                                                (filtered)
                                            </span>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        </motion.div>

                        {isLoading ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="text-center py-12"
                            >
                                <div className="flex items-center justify-center space-x-3">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F37022]"></div>
                                    <span className="text-gray-600">Loading events...</span>
                                </div>
                            </motion.div>
                        ) : filteredEvents.length > 0 ? (
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
                                    <ModernPagination 
                                        links={events.links} 
                                        onPageChange={handlePageChange}
                                    />
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
                                    No {eventFilter === 'individual' ? 'Individual' : eventFilter === 'team' ? 'Team' : 'External'} Events Found
                                </h3>
                                <p className="text-gray-400">
                                    {eventFilter === 'individual' 
                                        ? 'There are no internal individual events available at the moment.'
                                        : eventFilter === 'team'
                                        ? 'There are no internal team-based events available at the moment.'
                                        : 'There are no external events available at the moment.'
                                    }
                                    {(searchTerm || statusFilter !== 'all' || eventTypeFilter !== 'all' || dateFilter !== 'all') && (
                                        <span className="block mt-2">
                                            Try adjusting your filters to see more results.
                                        </span>
                                    )}
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
