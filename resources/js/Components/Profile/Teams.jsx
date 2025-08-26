import { useState, useEffect } from 'react';
import axios from 'axios';
import { createPortal } from 'react-dom';

export default function Teams({ user }) {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                // Fetch teams for the viewed user directly from backend
                const response = await axios.get(route('users.teams', user.id));
                setTeams(response.data.teams || []);
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
                <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 relative shadow-xl border border-orange-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Team Details</h2>
                    
                    {/* Team Name */}
                    <div className="mb-6">
                        <h3 className="text-gray-600 mb-2">Team Name</h3>
                        <p className="text-xl text-gray-800">{team.name}</p>
                    </div>

                    {/* Total Members */}
                    <div className="mb-6">
                        <h3 className="text-gray-600 mb-2">Total Members: {team.member_count}</h3>
                    </div>

                    {/* Team Leader */}
                    <div className="mb-6">
                        <h3 className="text-gray-600 mb-2">Team Leader</h3>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-orange-500">military_tech</span>
                            <p className="text-gray-800">{team.creator.name}</p>
                        </div>
                    </div>

                    {/* Team Members */}
                    <div className="mb-6">
                        <h3 className="text-gray-600 mb-2">Team Members ({team.members.length - 1})</h3>
                        <div className="space-y-2">
                            {team.members
                                .filter(member => member.user_id !== team.creator_id)
                                .map(member => (
                                    <div key={member.id} className="text-gray-800">
                                        {member.user.name}
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-orange-500"
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
                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600">Loading teams...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[200px] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-2">
                        <span className="material-symbols-outlined text-4xl">error</span>
                    </div>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (teams.length === 0) {
        return (
            <div className="min-h-[200px] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-orange-500 mb-2">
                        <span className="material-symbols-outlined text-4xl">group</span>
                    </div>
                    <p className="text-gray-600">No teams found</p>
                    <p className="text-gray-500 text-sm">This user hasn't joined any teams yet.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teams.map((team) => (
                        <div
                            key={team.id}
                            onClick={() => handleTeamClick(team)}
                            className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-6 border border-orange-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">{team.name}</h3>
                                <span className="material-symbols-outlined text-orange-500">group</span>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-500 text-sm">person</span>
                                    <span className="text-sm text-gray-600">{team.members.length} members</span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-500 text-sm">military_tech</span>
                                    <span className="text-sm text-gray-600">Leader: {team.creator.name}</span>
                                </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-orange-100">
                                <p className="text-xs text-gray-500">Click to view details</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal rendered outside the main container using portal */}
            {showModal && createPortal(
                <TeamDetailsModal
                    team={selectedTeam}
                    onClose={() => setShowModal(false)}
                />,
                document.body
            )}
        </>
    );
}
