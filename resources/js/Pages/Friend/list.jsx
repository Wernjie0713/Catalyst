import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect } from 'react';
import FriendCard from '@/Components/Friend/FriendCard';
import FriendTabs from '@/Components/Friend/FriendTabs';
import EmptyState from '@/Components/Friend/EmptyState';
import { motion } from 'framer-motion';
import SearchBar from '@/Components/Friend/SearchBar';
import CreateTeamModal from '@/Components/Friend/CreateTeamModal';
import TeamCard from '@/Components/Friend/TeamCard';
import axios from 'axios';
import TeamDetailsModal from '@/Components/Friend/TeamDetailsModal';
import TeamInvitationCard from '@/Components/Friend/TeamInvitationCard';
import FriendRequestsDropdown from '@/Components/Friend/FriendRequestsDropdown';
import TeamInvitationsDropdown from '@/Components/Friend/TeamInvitationsDropdown';
import AddToTeamModal from '@/Components/Friend/AddToTeamModal';

export default function FriendsList({ auth, friends = [], teams: initialTeams = [], pendingInvitations = [], can }) {
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
    const [pendingTeamInvitations, setPendingTeamInvitations] = useState([]);
    const [isAddToTeamModalOpen, setIsAddToTeamModalOpen] = useState(false);
    const [selectedTeamForMember, setSelectedTeamForMember] = useState(null);

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
        router.post(route('friend.accept', requestId), {}, {
            preserveScroll: true,
        });
    };

    const handleRejectRequest = (requestId) => {
        router.post(route('friend.reject', requestId), {}, {
            preserveScroll: true,
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
                }
            });
        } catch (error) {
            console.error('Error accepting team invitation:', error);
        }
    };

    const handleRejectTeamInvitation = async (teamId) => {
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
                }
            });
        } catch (error) {
            console.error('Error rejecting team invitation:', error);
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

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Friends & Teams" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-gray-950/50 rounded-2xl backdrop-blur-sm border border-white/5">
                        <div className="p-6">
                            <FriendTabs 
                                activeTab={activeTab} 
                                onTabChange={setActiveTab}
                            />
                            
                            {/* SearchBar for non-teams tabs */}
                            {activeTab !== 'teams' && (
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex-1">
                                <SearchBar 
                                    value={searchQuery}
                                    onChange={setSearchQuery}
                                />
                                    </div>
                                    
                                    <div className="relative ml-4">
                                        <motion.button
                                            onClick={() => setIsRequestsDropdownOpen(!isRequestsDropdownOpen)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 text-white rounded-lg text-sm border border-white/10 hover:border-white/20 transition-all duration-200"
                                        >
                                            <span className="material-symbols-outlined text-sm mr-2">
                                                person_add
                                            </span>
                                            Friend Requests
                                            {incomingRequests.length > 0 && (
                                                <span className="ml-2 bg-red-500/30 px-2 py-0.5 rounded-full text-xs">
                                                    {incomingRequests.length}
                                                </span>
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
                                </div>
                            )}

                            {/* Content based on active tab */}
                            {activeTab === 'teams' ? (
                                <div>
                                    {/* Search and Action Buttons Row */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex-1">
                                            <SearchBar 
                                                value={searchQuery}
                                                onChange={setSearchQuery}
                                                placeholder="Search teams by name..."
                                            />
                                                </div>
                                                    
                                        <div className="flex gap-4 ml-4">
                                            {/* Team Invitations Button with Dropdown */}
                                            <div className="relative">
                                                        <motion.button
                                                    onClick={() => setIsTeamInvitationsOpen(!isTeamInvitationsOpen)}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-600/20 hover:from-orange-500/30 hover:to-red-600/30 text-white rounded-lg text-sm border border-white/10 hover:border-white/20 transition-all duration-200"
                                                        >
                                                    <span className="material-symbols-outlined text-sm mr-2">
                                                                mail
                                                            </span>
                                                    Team Invitations
                                                    {pendingTeamInvitations.length > 0 && (
                                                            <span className="ml-2 bg-red-500/30 px-2 py-0.5 rounded-full text-xs">
                                                            {pendingTeamInvitations.length}
                                                            </span>
                                                    )}
                                                </motion.button>

                                                <TeamInvitationsDropdown
                                                    isOpen={isTeamInvitationsOpen}
                                                    onClose={() => setIsTeamInvitationsOpen(false)}
                                                    pendingInvitations={pendingTeamInvitations}
                                                    onAccept={handleAcceptTeamInvitation}
                                                    onReject={handleRejectTeamInvitation}
                                                    auth={auth}
                                                />
                                            </div>
                                                    
                                                    {/* Create Team Button */}
                                                    <motion.button
                                                        onClick={() => setIsCreateTeamModalOpen(true)}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 text-white rounded-lg text-sm border border-white/10 hover:border-white/20 transition-all duration-200"
                                                    >
                                                <span className="material-symbols-outlined text-sm mr-2">
                                                    group_add
                                                </span>
                                                        Create Team
                                                    </motion.button>
                                        </div>
                                    </div>

                                    {/* Teams Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {teams
                                            .filter(team => team.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                            .map((team) => (
                                            <TeamCard 
                                                key={team.id} 
                                                team={team}
                                                status="accepted"
                                                onClick={() => handleTeamClick(team)}
                                            />
                                            ))
                                        }
                                        {teams.length === 0 && (
                                            <div className="col-span-full">
                                                <EmptyState 
                                                    icon="groups"
                                                    message="No teams yet" 
                                                    description="Create a team to start collaborating with others"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : activeTab === 'pending' ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {friends.filter(friend => friend.status === 'pending').map((friend) => (
                                                <FriendCard
                                                    key={`friend-${friend.id}`}
                                                    friend={friend}
                                                    otherUser={getOtherUser(friend)}
                                                    photoPath={getProfilePhotoPath(getOtherUser(friend))}
                                                    isRequestReceiver={isRequestReceiver(friend)}
                                                    onAccept={handleAcceptRequest}
                                                    onReject={handleRejectRequest}
                                                />
                                            ))}
                                            {!friends.some(friend => friend.status === 'pending') && (
                                                <div className="col-span-full">
                                                    <EmptyState message="No pending friend requests" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredFriends
                                        .filter(friend => friend.status === 'accepted')
                                        .filter(friend => {
                                            const otherUser = getOtherUser(friend);
                                            return otherUser.name.toLowerCase().includes(searchQuery.toLowerCase());
                                        })
                                        .map((friend) => {
                                            const otherUser = getOtherUser(friend);
                                            const photoPath = getProfilePhotoPath(otherUser);
                                            return (
                                                <FriendCard
                                                    key={friend.id}
                                                    friend={friend}
                                                    otherUser={otherUser}
                                                    photoPath={photoPath}
                                                    isRequestReceiver={isRequestReceiver(friend)}
                                                    onAccept={handleAcceptRequest}
                                                    onReject={handleRejectRequest}
                                                    teams={teams}
                                                />
                                            );
                                        })}
                                    {filteredFriends.filter(friend => friend.status === 'accepted').length === 0 && (
                                        <div className="col-span-full">
                                            <div className="bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-gray-950/30 rounded-xl p-6 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">
                                                        group
                                                    </span>
                                                    <p className="text-gray-400">No friends added yet</p>
                                                    <p className="text-gray-500 text-sm">
                                                        Start by adding friends to your network
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

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
        </AuthenticatedLayout>
    );
}
