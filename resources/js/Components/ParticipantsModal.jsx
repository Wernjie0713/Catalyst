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
    const [awardLevels, setAwardLevels] = useState({}); // Store award levels by user/team ID

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
            
            // If user is deselected, remove their award level
            if (!newSelection.includes(userId)) {
                setAwardLevels(prev => {
                    const newLevels = {...prev};
                    delete newLevels[userId];
                    return newLevels;
                });
            }
            
            return newSelection;
        });
    };

    const handleTeamSelection = (teamId) => {
        setSelectedTeams(prev => {
            const newSelection = prev.includes(teamId)
                ? prev.filter(id => id !== teamId)
                : [...prev, teamId]; 
            
            // If team is deselected, remove their award level
            if (!newSelection.includes(teamId)) {
                setAwardLevels(prev => {
                    const newLevels = {...prev};
                    delete newLevels[teamId];
                    return newLevels;
                });
            }
            
            return newSelection;
        });
    };
    
    const handleAwardLevelChange = (id, level) => {
        setAwardLevels(prev => ({
            ...prev,
            [id]: level
        }));
    };

    // Function to create participation certificates
    const handleCreateParticipationCertificates = () => {
        router.get(route('certificates.create', {
            event: event.event_id,
            participationCertificate: true
        }));
    };

    // Function to create winner certificates with award levels
    const handleCreateWinnerCertificates = () => {
        // Determine if we're dealing with teams or individual users
        if (event.is_team_event && activeTab === 'teams') {
            router.get(route('certificates.create', {
                event: event.event_id,
                teams: JSON.stringify(selectedTeams),
                awardLevels: JSON.stringify(awardLevels)
            }));
        } else {
            // Handle individual users
            router.get(route('certificates.create', {
                event: event.event_id,
                users: JSON.stringify(selectedUsers),
                awardLevels: JSON.stringify(awardLevels)
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
            <div className="p-8 bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-auto border border-orange-200">
                {/* Header Section with enhanced contrast */}
                <div className="relative mb-8">
                    <div className="absolute -top-12 -left-4 w-32 h-32 bg-orange-200/30 rounded-full filter blur-3xl"></div>
                    <div className="absolute -top-8 right-4 w-24 h-24 bg-orange-100/40 rounded-full filter blur-2xl"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                                Certificate Assignment
                            </h2>
                            <div className="px-4 py-1.5 rounded-full text-sm font-medium bg-orange-100 text-orange-700 backdrop-blur-sm border border-orange-200">
                                {event?.title}
                            </div>
                        </div>
                        <p className="text-gray-600">
                            Create certificates for participants and winners
                        </p>
                    </div>
                </div>

                {/* Certificate Type Cards with reduced height */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Participation Certificate Card - Reduced height */}
                    <div 
                        onClick={handleCreateParticipationCertificates}
                        className="group relative overflow-hidden rounded-2xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-br from-orange-500/20 to-orange-600/10 hover:from-orange-500/30 hover:to-orange-600/20 border border-orange-500/30 hover:border-orange-500/50"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/20 rounded-full filter blur-3xl group-hover:bg-orange-500/30 transition-all duration-300"></div>
                        <div className="relative">
                            <div className="flex items-center mb-2">
                                <span className="material-symbols-outlined text-orange-500 text-xl mr-2">
                                    groups
                                </span>
                                <h3 className="text-base font-semibold text-gray-800">
                                    Participation Certificates
                                </h3>
                            </div>
                            <p className="text-gray-600 text-xs leading-relaxed">
                                Generate certificates for all {event.is_team_event ? enrolledTeams.length + ' teams' : enrolledUsers.length + ' participants'}
                            </p>
                            <div className="mt-2 flex items-center text-orange-600 text-xs font-medium group-hover:text-orange-700 transition-colors">
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
                                ? 'cursor-pointer bg-gradient-to-br from-orange-400/30 to-orange-500/20 hover:from-orange-400/40 hover:to-orange-500/30 border border-orange-400/40 hover:border-orange-400/60' 
                                : 'bg-gray-100/50 border border-gray-200/50 cursor-not-allowed'
                        }`}
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-400/20 rounded-full filter blur-3xl group-hover:bg-orange-400/30 transition-all duration-300"></div>
                        <div className="relative">
                            <div className="flex items-center mb-2">
                                <span className="material-symbols-outlined text-orange-500 text-xl mr-2">
                                    emoji_events
                                </span>
                                <h3 className="text-base font-semibold text-gray-800">
                                    Winner Certificates
                                </h3>
                            </div>
                            <p className="text-gray-600 text-xs leading-relaxed">
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
                                <div className="mt-2 flex items-center text-orange-600 text-xs font-medium group-hover:text-orange-700 transition-colors">
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
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            }`}
                        >
                            Teams
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                activeTab === 'users'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
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
                            className="w-full px-4 py-2 pl-10 bg-orange-50 border border-orange-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all duration-200"
                        />
                        <span className="absolute left-3 top-2.5 material-symbols-outlined text-orange-500">
                            search
                        </span>
                    </div>
                    <div className="ml-4 px-4 py-2 bg-orange-100 rounded-lg border border-orange-300">
                        <span className="text-gray-700 text-sm">
                            Selected: <span className="text-orange-700 font-medium">
                                {activeTab === 'teams' ? selectedTeams.length : selectedUsers.length}
                            </span>
                        </span>
                        {(activeTab === 'teams' ? selectedTeams.length > 0 : selectedUsers.length > 0) && (
                            <button 
                                onClick={() => activeTab === 'teams' ? setSelectedTeams([]) : setSelectedTeams([])}
                                className="ml-3 text-xs text-orange-600 hover:text-orange-700 transition-colors"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                {/* Participants List with Tailwind scrollbar classes */}
                <div className="mb-6">
                    <div className="flex items-center mb-2">
                        <span className="text-gray-800 font-medium">Select Winners:</span>
                    </div>
                    <div className="h-[180px] overflow-y-auto pr-2 rounded-xl border border-orange-200 bg-orange-50/30
                         [&::-webkit-scrollbar]:w-[6px]
                         [&::-webkit-scrollbar-track]:bg-orange-100
                         [&::-webkit-scrollbar-track]:rounded-lg
                         [&::-webkit-scrollbar-track]:my-2
                         [&::-webkit-scrollbar-thumb]:bg-orange-400
                         [&::-webkit-scrollbar-thumb]:rounded-lg
                         [&::-webkit-scrollbar-thumb:hover]:bg-orange-500
                         scrollbar-thin
                         scrollbar-track-orange-100
                         scrollbar-thumb-orange-400">
                    {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
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
                                                ? 'bg-orange-100 border border-orange-300'
                                                : 'bg-white border border-orange-200 hover:bg-orange-50'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className={`w-10 h-10 rounded-xl ${
                                                    selectedTeams.includes(team.team_id || team.id)
                                                        ? 'bg-gradient-to-br from-orange-500 to-orange-600'
                                                        : 'bg-gradient-to-br from-gray-400 to-gray-500'
                                                    } flex items-center justify-center transition-all duration-300`}
                                                >
                                                    <span className="material-symbols-outlined text-white text-sm">
                                                        groups
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {team.team_name || team.name}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {team.members ? 
                                                        team.members.map(member => member.name).join(', ') : 
                                                        `${team.member_count || 0} members`}
                                                </p>
                                            </div>
                                        </div>
                                                
                                        <div className="flex items-center space-x-2">
                                            {selectedTeams.includes(team.team_id || team.id) && (
                                                <select 
                                                    value={awardLevels[team.team_id || team.id] || ''}
                                                    onChange={(e) => handleAwardLevelChange(team.team_id || team.id, e.target.value)}
                                                    className="bg-orange-100 border border-orange-400 rounded-lg text-gray-800 text-xs font-medium py-1.5 px-3"
                                                >
                                                    <option value="" className="bg-white text-gray-800">Select Medal</option>
                                                    <option value="gold" className="bg-white text-yellow-600">🥇 Gold Medal</option>
                                                    <option value="silver" className="bg-white text-gray-600">🥈 Silver Medal</option>
                                                    <option value="bronze" className="bg-white text-amber-700">🥉 Bronze Medal</option>
                                                </select>
                                            )}
                                            <button
                                                onClick={() => handleTeamSelection(team.team_id || team.id)}
                                                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                                                    selectedTeams.includes(team.team_id || team.id)
                                                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                                                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200 hover:text-orange-800'
                                                }`}
                                            >
                                                {selectedTeams.includes(team.team_id || team.id) ? 'Selected' : 'Select'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
                                    <span className="material-symbols-outlined text-orange-400 text-2xl">
                                        groups_off
                                    </span>
                                </div>
                                <p className="text-orange-600 text-sm">
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
                                                ? 'bg-orange-100 border border-orange-300'
                                                : 'bg-white border border-orange-200 hover:bg-orange-50'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className={`w-10 h-10 rounded-xl ${
                                                    selectedUsers.includes(user.id)
                                                        ? 'bg-gradient-to-br from-orange-500 to-orange-600'
                                                        : 'bg-gradient-to-br from-gray-400 to-gray-500'
                                                    } flex items-center justify-center transition-all duration-300`}
                                                >
                                                    <span className="text-white text-sm font-medium">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                                
                                        <div className="flex items-center space-x-2">
                                            {selectedUsers.includes(user.id) && (
                                                <select 
                                                    value={awardLevels[user.id] || ''}
                                                    onChange={(e) => handleAwardLevelChange(user.id, e.target.value)}
                                                    className="bg-orange-100 border border-orange-400 rounded-lg text-gray-800 text-xs font-medium py-1.5 px-3"
                                                >
                                                    <option value="" className="bg-white text-gray-800">Select Medal</option>
                                                    <option value="gold" className="bg-white text-yellow-600">🥇 Gold Medal</option>
                                                    <option value="silver" className="bg-white text-gray-600">🥈 Silver Medal</option>
                                                    <option value="bronze" className="bg-white text-white text-amber-700">🥉 Bronze Medal</option>
                                                </select>
                                            )}
                                            <button
                                                onClick={() => handleUserSelection(user.id)}
                                                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                                                    selectedUsers.includes(user.id)
                                                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                                                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200 hover:text-orange-800'
                                                }`}
                                            >
                                                {selectedUsers.includes(user.id) ? 'Selected' : 'Select'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
                                    <span className="material-symbols-outlined text-orange-400 text-2xl">
                                        person_off
                                    </span>
                                </div>
                                <p className="text-orange-600 text-sm">
                                    {searchTerm ? 'No matching participants found' : 'No enrolled users yet'}
                                </p>
                            </div>
                        )
                    )}
                    </div>
                </div>

                {/* Footer with enhanced button contrast */}
                <div className="mt-8 pt-6 border-t border-orange-200 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                         className="px-6 py-2.5 text-gray-600 border border-gray rounded-full  hover:text-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    {((activeTab === 'teams' && selectedTeams.length > 0) || (activeTab === 'users' && selectedUsers.length > 0)) && (
                        <button
                            onClick={handleCreateWinnerCertificates}
                            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg shadow-orange-500/25"
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