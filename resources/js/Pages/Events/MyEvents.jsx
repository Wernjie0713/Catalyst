import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { format } from 'date-fns';
import { useState, useEffect, useCallback } from 'react';
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
                ? 'text-[#F37022]' 
                : 'text-gray-500 hover:text-gray-700'
            }
            focus:outline-none focus:ring-2 focus:ring-[#F37022] focus:ring-offset-2 focus:ring-offset-white rounded-md
        `}
        whileTap={{ scale: 0.95 }}
    >
        {children}
        {active && (
            <motion.span 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F37022] rounded-full" 
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
    
    // Participant Dashboard States
    const [showDashboard, setShowDashboard] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [facultyFilter, setFacultyFilter] = useState('all');
    const [universityFilter, setUniversityFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loadedEventId, setLoadedEventId] = useState(null);
    const [participantsCache, setParticipantsCache] = useState(new Map());

    // Fixed dropdown options from database
    const facultyOptions = [
        'Faculty of Computing',
        'Faculty of Civil Engineering',
        'Faculty of Electrical Engineering',
        'Faculty of Chemical Engineering',
        'Faculty of Mechanical Engineering',
        'Faculty of Industrial Sciences & Technology',
        'Faculty of Manufacturing Engineering',
        'Faculty of Technology Engineering',
        'Faculty of Business & Communication',
        'Faculty of Industrial Management',
        'Faculty of Applied Sciences',
        'Faculty of Science & Technology',
        'Faculty of Medicine',
        'Faculty of Pharmacy',
        'Faculty of Dentistry',
        'Faculty of Arts & Social Sciences',
        'Faculty of Education',
        'Faculty of Economics & Administration',
        'Faculty of Law',
        'Faculty of Built Environment',
        'Faculty of Agriculture',
        'Faculty of Forestry',
        'Faculty of Veterinary Medicine',
        'Faculty of Islamic Studies',
        'Faculty of Sports Science',
        'Faculty of Creative Technology',
        'Faculty of Music',
        'Faculty of Architecture & Design',
        'Faculty of Hotel & Tourism Management',
        'Faculty of Health Sciences',
        'Faculty of Defence Studies & Management'
    ];

    const universityOptions = [
        'Universiti Malaysia Pahang',
        'Universiti Malaysia Sabah',
        'Universiti Malaysia Terengganu',
        'Universiti Kebangsaan Malaysia',
        'Universiti Malaya',
        'Universiti Sains Malaysia',
        'Universiti Putra Malaysia',
        'Universiti Teknologi Malaysia',
        'Universiti Utara Malaysia',
        'Universiti Islam Antarabangsa Malaysia',
        'Universiti Pendidikan Sultan Idris',
        'Universiti Sains Islam Malaysia',
        'Universiti Teknologi MARA',
        'Universiti Malaysia Sarawak',
        'Universiti Teknikal Malaysia Melaka',
        'Universiti Malaysia Perlis',
        'Universiti Tun Hussein Onn Malaysia',
        'Universiti Sultan Zainal Abidin',
        'Universiti Pertahanan Nasional Malaysia',
        'Universiti Malaysia Kelantan'
    ];

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

    // Fetch participants for dashboard
    const fetchParticipants = async (eventId) => {
        console.log('fetchParticipants called for eventId:', eventId);
        console.log('Cache has data for this event:', participantsCache.has(eventId));
        
        // Check if we have cached data for this event
        if (participantsCache.has(eventId)) {
            console.log('Using cached data for event:', eventId);
            const cachedData = participantsCache.get(eventId);
            setParticipants(cachedData);
            setLoadedEventId(eventId);
            return;
        }
        
        console.log('Fetching participants for event:', eventId);
        setLoading(true);
        try {
            const response = await fetch(`/events/${eventId}/participants`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const participantsData = data.participants || [];
            console.log('Participants fetched successfully:', participantsData.length);
            
            // Cache the data
            setParticipantsCache(prev => new Map(prev).set(eventId, participantsData));
            setParticipants(participantsData);
            setLoadedEventId(eventId);
        } catch (error) {
            console.error('Error fetching participants:', error);
            setParticipants([]);
            setLoadedEventId(null);
        } finally {
            setLoading(false);
        }
    };

    // Get unique values for filters (only for display purposes)
    const getUniqueFaculties = () => {
        const faculties = participants.map(p => p.faculty).filter(Boolean);
        return ['all', ...Array.from(new Set(faculties))];
    };

    const getUniqueUniversities = () => {
        const universities = participants.map(p => p.university).filter(Boolean);
        return ['all', ...Array.from(new Set(universities))];
    };

    // Filter participants based on criteria (client-side only)
    const filteredParticipants = participants.filter(participant => {
        const matchesSearch = !searchTerm || 
            participant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            participant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            participant.matric_no?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFaculty = facultyFilter === 'all' || participant.faculty === facultyFilter;
        const matchesUniversity = universityFilter === 'all' || participant.university === universityFilter;

        return matchesSearch && matchesFaculty && matchesUniversity;
    });

    const clearAllFilters = useCallback(() => {
        setSearchTerm('');
        setFacultyFilter('all');
        setUniversityFilter('all');
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
    }, []);

    const handleFacultyChange = useCallback((e) => {
        setFacultyFilter(e.target.value);
    }, []);

    const handleUniversityChange = useCallback((e) => {
        setUniversityFilter(e.target.value);
    }, []);

    // Participant Dashboard Component
    const ParticipantDashboard = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden"
        >
            <div className="p-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900">Participant Dashboard</h3>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setShowDashboard(false);
                            setSelectedEvent(null);
                            setLoadedEventId(null);
                            setParticipants([]);
                            // Clear cache for current event
                            if (selectedEvent?.event_id) {
                                setParticipantsCache(prev => {
                                    const newCache = new Map(prev);
                                    newCache.delete(selectedEvent.event_id);
                                    return newCache;
                                });
                            }
                        }}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </motion.button>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <motion.div 
                        className="bg-orange border-r p-4"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-500 text-lg font-bold">Total Participants</p>
                                <p className="text-2xl font-bold text-gray-900">{participants.length}</p>
                            </div>
                            <span className="material-symbols-outlined text-blue-500 text-2xl">group</span>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        className="bg-green border-r p-4"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-400 text-lg font-bold">Filtered Results</p>
                                <p className="text-2xl font-bold text-gray-900">{filteredParticipants.length}</p>
                            </div>
                            <span className="material-symbols-outlined text-green-400 text-2xl">filter_list</span>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        className="bg-purple border-r p-4"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-500 text-lg font-bold">Unique Faculties</p>
                                <p className="text-2xl font-bold text-gray-900">{getUniqueFaculties().length - 1}</p>
                            </div>
                            <span className="material-symbols-outlined text-red-500 text-2xl">school</span>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        className="bg-yellow border-r p-4"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-500 text-lg font-bold">Unique Universities</p>
                                <p className="text-2xl font-bold text-gray-900">{getUniqueUniversities().length - 1}</p>
                            </div>
                            <span className="material-symbols-outlined text-yellow-500 text-2xl">account_balance</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="p-6 border-b border-gray-200">
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-500">search</span>
                        </span>
                        <input
                            type="text"
                            placeholder="Search by name, email, or matric number..."
                            value={searchTerm}
                            onChange={handleSearchChange}
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
                                    <span className="material-symbols-outlined text-gray-500 hover:text-gray-700">close</span>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Filter Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Faculty</label>
                            <select
                                value={facultyFilter}
                                onChange={handleFacultyChange}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F37022]"
                            >
                                <option value="all">All Faculties</option>
                                {facultyOptions.map(faculty => (
                                    <option key={faculty} value={faculty}>
                                        {faculty}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
                            <select
                                value={universityFilter}
                                onChange={handleUniversityChange}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F37022]"
                            >
                                <option value="all">All Universities</option>
                                {universityOptions.map(university => (
                                    <option key={university} value={university}>
                                        {university}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    {(searchTerm || facultyFilter !== 'all' || universityFilter !== 'all') && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={clearAllFilters}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Clear all filters
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Participants List */}
            <div className="p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F37022]"></div>
                        <span className="ml-3 text-gray-600">Loading participants...</span>
                    </div>
                ) : filteredParticipants.length === 0 ? (
                    <div className="text-center py-8 text-gray-600">
                        <span className="material-symbols-outlined text-4xl mb-4">group_off</span>
                        <p>No participants found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredParticipants.map((participant, index) => (
                            <motion.div
                                key={participant.id || index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(index * 0.05, 0.5) }}
                                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-gradient-to-r from-[#F37022] to-[#d95f16] rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                            {participant.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-gray-900 font-medium">{participant.name || 'Unknown'}</h4>
                                        <p className="text-gray-600 text-sm">{participant.email || 'No email'}</p>
                                        <div className="flex items-center space-x-4 mt-1">
                                            {participant.faculty && (
                                                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                                    {participant.faculty}
                                                </span>
                                            )}
                                            {participant.university && (
                                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                                    {participant.university}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end space-y-1">
                                    {participant.matric_no && (
                                        <span className="text-xs text-gray-600">
                                            {participant.matric_no}
                                        </span>
                                    )}
                                    {participant.level && (
                                        <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                                            {participant.level}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );

    const EventTable = ({ events, showEditButton = false }) => (
        <motion.div 
            className="bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {events.length === 0 ? (
                <motion.div 
                    className="p-8 text-gray-600 text-center"
                    variants={itemVariants}
                >
                    <p className="text-lg">No events found.</p>
                </motion.div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden sm:block">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Event
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        {activeTab === 'organized' ? 'Participants' : 'Type'}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-48">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {events.map((event, index) => (
                                    <motion.tr 
                                        key={event.event_id} 
                                        className="hover:bg-gray-50 transition-colors"
                                        custom={index}
                                        variants={cardVariants}
                                        whileHover="hover"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <div>
                                                    <div className="text-lg font-medium text-gray-900">
                                                        {event.title}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {event.event_type}
                                                        {event.is_external && (
                                                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700">
                                                                External
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {format(new Date(event.date), 'MMM dd, yyyy')}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {event.formatted_time}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                event.status === 'Upcoming' ? 'bg-green-100 text-green-700' :
                                                event.status === 'Ongoing' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
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
                                                                className="text-[#F37022] hover:text-[#F37022]/70 transition-colors mr-2"
                                                                title="View Participants"
                                                            >
                                                                <span className="material-symbols-outlined text-base">group</span>
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => {
                                                                    if (showDashboard && selectedEvent?.event_id === event.event_id) {
                                                                        // Close dashboard if it's already open for this event
                                                                        setShowDashboard(false);
                                                                        setSelectedEvent(null);
                                                                        setLoadedEventId(null);
                                                                        setParticipants([]);
                                                                        // Clear cache for this event
                                                                        setParticipantsCache(prev => {
                                                                            const newCache = new Map(prev);
                                                                            newCache.delete(event.event_id);
                                                                            return newCache;
                                                                        });
                                                                    } else {
                                                                        // Open dashboard for this event
                                                                        setSelectedEvent(event);
                                                                        fetchParticipants(event.event_id);
                                                                        setShowDashboard(true);
                                                                    }
                                                                }}
                                                                className={`transition-colors mr-2 ${
                                                                    showDashboard && selectedEvent?.event_id === event.event_id
                                                                        ? 'text-[#F37022]'
                                                                        : 'text-[#F37022] hover:opacity-80'
                                                                }`}
                                                                title="Participant Dashboard"
                                                            >
                                                                <span className="material-symbols-outlined text-base">dashboard</span>
                                                            </motion.button>
                                                        </>
                                                    )}
                                                    <span className="text-sm text-gray-600">
                                                        {event.is_external 
                                                            ? 'External Registration' 
                                                            : event.is_team_event
                                                                ? `${event.enrolled_teams_count || 0}/${event.max_participants} teams`
                                                                : `${event.enrolled_count}/${event.max_participants} participants`
                                                        }
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-600">
                                                    {event.is_external ? 'External Event' : 'Internal Event'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-left text-sm font-medium">
                                            <div className="flex items-center space-x-3">
                                                {activeTab === 'organized' && event.status === 'Completed' && !event.is_external && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => {
                                                            setSelectedEvent(event);
                                                            setShowCertificateOptions(true);
                                                            setIsParticipantsModalOpen(true);
                                                        }}
                                                        className="text-[#F37022] hover:opacity-80 transition-colors p-1 rounded-md hover:bg-orange-50"
                                                        title="Assign Certificates"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">workspace_premium</span>
                                                    </motion.button>
                                                )}
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleViewEvent(event)}
                                                    className="text-[#F37022] hover:opacity-80 transition-colors p-1 rounded-md hover:bg-orange-50"
                                                    title="View Event"
                                                >
                                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                                </motion.button>
                                                {activeTab === 'enrolled' && event.status === 'Completed' && can.event_feedback && (
                                                    <motion.a
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        href={route('feedback.create', event.event_id)}
                                                        className="text-[#F37022] hover:opacity-80 transition-colors p-1 rounded-md hover:bg-orange-50"
                                                        title="Submit Feedback"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">rate_review</span>
                                                    </motion.a>
                                                )}
                                                {activeTab === 'organized' && event.status === 'Completed' && can.event_feedbackview && (
                                                    <motion.a
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        href={route('feedback.index', event.event_id)}
                                                        className="text-[#F37022] hover:opacity-80 transition-colors p-1 rounded-md hover:bg-orange-50"
                                                        title="View Feedback"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">rate_review</span>
                                                    </motion.a>
                                                )}
                                                {showEditButton && can.event_edit && (
                                                    <motion.a
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        href={route('events.edit', event.event_id)}
                                                        className="text-[#F37022] hover:opacity-80 transition-colors p-1 rounded-md hover:bg-orange-50"
                                                        title="Edit Event"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </motion.a>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="sm:hidden divide-y divide-gray-200">
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
                                        <h3 className="text-gray-900 font-medium">{event.title}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">{event.event_type}</span>
                                            {event.is_external && (
                                                <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700">
                                                    External
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        event.status === 'Upcoming' ? 'bg-green-100 text-green-700' :
                                        event.status === 'Ongoing' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {event.status}
                                    </span>
                                </div>

                                {/* Date and Time */}
                                <div className="flex items-center gap-2 text-gray-600">
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
                                                    className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:text-gray-800"
                                                >
                                                    <span className="material-symbols-outlined text-base">group</span>
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        if (showDashboard && selectedEvent?.event_id === event.event_id) {
                                                            // Close dashboard if it's already open for this event
                                                            setShowDashboard(false);
                                                            setSelectedEvent(null);
                                                            setLoadedEventId(null);
                                                            setParticipants([]);
                                                            // Clear cache for this event
                                                            setParticipantsCache(prev => {
                                                                const newCache = new Map(prev);
                                                                newCache.delete(event.event_id);
                                                                return newCache;
                                                            });
                                                        } else {
                                                            // Open dashboard for this event
                                                            setSelectedEvent(event);
                                                            fetchParticipants(event.event_id);
                                                            setShowDashboard(true);
                                                        }
                                                    }}
                                                    className={`p-2 rounded-lg bg-gray-100 transition-colors ${
                                                        showDashboard && selectedEvent?.event_id === event.event_id
                                                            ? 'text-[#F37022]'
                                                            : 'text-[#F37022] hover:opacity-80'
                                                    }`}
                                                >
                                                    <span className="material-symbols-outlined text-base">dashboard</span>
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
                                                        className="p-2 rounded-lg bg-gray-100 text-[#F37022] hover:opacity-80"
                                                        title="Assign Certificates"
                                                    >
                                                        <span className="material-symbols-outlined text-base">workspace_premium</span>
                                                    </motion.button>
                                                )}
                                            </div>
                                        )}
                                        <span className="text-sm text-gray-600">
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
                                        className="flex-1 py-2 px-4 rounded-lg bg-orange-50 text-[#F37022] text-sm font-medium"
                                    >
                                        View Details
                                    </motion.button>
                                    {activeTab === 'enrolled' && event.status === 'Completed' && can.event_feedback && (
                                        <motion.a
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            href={route('feedback.create', event.event_id)}
                                            className="flex-1 py-2 px-4 rounded-lg bg-orange-50 text-[#F37022] text-sm font-medium text-center"
                                        >
                                            Feedback
                                        </motion.a>
                                    )}
                                    {activeTab === 'organized' && event.status === 'Completed' && can.event_feedbackview && (
                                        <motion.a
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            href={route('feedback.index', event.event_id)}
                                            className="flex-1 py-2 px-4 rounded-lg bg-orange-50 text-[#F37022] text-sm font-medium text-center"
                                        >
                                            View Feedback
                                        </motion.a>
                                    )}
                                    {showEditButton && can.event_edit && (
                                        <motion.a
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            href={route('events.edit', event.event_id)}
                                            className="flex-1 py-2 px-4 rounded-lg bg-orange-50 text-[#F37022] text-sm font-medium text-center"
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
                                className="text-2xl sm:text-3xl font-semibold text-gray-900"
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
                            <div className="flex gap-2 mx-auto rounded-lg p-1">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveTab('organized')}
                                    className={`
                                        px-4 sm:px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2
                                        ${activeTab === 'organized'
                                            ? 'bg-[#F37022] text-white shadow-lg shadow-[#F37022]/25'
                                            : 'text-gray-500 hover:text-white hover:bg-gray-700/50'
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
                                            ? 'bg-[#F37022] text-white shadow-lg shadow-[#F37022]/25'
                                            : 'text-gray-500 hover:text-white hover:bg-gray-700/50'
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

                        {/* Participant Dashboard */}
                        <AnimatePresence>
                            {showDashboard && (
                                <ParticipantDashboard />
                            )}
                        </AnimatePresence>
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