import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect, useRef } from 'react';
import FriendCard from '@/Components/Friend/FriendCard';
import FriendTabs from '@/Components/Friend/FriendTabs';
import EmptyState from '@/Components/Friend/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '@/Components/Friend/SearchBar';
import CreateTeamModal from '@/Components/Friend/CreateTeamModal';
import TeamCard from '@/Components/Friend/TeamCard';
import axios from 'axios';
import TeamDetailsModal from '@/Components/Friend/TeamDetailsModal';
import TeamInvitationCard from '@/Components/Friend/TeamInvitationCard';
import FriendRequestsDropdown from '@/Components/Friend/FriendRequestsDropdown';
import TeamInvitationsDropdown from '@/Components/Friend/TeamInvitationsDropdown';
import AddToTeamModal from '@/Components/Friend/AddToTeamModal';
import LecturerCard from '@/Components/Friend/LecturerCard';
import MentorRequestModal from '@/Components/Friend/MentorRequestModal';
import FriendSuggestionCard from '@/Components/FriendSuggestionCard';

export default function FriendsList({ auth, friends = [], teams: initialTeams = [], pendingInvitations = [], can, userRelations, friendSuggestions = [] }) {
    const [activeTab, setActiveTab] = useState(() => {
        // If user tries to access teams tab without permission, default to 'all'
        const urlTab = new URL(window.location.href).searchParams.get('tab') || 'all';
        return (!can.team_grouping && urlTab === 'teams') ? 'all' : urlTab;
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
    const [teams, setTeams] = useState(initialTeams); // Initialize with props
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [isTeamDetailsModalOpen, setIsTeamDetailsModalOpen] = useState(false);
    const [isRequestsDropdownOpen, setIsRequestsDropdownOpen] = useState(false);
    const [isTeamInvitationsOpen, setIsTeamInvitationsOpen] = useState(false);
    const teamInvitationsButtonRef = useRef(null);
    const [pendingTeamInvitations, setPendingTeamInvitations] = useState([]);
    const [isAddToTeamModalOpen, setIsAddToTeamModalOpen] = useState(false);
    const [selectedTeamForMember, setSelectedTeamForMember] = useState(null);
    const [lecturers, setLecturers] = useState([]);
    const [isMentorRequestModalOpen, setIsMentorRequestModalOpen] = useState(false);
    const [selectedLecturer, setSelectedLecturer] = useState(null);
    
    // Loading states for different actions
    const [loadingStates, setLoadingStates] = useState({
        friendRequests: {},
        teamInvitations: {},
        mentorRequests: {},
        supervisorRequests: {}
    });

    // Animation variants
    const pageVariants = {
        initial: { opacity: 0 },
        animate: { 
            opacity: 1,
            transition: { 
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: i => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.4,
                ease: "easeOut"
            }
        }),
        hover: {
            y: -5,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
            transition: { duration: 0.2 }
        }
    };

    const buttonVariants = {
        hover: { 
            scale: 1.05,
            transition: { duration: 0.2 }
        },
        tap: { 
            scale: 0.95,
            transition: { duration: 0.1 }
        }
    };

    // Improved tab content transitions - fade in only, no exit animations
    const tabContentVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1, 
            transition: { 
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1.0],
                when: "beforeChildren"
            }
        }
    };

    const emptyStateVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { 
                delay: 0.1,
                duration: 0.4, 
                type: "spring", 
                stiffness: 100 
            }
        }
    };

    // Only fetch teams if user has permission and teams aren't already loaded
    useEffect(() => {
        if (activeTab === 'teams' && can.team_grouping && teams.length === 0) {
            fetchTeams();
        }
    }, [activeTab]);

    const fetchTeams = async () => {
        try {
            const response = await axios.get(route('teams.index'));
            setTeams(response.data.teams);
            setPendingTeamInvitations(response.data.pendingInvitations);
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    const handleTeamCreated = (newTeam) => {
        setTeams(currentTeams => [...currentTeams, newTeam]);
        setIsCreateTeamModalOpen(false);
        
        // Show success message (you can implement this)
        // For example, using a toast notification
    };

    const handleAcceptRequest = (requestId) => {
        // Set loading state
        setLoadingStates(prev => ({
            ...prev,
            friendRequests: { ...prev.friendRequests, [requestId]: 'accepting' }
        }));

        router.post(route('friend.accept', requestId), {}, {
            preserveScroll: true,
            onFinish: () => {
                // Clear loading state
                setLoadingStates(prev => ({
                    ...prev,
                    friendRequests: { ...prev.friendRequests, [requestId]: null }
                }));
            }
        });
    };

    const handleRejectRequest = (requestId) => {
        // Set loading state
        setLoadingStates(prev => ({
            ...prev,
            friendRequests: { ...prev.friendRequests, [requestId]: 'rejecting' }
        }));

        router.post(route('friend.reject', requestId), {}, {
            preserveScroll: true,
            onFinish: () => {
                // Clear loading state
                setLoadingStates(prev => ({
                    ...prev,
                    friendRequests: { ...prev.friendRequests, [requestId]: null }
                }));
            }
        });
    };

    // Filter friends based on active tab
    const filteredFriends = friends.filter(friend => {
        if (activeTab === 'all') return true;
        if (activeTab === 'pending') return friend.status === 'pending';
        if (activeTab === 'teams') return friend.status === 'accepted'; // For now, show accepted friends in teams tab
        return true;
    });

    // Function to determine if the current user is the receiver of the friend request
    const isRequestReceiver = (friend) => {
        return friend.friend_id === auth.user.id;
    };

    // Helper function to get the other user's info (not the current user)
    const getOtherUser = (friend) => {
        // If current user is the sender (user_id), show the receiver (friend)
        // If current user is the receiver (friend_id), show the sender (user)
        return friend.user_id === auth.user.id ? friend.friend : friend.user;
    };

    // Helper function to get profile photo path based on user role
    const getProfilePhotoPath = (user) => {
        if (!user) return null;
        
        if (user.student) {
            return user.student.profile_photo_path;
        } else if (user.lecturer) {
            return user.lecturer.profile_photo_path;
        } else if (user.department_staff) {
            return user.department_staff.profile_photo_path;
        } else if (user.organizer) {
            return user.organizer.profile_photo_path;
        }
        return null;
    };

    // Get only accepted friends and their info
    const acceptedFriends = friends
        .filter(friend => friend.status === 'accepted')
        .map(friend => {
            const otherUser = getOtherUser(friend);
            return {
                id: otherUser.id,
                name: otherUser.name,
                email: otherUser.email,
            };
        });

    // Modify the pending items filtering
    const pendingItems = [
        ...friends.filter(friend => friend.status === 'pending'),
        ...teams.filter(team => 
            team.members.some(member => 
                member.user_id === auth.user.id && 
                member.status === 'pending'
            )
        )
    ];

    // Add this function to handle team click
    const handleTeamClick = (team) => {
        setSelectedTeam(team);
        setIsTeamDetailsModalOpen(true);
    };

    const handleTeamDelete = async (teamId) => {
        try {
            await axios.delete(route('teams.destroy', teamId));
            setIsTeamDetailsModalOpen(false);
            
            // Redirect to teams tab and refresh data
            router.visit(route('friends.list', { tab: 'teams' }), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    fetchTeams(); // Refresh teams data
                }
            });
        } catch (error) {
            console.error('Error deleting team:', error);
            alert('Failed to delete team');
        }
    };

    // Update the friend requests filtering
    const incomingRequests = friends.filter(friend => 
        friend.status === 'pending' && friend.friend_id === auth.user.id
    );

    // Update the team invitation handlers
    const handleAcceptTeamInvitation = async (teamId) => {
        // Set loading state
        setLoadingStates(prev => ({
            ...prev,
            teamInvitations: { ...prev.teamInvitations, [teamId]: 'accepting' }
        }));

        try {
            await axios.post(route('teams.accept-invitation', teamId));
            // Close the dropdown first
            setIsTeamInvitationsOpen(false);
            
            // Redirect to teams tab and refresh data
            router.visit(route('friends.list', { tab: 'teams' }), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    fetchTeams(); // Refresh teams data
                },
                onFinish: () => {
                    // Clear loading state
                    setLoadingStates(prev => ({
                        ...prev,
                        teamInvitations: { ...prev.teamInvitations, [teamId]: null }
                    }));
                }
            });
        } catch (error) {
            console.error('Error accepting team invitation:', error);
            // Clear loading state on error
            setLoadingStates(prev => ({
                ...prev,
                teamInvitations: { ...prev.teamInvitations, [teamId]: null }
            }));
        }
    };

    const handleRejectTeamInvitation = async (teamId) => {
        // Set loading state
        setLoadingStates(prev => ({
            ...prev,
            teamInvitations: { ...prev.teamInvitations, [teamId]: 'rejecting' }
        }));

        try {
            await axios.post(route('teams.reject-invitation', teamId));
            // Close the dropdown first
            setIsTeamInvitationsOpen(false);
            
            // Redirect to teams tab and refresh data
            router.visit(route('friends.list', { tab: 'teams' }), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    fetchTeams(); // Refresh teams data
                },
                onFinish: () => {
                    // Clear loading state
                    setLoadingStates(prev => ({
                        ...prev,
                        teamInvitations: { ...prev.teamInvitations, [teamId]: null }
                    }));
                }
            });
        } catch (error) {
            console.error('Error rejecting team invitation:', error);
            // Clear loading state on error
            setLoadingStates(prev => ({
                ...prev,
                teamInvitations: { ...prev.teamInvitations, [teamId]: null }
            }));
        }
    };

    // Add the handler for removing team members
    const handleRemoveMember = async (teamId, userId) => {
        try {
            await axios.delete(route('teams.remove-member', { teamId, userId }));
            setIsTeamDetailsModalOpen(false);
            
            // Redirect to teams tab and refresh data
            router.visit(route('friends.list', { tab: 'teams' }), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    fetchTeams(); // Refresh teams data
                }
            });
        } catch (error) {
            console.error('Error removing team member:', error);
            alert('Failed to remove team member');
        }
    };

    // Add handler for opening AddToTeamModal
    const handleAddMember = (team) => {
        setSelectedTeamForMember(team);
        setIsAddToTeamModalOpen(true);
        setIsTeamDetailsModalOpen(false); // Close the details modal
    };

    // Add this to your existing handlers
    const handleAddMemberSuccess = () => {
        setIsAddToTeamModalOpen(false);
        setSelectedTeamForMember(null);
        
        // Redirect to teams tab and refresh data
        router.visit(route('friends.list', { tab: 'teams' }), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                fetchTeams(); // Refresh teams data
            }
        });
    };

    // Fetch lecturers for mentor tab
    useEffect(() => {
        if (activeTab === 'mentors' && userRelations?.isStudent) {
            fetchLecturers();
        }
    }, [activeTab]);

    const fetchLecturers = async () => {
        try {
            const response = await axios.get(route('lecturers.list'));
            setLecturers(response.data);
        } catch (error) {
            console.error('Error fetching lecturers:', error);
        }
    };

    // Handle mentor request
    const handleMentorRequest = (lecturer) => {
        setSelectedLecturer(lecturer);
        setIsMentorRequestModalOpen(true);
    };

    const handleMentorRequestSubmit = (message) => {
        return new Promise((resolve, reject) => {
            try {
                router.post(route('mentor.request', selectedLecturer.id), { message }, {
                    onSuccess: () => {
                        setIsMentorRequestModalOpen(false);
                        setSelectedLecturer(null);
                        fetchLecturers();
                        resolve();
                    },
                    onError: (errors) => {
                        console.error('Error sending mentor request:', errors);
                        reject(errors);
                    },
                    onFinish: () => {
                        // no-op; resolve handled above
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Connections" />
            <motion.div 
                className="py-12 bg-white"
                initial="initial"
                animate="animate"
                variants={pageVariants}
            >
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <motion.div 
                        className="bg-white rounded-2xl shadow-xl border border-orange-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="p-6">
                            <FriendTabs 
                                activeTab={activeTab} 
                                onTabChange={setActiveTab}
                                userRelations={userRelations}
                            />
                            {/* Friend suggestions moved below All Friends section */}
                            
                            {/* SearchBar for non-teams tabs */}
                            {activeTab !== 'teams' && activeTab !== 'mentors' && (
                                <motion.div 
                                    className="flex items-center justify-between mb-6"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                >
                                    <div className="flex-1">
                                        <SearchBar 
                                            value={searchQuery}
                                            onChange={setSearchQuery}
                                        />
                                    </div>
                                    
                                    <div className="relative ml-4 z-50">
                                        <motion.button
                                            onClick={() => setIsRequestsDropdownOpen(!isRequestsDropdownOpen)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg text-sm border border-orange-500 transition-all duration-200 shadow-lg"
                                        >
                                            <span className="material-symbols-outlined text-sm mr-2">
                                                person_add
                                            </span>
                                            Friend Requests
                                            {incomingRequests.length > 0 && (
                                                <motion.span 
                                                    className="ml-2 bg-red-500 px-2 py-0.5 rounded-full text-xs text-white"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ 
                                                        type: "spring", 
                                                        stiffness: 400, 
                                                        damping: 10 
                                                    }}
                                                >
                                                    {incomingRequests.length}
                                                </motion.span>
                                            )}
                                        </motion.button>

                                        <FriendRequestsDropdown
                                            isOpen={isRequestsDropdownOpen}
                                            onClose={() => setIsRequestsDropdownOpen(false)}
                                            friendRequests={incomingRequests}
                                            onAccept={handleAcceptRequest}
                                            onReject={handleRejectRequest}
                                            getOtherUser={getOtherUser}
                                            getProfilePhotoPath={getProfilePhotoPath}
                                            isRequestReceiver={isRequestReceiver}
                                            auth={auth}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Content based on active tab */}
                            <AnimatePresence mode="sync">
                                {activeTab === 'mentors' ? (
                                    <motion.div
                                        key="mentors"
                                        initial="hidden"
                                        animate="visible"
                                        variants={tabContentVariants}
                                        className="overflow-hidden"
                                    >
                                        {/* Search Bar for Mentors */}
                                        <motion.div 
                                            className="mb-6"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <SearchBar 
                                                value={searchQuery}
                                                onChange={setSearchQuery}
                                                placeholder="Search lecturers by name, department, or specialization..."
                                            />
                                        </motion.div>

                                        {/* Lecturers Grid */}
                                        <motion.div 
                                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                            variants={containerVariants}
                                        >
                                            {lecturers
                                                .filter(lecturer => 
                                                    lecturer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    lecturer.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    lecturer.specialization.toLowerCase().includes(searchQuery.toLowerCase())
                                                )
                                                .map((lecturer, index) => (
                                                    <motion.div
                                                        key={lecturer.id}
                                                        custom={index}
                                                        variants={itemVariants}
                                                        whileHover="hover"
                                                    >
                                                        <LecturerCard 
                                                            lecturer={lecturer}
                                                            onRequestMentor={() => handleMentorRequest(lecturer)}
                                                        />
                                                    </motion.div>
                                                ))
                                            }
                                            {lecturers.length === 0 && (
                                                <motion.div 
                                                    className="col-span-full"
                                                    variants={emptyStateVariants}
                                                >
                                                    <EmptyState 
                                                        icon="school"
                                                        message="No lecturers available" 
                                                        description="Check back later for available mentors"
                                                    />
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    </motion.div>
                                ) : activeTab === 'teams' ? (
                                    <motion.div
                                        key="teams"
                                        initial="hidden"
                                        animate="visible"
                                        variants={tabContentVariants}
                                        className="overflow-hidden"
                                    >
                                        {/* Search and Action Buttons Row */}
                                        <motion.div 
                                            className="flex items-center justify-between mb-6"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <div className="flex-1">
                                                <SearchBar 
                                                    value={searchQuery}
                                                    onChange={setSearchQuery}
                                                    placeholder="Search teams by name..."
                                                />
                                            </div>
                                                
                                            <div className="flex gap-4 ml-4">
                                                {/* Team Invitations Button with Dropdown */}
                                                <div className="relative z-50">
                                                    <motion.button
                                                        ref={teamInvitationsButtonRef}
                                                        onClick={() => setIsTeamInvitationsOpen(!isTeamInvitationsOpen)}
                                                        whileHover="hover"
                                                        whileTap="tap"
                                                        variants={buttonVariants}
                                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-lg text-sm border border-orange-400 hover:border-orange-500 transition-all duration-200 shadow-lg"
                                                    >
                                                        <span className="material-symbols-outlined text-sm mr-2">
                                                            mail
                                                        </span>
                                                        Team Invitations
                                                        {pendingTeamInvitations.length > 0 && (
                                                            <motion.span 
                                                                className="ml-2 bg-red-500 px-2 py-0.5 rounded-full text-xs text-white"
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ 
                                                                    type: "spring", 
                                                                    stiffness: 400, 
                                                                    damping: 10 
                                                                }}
                                                            >
                                                                {pendingTeamInvitations.length}
                                                            </motion.span>
                                                        )}
                                                    </motion.button>

                                                    <TeamInvitationsDropdown
                                                        isOpen={isTeamInvitationsOpen}
                                                        onClose={() => setIsTeamInvitationsOpen(false)}
                                                        pendingInvitations={pendingTeamInvitations}
                                                        onAccept={handleAcceptTeamInvitation}
                                                        onReject={handleRejectTeamInvitation}
                                                        buttonRef={teamInvitationsButtonRef}
                                                        auth={auth}
                                                        loadingStates={loadingStates.teamInvitations}
                                                    />
                                                </div>
                                                
                                                {/* Create Team Button */}
                                                <motion.button
                                                    onClick={() => setIsCreateTeamModalOpen(true)}
                                                    whileHover="hover"
                                                    whileTap="tap"
                                                    variants={buttonVariants}
                                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-lg text-sm border border-orange-400 hover:border-orange-500 transition-all duration-200 shadow-lg"
                                                >
                                                    <span className="material-symbols-outlined text-sm mr-2">
                                                        group_add
                                                    </span>
                                                    Create Team
                                                </motion.button>
                                            </div>
                                        </motion.div>

                                        {/* Teams Grid */}
                                        <motion.div 
                                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                            variants={containerVariants}
                                        >
                                            {teams
                                                .filter(team => team.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                                .map((team, index) => (
                                                    <motion.div
                                                        key={team.id}
                                                        custom={index}
                                                        variants={itemVariants}
                                                        whileHover="hover"
                                                    >
                                                        <TeamCard 
                                                            team={team}
                                                            status="accepted"
                                                            onClick={() => handleTeamClick(team)}
                                                        />
                                                    </motion.div>
                                                ))
                                            }
                                            {teams.length === 0 && (
                                                <motion.div 
                                                    className="col-span-full"
                                                    variants={emptyStateVariants}
                                                >
                                                    <EmptyState 
                                                        icon="groups"
                                                        message="No teams yet" 
                                                        description="Create a team to start collaborating with others"
                                                    />
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    </motion.div>
                                ) : activeTab === 'pending' ? (
                                    <motion.div 
                                        key="pending"
                                        initial="hidden"
                                        animate="visible"
                                        variants={tabContentVariants}
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden"
                                    >
                                        <motion.div 
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 col-span-full"
                                        >
                                            {friends.filter(friend => friend.status === 'pending').map((friend, index) => (
                                                <motion.div
                                                    key={`friend-${friend.id}`}
                                                    custom={index}
                                                    variants={itemVariants}
                                                    whileHover="hover"
                                                >
                                                    <FriendCard
                                                        friend={friend}
                                                        otherUser={getOtherUser(friend)}
                                                        photoPath={getProfilePhotoPath(getOtherUser(friend))}
                                                        isRequestReceiver={isRequestReceiver(friend)}
                                                        onAccept={handleAcceptRequest}
                                                        onReject={handleRejectRequest}
                                                    />
                                                </motion.div>
                                            ))}
                                            {!friends.some(friend => friend.status === 'pending') && (
                                                <motion.div 
                                                    className="col-span-full"
                                                    variants={emptyStateVariants}
                                                >
                                                    <EmptyState message="No pending friend requests" />
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        key="all"
                                        initial="hidden"
                                        animate="visible"
                                        variants={tabContentVariants}
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden"
                                    >
                                        <motion.div 
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 col-span-full"
                                        >
                                            {filteredFriends
                                                .filter(friend => friend.status === 'accepted')
                                                .filter(friend => {
                                                    const otherUser = getOtherUser(friend);
                                                    return otherUser.name.toLowerCase().includes(searchQuery.toLowerCase());
                                                })
                                                .map((friend, index) => {
                                                    const otherUser = getOtherUser(friend);
                                                    const photoPath = getProfilePhotoPath(otherUser);
                                                    return (
                                                        <motion.div
                                                            key={friend.id}
                                                            custom={index}
                                                            variants={itemVariants}
                                                            whileHover="hover"
                                                        >
                                                            <FriendCard
                                                                friend={friend}
                                                                otherUser={otherUser}
                                                                photoPath={photoPath}
                                                                isRequestReceiver={isRequestReceiver(friend)}
                                                                onAccept={handleAcceptRequest}
                                                                onReject={handleRejectRequest}
                                                                teams={teams}
                                                                isLoading={loadingStates.friendRequests[friend.id]}
                                                            />
                                                        </motion.div>
                                                    );
                                                })}
                                            {filteredFriends.filter(friend => friend.status === 'accepted').length === 0 && (
                                                <motion.div 
                                                    className="col-span-full"
                                                    variants={emptyStateVariants}
                                                >
                                                    <motion.div 
                                                        className="bg-white rounded-xl p-8 text-center border border-gray-200"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.2, duration: 0.5 }}
                                                    >
                                                        <motion.div 
                                                            className="flex flex-col items-center justify-center"
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ 
                                                                delay: 0.3, 
                                                                duration: 0.5, 
                                                                type: "spring", 
                                                                stiffness: 100 
                                                            }}
                                                        >
                                                            <motion.span 
                                                                className="material-symbols-outlined text-4xl text-orange-500 mb-2"
                                                                initial={{ rotateY: 90 }}
                                                                animate={{ rotateY: 0 }}
                                                                transition={{ 
                                                                    delay: 0.4, 
                                                                    duration: 0.6, 
                                                                    type: "spring" 
                                                                }}
                                                            >
                                                                group
                                                            </motion.span>
                                                            <motion.p 
                                                                className="text-orange-700"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: 0.5, duration: 0.5 }}
                                                            >
                                                                No friends added yet
                                                            </motion.p>
                                                            <motion.p 
                                                                className="text-orange-600 text-sm"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: 0.6, duration: 0.5 }}
                                                            >
                                                                Start by adding friends to your network
                                                            </motion.p>
                                                        </motion.div>
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                        {activeTab === 'all' && userRelations?.isStudent && friendSuggestions.length > 0 && (
                                            <motion.div
                                                style={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2, duration: 0.5 }}
                                                className="mt-6 col-span-full"
                                            >
                                                <h3 className="text-lg font-semibold text-orange-600 mb-3">Suggested Friends</h3>
                                                <div className="friend-suggestions grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {friendSuggestions.map((user, index) => (
                                                        <FriendSuggestionCard
                                                            key={user.id}
                                                            user={user}
                                                            index={index}
                                                        />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {can.team_grouping && (
                <CreateTeamModal 
                    isOpen={isCreateTeamModalOpen}
                    onClose={() => setIsCreateTeamModalOpen(false)}
                    friends={acceptedFriends}
                    onTeamCreated={handleTeamCreated}
                    auth={auth}
                />
            )}

            <TeamDetailsModal
                isOpen={isTeamDetailsModalOpen}
                onClose={() => setIsTeamDetailsModalOpen(false)}
                team={selectedTeam}
                onDelete={handleTeamDelete}
                onRemoveMember={handleRemoveMember}
                onAddMember={handleAddMember}
                auth={auth}
            />

            {/* Add the AddToTeamModal */}
            {isAddToTeamModalOpen && (
                <AddToTeamModal
                    isOpen={isAddToTeamModalOpen}
                    onClose={() => {
                        setIsAddToTeamModalOpen(false);
                        setSelectedTeamForMember(null);
                    }}
                    team={selectedTeamForMember}
                    onSuccess={handleAddMemberSuccess}
                />
            )}

            {/* Mentor Request Modal */}
            {isMentorRequestModalOpen && (
                <MentorRequestModal
                    isOpen={isMentorRequestModalOpen}
                    onClose={() => {
                        setIsMentorRequestModalOpen(false);
                        setSelectedLecturer(null);
                    }}
                    lecturer={selectedLecturer}
                    onSubmit={handleMentorRequestSubmit}
                />
            )}
        </AuthenticatedLayout>
    );
}
