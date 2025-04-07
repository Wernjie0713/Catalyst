import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function EventModal({ event: initialEvent, isOpen, onClose, onEventUpdate, auth }) {
    if (!isOpen) return null;

    const [isEnrolling, setIsEnrolling] = useState(false);
    const [event, setEvent] = useState(initialEvent);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [availableTeams, setAvailableTeams] = useState([]);
    const [isLoadingTeams, setIsLoadingTeams] = useState(false);
    const { post, delete: destroy, data, setData, reset } = useForm({
        team_id: '',
    });

    // Update local event state when prop changes
    useEffect(() => {
        setEvent({
            ...initialEvent,
            is_enrolled: Boolean(initialEvent.is_enrolled)
        });
    }, [initialEvent]);

    // Fetch available teams for team events
    useEffect(() => {
        if (isOpen && event.is_team_event && !event.is_enrolled && !event.is_external) {
            fetchAvailableTeams();
        }
    }, [isOpen, event.event_id, event.is_team_event]);

    const fetchAvailableTeams = async () => {
        setIsLoadingTeams(true);
        try {
            const response = await axios.get(route('events.available-teams', event.event_id));
            setAvailableTeams(response.data);
        } catch (error) {
            console.error('Failed to load teams:', error);
        } finally {
            setIsLoadingTeams(false);
        }
    };

    const enrollmentPercentage = event.is_team_event 
        ? (event.enrolled_teams_count / event.max_participants) * 100
        : (event.enrolled_count / event.max_participants) * 100;

    const handleTeamChange = (e) => {
        const teamId = e.target.value;
        setData('team_id', teamId);
        setSelectedTeam(availableTeams.find(team => team.id === teamId));
    };

    const handleEnrollment = () => {
        setIsEnrolling(true);
        
        if (event.is_team_event && !event.is_external) {
            // Validate team selection
            if (!data.team_id) {
                alert('Please select a team to enroll');
                setIsEnrolling(false);
                return;
            }
        }
        
        post(route('events.enroll', event.event_id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEnrolling(false);
                // Update local event state
                setEvent(prev => ({
                    ...prev,
                    is_enrolled: true,
                    enrolled_count: prev.is_team_event 
                        ? prev.enrolled_count + (selectedTeam?.members_count || 0)
                        : prev.enrolled_count + 1,
                    enrolled_teams_count: prev.is_team_event 
                        ? (prev.enrolled_teams_count || 0) + 1 
                        : prev.enrolled_teams_count
                }));
                
                // Notify parent component about the update
                if (onEventUpdate) {
                    onEventUpdate({
                        ...event,
                        is_enrolled: true,
                        enrolled_count: event.is_team_event 
                            ? event.enrolled_count + (selectedTeam?.members_count || 0)
                            : event.enrolled_count + 1,
                        enrolled_teams_count: event.is_team_event 
                            ? (event.enrolled_teams_count || 0) + 1 
                            : event.enrolled_teams_count,
                        enrolled_team: selectedTeam
                    });
                }
                
                reset();
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
                const memberCount = event.enrolled_team?.member_count || 1;
                
                setEvent(prev => ({
                    ...prev,
                    is_enrolled: false,
                    enrolled_count: prev.is_team_event 
                        ? prev.enrolled_count - memberCount
                        : prev.enrolled_count - 1,
                    enrolled_teams_count: prev.is_team_event 
                        ? (prev.enrolled_teams_count || 0) - 1 
                        : prev.enrolled_teams_count,
                    enrolled_team: null
                }));
                
                // Notify parent component about the update
                if (onEventUpdate) {
                    onEventUpdate({
                        ...event,
                        is_enrolled: false,
                        enrolled_count: event.is_team_event 
                            ? event.enrolled_count - memberCount
                            : event.enrolled_count - 1,
                        enrolled_teams_count: event.is_team_event 
                            ? (event.enrolled_teams_count || 0) - 1 
                            : event.enrolled_teams_count,
                        enrolled_team: null
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
                        style={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        style={{ opacity: 0, scale: 0.95 }}
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
                                        {event.is_team_event && (
                                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400">
                                                Team Event
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

                                {event.is_team_event && !event.is_external && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400 mb-2">Team Requirements</h3>
                                        <div className="flex items-center text-white">
                                            <span className="material-symbols-outlined mr-2 text-amber-400">group</span>
                                            <span>
                                                {event.min_team_members === event.max_team_members 
                                                    ? `Exactly ${event.min_team_members} members per team` 
                                                    : `${event.min_team_members}-${event.max_team_members} members per team`}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {!event.is_external && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400 mb-2">
                                            {event.is_team_event ? 'Team Enrollment Status' : 'Enrollment Status'}
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-white">
                                                    {event.is_team_event 
                                                        ? `${event.enrolled_teams_count || 0} teams enrolled of ${event.max_participants} spots`
                                                        : `${event.enrolled_count} enrolled of ${event.max_participants} spots`
                                                    }
                                                </span>
                                                <span className="text-white">
                                                    {event.is_team_event
                                                        ? `${((event.enrolled_teams_count || 0) / event.max_participants * 100).toFixed(0)}%`
                                                        : `${((event.enrolled_count / event.max_participants) * 100).toFixed(0)}%`
                                                    }
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${
                                                        enrollmentPercentage >= 90 ? 'bg-red-500' :
                                                        enrollmentPercentage >= 75 ? 'bg-yellow-500' :
                                                        'bg-green-500'
                                                    }`}
                                                    style={{ width: `${Math.min(enrollmentPercentage, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {event.is_enrolled && event.is_team_event && event.enrolled_team && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400 mb-2">Your Team</h3>
                                        <div className="flex items-center text-white">
                                            <span className="material-symbols-outlined mr-2 text-indigo-400">people</span>
                                            <span>{event.enrolled_team.name} ({event.enrolled_team.member_count} members)</span>
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

                            {/* Team Selection (for team events) */}
                            {event.is_team_event && !event.is_external && !event.is_enrolled && event.status === 'Upcoming' && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-medium text-gray-400 mb-2">Select Your Team</h3>
                                    
                                    {isLoadingTeams ? (
                                        <div className="text-gray-400">Loading available teams...</div>
                                    ) : availableTeams.length === 0 ? (
                                        <div className="text-amber-400">
                                            You don't have any eligible teams that meet the size requirements.
                                            Create a team or adjust your existing team before enrolling.
                                        </div>
                                    ) : (
                                        <select
                                            value={data.team_id}
                                            onChange={handleTeamChange}
                                            className="w-full bg-[#2A2A3A] border border-gray-700 rounded-lg px-4 py-2 text-white"
                                        >
                                            <option value="">Select a team</option>
                                            {availableTeams.map(team => (
                                                <option key={team.id} value={team.id}>
                                                    {team.name} ({team.members_count} members)
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            )}

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
                                        // For team events, only show unenroll button if user is the team leader
                                        (event.is_team_event && event.enrolled_team && event.enrolled_team.creator_id !== auth?.user?.id) ? (
                                            <div className="flex flex-col items-end">
                                                <button
                                                    disabled={true}
                                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg transition-colors opacity-50 cursor-not-allowed"
                                                >
                                                    Team Leader Action Required
                                                </button>
                                                <span className="text-xs text-yellow-400 mt-1">
                                                    Only {event.enrolled_team.creator?.name || "the team leader"} can unenroll the team
                                                </span>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleUnenroll}
                                                disabled={isEnrolling || event.status !== 'Upcoming'}
                                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isEnrolling ? 'Processing...' : event.is_team_event ? 'Unenroll Team' : 'Unenroll'}
                                            </button>
                                        )
                                    ) : (
                                        <button
                                            onClick={handleEnrollment}
                                            disabled={
                                                isEnrolling || 
                                                event.status !== 'Upcoming' ||
                                                (event.is_team_event ? 
                                                    (event.enrolled_teams_count >= event.max_participants || !data.team_id || availableTeams.length === 0) : 
                                                    event.enrolled_count >= event.max_participants)
                                            }
                                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isEnrolling ? 'Processing...' : 
                                                event.is_team_event ?
                                                (event.enrolled_teams_count >= event.max_participants ? 'Event Full' :
                                                availableTeams.length === 0 ? 'No Eligible Teams' : 'Enroll Team') :
                                                (event.enrolled_count >= event.max_participants ? 'Event Full' : 'Enroll Now')
                                            }
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