import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Teams({ user }) {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get(route('teams.index'));
                setTeams(response.data.teams.filter(team => {
                    return team.members.some(member => 
                        member.user_id === user.id && 
                        member.status === 'accepted'
                    );
                }));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching teams:', err);
                setError('Failed to load teams');
                setLoading(false);
            }
        };

        fetchTeams();
    }, [user.id]);

    const handleTeamClick = (team) => {
        setSelectedTeam(team);
        setShowModal(true);
    };

    // Modal component for team details
    const TeamDetailsModal = ({ team, onClose }) => {
        if (!team) return null;

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[#0f1120] rounded-2xl p-8 max-w-lg w-full mx-4 relative">
                    <h2 className="text-2xl font-bold text-white mb-6">Team Details</h2>
                    
                    {/* Team Name */}
                    <div className="mb-6">
                        <h3 className="text-gray-400 mb-2">Team Name</h3>
                        <p className="text-xl text-white">{team.name}</p>
                    </div>

                    {/* Total Members */}
                    <div className="mb-6">
                        <h3 className="text-gray-400 mb-2">Total Members: {team.member_count}</h3>
                    </div>

                    {/* Team Leader */}
                    <div className="mb-6">
                        <h3 className="text-gray-400 mb-2">Team Leader</h3>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-yellow-400">military_tech</span>
                            <p className="text-white">{team.creator.name}</p>
                        </div>
                    </div>

                    {/* Team Members */}
                    <div className="mb-6">
                        <h3 className="text-gray-400 mb-2">Team Members ({team.members.length - 1})</h3>
                        <div className="space-y-2">
                            {team.members
                                .filter(member => member.user_id !== team.creator_id)
                                .map(member => (
                                    <div key={member.id} className="text-white">
                                        {member.user.name}
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-[200px] flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-400">Loading teams...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[200px] flex items-center justify-center text-red-400">
                {error}
            </div>
        );
    }

    if (teams.length === 0) {
        return (
            <div className="min-h-[200px] flex flex-col items-center justify-center gap-4">
                <span className="material-symbols-outlined text-4xl text-gray-400">group_off</span>
                <p className="text-gray-400">No teams found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Teams Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                    <div 
                        key={team.id} 
                        className="bg-[#1e1b4b]/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20"
                    >
                        {/* Header with Role and Date */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-purple-400">
                                    {team.creator_id === user.id ? 'military_tech' : 'group'}
                                </span>
                                <span className="text-gray-300">
                                    {team.creator_id === user.id ? 'Leader' : 'Member'}
                                </span>
                            </div>
                            <span className="text-gray-400 text-sm">
                                {team.created_at ? new Date(team.created_at).toLocaleDateString() : ''}
                            </span>
                        </div>

                        {/* Team Name */}
                        <h3 className="text-xl font-semibold text-white mb-1">
                            {team.name}
                        </h3>

                        {/* Team Stats */}
                        <div className="flex items-center justify-between mb-6 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-base">group</span>
                                <span>{team.member_count}</span>
                            </div>
                        </div>

                        {/* View Team Button */}
                        <button
                            onClick={() => handleTeamClick(team)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200"
                        >
                            <span className="material-symbols-outlined text-base">visibility</span>
                            View Team
                        </button>
                    </div>
                ))}
            </div>

            {/* Team Details Modal */}
            {showModal && (
                <TeamDetailsModal 
                    team={selectedTeam} 
                    onClose={() => {
                        setShowModal(false);
                        setSelectedTeam(null);
                    }} 
                />
            )}
        </div>
    );
}
