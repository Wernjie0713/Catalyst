import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@/Components/Modal';
import { router } from '@inertiajs/react';

const ParticipantsModal = ({ event, isOpen, onClose }) => {
    const [enrolledUsers, setEnrolledUsers] = useState([]);
    const [enrolledTeams, setEnrolledTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'teams'

    useEffect(() => {
        if (isOpen && event) {
            fetchEnrolledUsers();
        }
    }, [isOpen, event]);

    const fetchEnrolledUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(route('events.enrolled-users', event.event_id));
            
            if (response.data.is_team_event) {
                setEnrolledTeams(response.data.teams || []);
                setActiveTab('teams');
            } else {
                setEnrolledUsers(response.data.users || response.data);
                setActiveTab('users');
            }
        } catch (error) {
            console.error('Failed to fetch enrolled users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserSelection = (userId) => {
        setSelectedUsers(prev => {
            const newSelection = prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]; 
            return newSelection;
        });
    };

    const handleTeamSelection = (teamId) => {
        setSelectedTeams(prev => {
            const newSelection = prev.includes(teamId)
                ? prev.filter(id => id !== teamId)
                : [...prev, teamId]; 
            return newSelection;
        });
    };

    // Function to create participation certificates
    const handleCreateParticipationCertificates = () => {
        router.get(route('certificates.create', {
            event: event.event_id,
            participationCertificate: true
        }));
    };

    // Function to create winner certificates
    const handleCreateWinnerCertificates = () => {
        // Determine if we're dealing with teams or individual users
        if (event.is_team_event && activeTab === 'teams') {
            router.get(route('certificates.create', {
                event: event.event_id,
                teams: JSON.stringify(selectedTeams)
            }));
        } else {
            // Handle individual users
            router.get(route('certificates.create', {
                event: event.event_id,
                users: JSON.stringify(selectedUsers)
            }));
        }
    };

    // Filter users based on search term
    const filteredUsers = searchTerm
        ? enrolledUsers.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : enrolledUsers;

    // Filter teams based on search term
    const filteredTeams = searchTerm
        ? enrolledTeams.filter(team =>
            team.team_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : enrolledTeams;

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-8 bg-gradient-to-br from-[#18122B] via-[#1e1935] to-[#2a1d4a] rounded-xl shadow-2xl max-w-3xl w-full mx-auto">
                {/* Header Section with enhanced contrast */}
                <div className="relative mb-8">
                    <div className="absolute -top-12 -left-4 w-32 h-32 bg-[#8B5CF6]/20 rounded-full filter blur-3xl"></div>
                    <div className="absolute -top-8 right-4 w-24 h-24 bg-[#7C3AED]/20 rounded-full filter blur-2xl"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-bold text-white tracking-tight">
                                Certificate Assignment
                            </h2>
                            <div className="px-4 py-1.5 rounded-full text-sm font-medium bg-[#8B5CF6]/20 text-white backdrop-blur-sm border border-[#8B5CF6]/40">
                                {event?.title}
                            </div>
                        </div>
                        <p className="text-gray-300">
                            Create certificates for participants and winners
                        </p>
                    </div>
                </div>

                {/* Certificate Type Cards with reduced height */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Participation Certificate Card - Reduced height */}
                    <div 
                        onClick={handleCreateParticipationCertificates}
                        className="group relative overflow-hidden rounded-2xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 hover:from-emerald-500/30 hover:to-emerald-600/20 border border-emerald-500/30 hover:border-emerald-500/50"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 rounded-full filter blur-3xl group-hover:bg-emerald-500/30 transition-all duration-300"></div>
                        <div className="relative">
                            <div className="flex items-center mb-2">
                                <span className="material-symbols-outlined text-emerald-400 text-xl mr-2">
                                    groups
                                </span>
                                <h3 className="text-base font-semibold text-white">
                                    Participation Certificates
                                </h3>
                            </div>
                            <p className="text-gray-300 text-xs leading-relaxed">
                                Generate certificates for all {event.is_team_event ? enrolledTeams.length + ' teams' : enrolledUsers.length + ' participants'}
                            </p>
                            <div className="mt-2 flex items-center text-emerald-400 text-xs font-medium group-hover:text-emerald-300 transition-colors">
                                <span>Create Now</span>
                                <span className="material-symbols-outlined ml-1 text-sm group-hover:translate-x-1 transition-transform">
                                    arrow_forward
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Winner Certificate Card - Reduced height */}
                    <div 
                        onClick={(event.is_team_event ? selectedTeams.length > 0 : selectedUsers.length > 0) ? handleCreateWinnerCertificates : undefined}
                        className={`group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 ${
                            (event.is_team_event ? selectedTeams.length > 0 : selectedUsers.length > 0) 
                                ? 'cursor-pointer bg-gradient-to-br from-[#7C3AED]/30 to-[#6D28D9]/20 hover:from-[#7C3AED]/40 hover:to-[#6D28D9]/30 border border-[#7C3AED]/40 hover:border-[#7C3AED]/60' 
                                : 'bg-gray-800/50 border border-gray-700/50 cursor-not-allowed'
                        }`}
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#8B5CF6]/20 rounded-full filter blur-3xl group-hover:bg-[#8B5CF6]/30 transition-all duration-300"></div>
                        <div className="relative">
                            <div className="flex items-center mb-2">
                                <span className="material-symbols-outlined text-[#A78BFA] text-xl mr-2">
                                    emoji_events
                                </span>
                                <h3 className="text-base font-semibold text-white">
                                    Winner Certificates
                                </h3>
                            </div>
                            <p className="text-gray-300 text-xs leading-relaxed">
                                {event.is_team_event ? (
                                    selectedTeams.length > 0 
                                        ? `Create certificates for ${selectedTeams.length} selected teams`
                                        : "Select teams below to create winner certificates"
                                ) : (
                                    selectedUsers.length > 0 
                                        ? `Create certificates for ${selectedUsers.length} selected winners`
                                        : "Select participants below to create winner certificates"
                                )}
                            </p>
                            {(event.is_team_event ? selectedTeams.length > 0 : selectedUsers.length > 0) && (
                                <div className="mt-2 flex items-center text-[#A78BFA] text-xs font-medium group-hover:text-white transition-colors">
                                    <span>Create Now</span>
                                    <span className="material-symbols-outlined ml-1 text-sm group-hover:translate-x-1 transition-transform">
                                        arrow_forward
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs for team events - Only show if this is a team event */}
                {event.is_team_event && (
                    <div className="flex space-x-2 mb-4">
                        <button
                            onClick={() => setActiveTab('teams')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                activeTab === 'teams'
                                    ? 'bg-[#8B5CF6]/50 text-white'
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                        >
                            Teams
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                activeTab === 'users'
                                    ? 'bg-[#8B5CF6]/50 text-white'
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                        >
                            Individual Participants
                        </button>
                    </div>
                )}

                {/* Search and Selection Header with improved visibility */}
                <div className="flex items-center justify-between mb-6">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder={`Search ${activeTab === 'teams' ? 'teams' : 'participants'}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 pl-10 bg-white/10 border border-[#8B5CF6]/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/50 transition-all duration-200"
                        />
                        <span className="absolute left-3 top-2.5 material-symbols-outlined text-[#A78BFA]">
                            search
                        </span>
                    </div>
                    <div className="ml-4 px-4 py-2 bg-white/10 rounded-lg border border-[#8B5CF6]/40">
                        <span className="text-gray-300 text-sm">
                            Selected: <span className="text-white font-medium">
                                {activeTab === 'teams' ? selectedTeams.length : selectedUsers.length}
                            </span>
                        </span>
                        {(activeTab === 'teams' ? selectedTeams.length > 0 : selectedUsers.length > 0) && (
                            <button 
                                onClick={() => activeTab === 'teams' ? setSelectedTeams([]) : setSelectedUsers([])}
                                className="ml-3 text-xs text-[#A78BFA] hover:text-white transition-colors"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                {/* Participants List with Tailwind scrollbar classes */}
                <div className="mb-6">
                    <div className="h-[180px] overflow-y-auto pr-2 rounded-xl border border-white/10 bg-white/5
                         [&::-webkit-scrollbar]:w-[6px]
                         [&::-webkit-scrollbar-track]:bg-white/5
                         [&::-webkit-scrollbar-track]:rounded-lg
                         [&::-webkit-scrollbar-track]:my-2
                         [&::-webkit-scrollbar-thumb]:bg-purple-500/30
                         [&::-webkit-scrollbar-thumb]:rounded-lg
                         [&::-webkit-scrollbar-thumb:hover]:bg-purple-500/50
                         scrollbar-thin
                         scrollbar-track-gray-800/10
                         scrollbar-thumb-purple-500/30">
                    {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#8B5CF6] border-t-transparent"></div>
                            </div>
                    ) : activeTab === 'teams' ? (
                        // Teams View
                        filteredTeams.length > 0 ? (
                            <div className="space-y-2 p-2">
                                {filteredTeams.map((team) => (
                                    <div 
                                        key={team.team_id || team.id} 
                                        className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                                            selectedTeams.includes(team.team_id || team.id) 
                                                ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]/50'
                                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className={`w-10 h-10 rounded-xl ${
                                                    selectedTeams.includes(team.team_id || team.id)
                                                        ? 'bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9]'
                                                        : 'bg-gradient-to-br from-gray-600 to-gray-700'
                                                    } flex items-center justify-center transition-all duration-300`}
                                                >
                                                    <span className="material-symbols-outlined text-white text-sm">
                                                        groups
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">
                                                    {team.team_name || team.name}
                                                </p>
                                                <p className="text-xs text-gray-300">
                                                    {team.members ? 
                                                        team.members.map(member => member.name).join(', ') : 
                                                        `${team.member_count || 0} members`}
                                                </p>
                                            </div>
                                        </div>
                                                
                                        <button
                                            onClick={() => handleTeamSelection(team.team_id || team.id)}
                                            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                                                selectedTeams.includes(team.team_id || team.id)
                                                    ? 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED]'
                                                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                                            }`}
                                        >
                                            {selectedTeams.includes(team.team_id || team.id) ? 'Selected' : 'Select'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                                    <span className="material-symbols-outlined text-gray-400 text-2xl">
                                        groups_off
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    {searchTerm ? 'No matching teams found' : 'No teams enrolled yet'}
                                </p>
                            </div>
                        )
                    ) : (
                        // Users View
                        filteredUsers.length > 0 ? (
                            <div className="space-y-2 p-2">
                                {filteredUsers.map((user) => (
                                    <div 
                                        key={user.id} 
                                        className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                                            selectedUsers.includes(user.id) 
                                                ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]/50'
                                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className={`w-10 h-10 rounded-xl ${
                                                    selectedUsers.includes(user.id)
                                                        ? 'bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9]'
                                                        : 'bg-gradient-to-br from-gray-600 to-gray-700'
                                                    } flex items-center justify-center transition-all duration-300`}
                                                >
                                                    <span className="text-white text-sm font-medium">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-300">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                                
                                        <button
                                            onClick={() => handleUserSelection(user.id)}
                                            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                                                selectedUsers.includes(user.id)
                                                    ? 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED]'
                                                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                                            }`}
                                        >
                                            {selectedUsers.includes(user.id) ? 'Selected' : 'Select'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                                    <span className="material-symbols-outlined text-gray-400 text-2xl">
                                        person_off
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    {searchTerm ? 'No matching participants found' : 'No enrolled users yet'}
                                </p>
                            </div>
                        )
                    )}
                    </div>
                </div>

                {/* Footer with enhanced button contrast */}
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-gray-300 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    {((activeTab === 'teams' && selectedTeams.length > 0) || (activeTab === 'users' && selectedUsers.length > 0)) && (
                        <button
                            onClick={handleCreateWinnerCertificates}
                            className="px-6 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white rounded-lg hover:from-[#7C3AED] hover:to-[#5B21B6] transition-all duration-200 shadow-lg shadow-[#8B5CF6]/25"
                        >
                            Create Winner Certificates for {activeTab === 'teams' ? 'Teams' : 'Individuals'}
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ParticipantsModal; 