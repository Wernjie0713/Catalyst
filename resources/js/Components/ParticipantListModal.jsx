import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@/Components/Modal';

const ParticipantListModal = ({ event, isOpen, onClose }) => {
    const [enrolledUsers, setEnrolledUsers] = useState([]);
    const [enrolledTeams, setEnrolledTeams] = useState([]);
    const [isTeamEvent, setIsTeamEvent] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    useEffect(() => {
        if (isOpen && event) {
            fetchEnrolledUsers();
        }
    }, [isOpen, event]);

    const fetchEnrolledUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(route('events.enrolled-users', event.event_id));
            const data = response.data;
            
            if (data.is_team_event) {
                setIsTeamEvent(true);
                setEnrolledTeams(data.teams || []);
                setEnrolledUsers([]);
            } else {
                setIsTeamEvent(false);
                setEnrolledUsers(data.users || []);
                setEnrolledTeams([]);
            }
        } catch (error) {
            console.error('Failed to fetch enrolled users:', error);
        } finally {
            setLoading(false);
        }
    };
    
    // Filter logic for both individual users and teams
    const filteredUsers = searchTerm && !isTeamEvent
        ? enrolledUsers.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : enrolledUsers;

    const filteredTeams = searchTerm && isTeamEvent
        ? enrolledTeams.filter(team =>
            team.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.leader.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.members.some(member => 
                member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
        : enrolledTeams;

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-6 bg-white rounded-lg shadow-xl max-w-2xl w-full border border-orange-200">
                {/* Header */}
                <div className="border-b border-orange-200 pb-4 mb-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Event Participants
                        </h2>
                        <div className="px-3 py-1 bg-orange-100 rounded-full text-orange-700 text-sm font-medium border border-orange-200">
                            {isTeamEvent 
                                ? `${enrolledTeams.length} teams / ${event?.max_participants || '∞'}`
                                : `${enrolledUsers.length} / ${event?.max_participants || '∞'}`
                            }
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        {event?.title}
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-orange-300 rounded-lg bg-orange-50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Search participants..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Participant List */}
                <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        </div>
                    ) : isTeamEvent ? (
                        // Team Event Display
                        filteredTeams.length > 0 ? (
                            filteredTeams.map((team) => (
                                <div 
                                    key={team.team_id} 
                                    className="group p-4 bg-orange-50/80 hover:bg-orange-100 rounded-xl transition-all duration-200 border border-orange-200"
                                >
                                    {/* Team Header */}
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-white">groups</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 group-hover:text-orange-700 transition-colors">
                                                {team.team_name}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                Leader: {team.leader} • {team.members.length} members
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Team Members */}
                                    <div className="ml-4 pl-4 border-l border-orange-300 space-y-2">
                                        {team.members.map((member) => (
                                            <div key={member.id} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                                                        <span className="text-white text-xs font-medium">
                                                            {member.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-800">{member.name}</p>
                                                        <p className="text-xs text-gray-600">{member.email}</p>
                                                    </div>
                                                </div>
                                                <a 
                                                    href={route('profile.view', member.id)}
                                                    className="px-2 py-1 text-xs font-medium text-orange-600 border border-orange-300 rounded hover:bg-orange-100 transition-colors"
                                                >
                                                    Profile
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
                                    <span className="material-symbols-outlined text-orange-400 text-2xl">
                                        group_off
                                    </span>
                                </div>
                                <p className="text-orange-600 text-sm">
                                    {searchTerm ? 'No matching teams found' : 'No enrolled teams yet'}
                                </p>
                            </div>
                        )
                    ) : (
                        // Individual Event Display
                        filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <div 
                                key={user.id} 
                                className="group flex items-center space-x-4 p-4 bg-orange-50/80 hover:bg-orange-100 rounded-xl transition-all duration-200 border border-orange-200"
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                        <span className="text-white text-lg font-medium">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 group-hover:text-orange-700 transition-colors">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-gray-600 truncate">
                                        {user.email}
                                    </p>
                                </div>
                                <a 
                                    href={route('profile.view', user.id)}
                                    className="px-3 py-1 text-xs font-medium text-orange-600 border border-orange-300 rounded-md hover:bg-orange-100 transition-colors"
                                >
                                    View Profile
                                </a>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
                                <span className="material-symbols-outlined text-orange-400 text-2xl">
                                    group_off
                                </span>
                            </div>
                            <p className="text-orange-600 text-sm">
                                {searchTerm ? 'No matching participants found' : 'No enrolled users yet'}
                            </p>
                        </div>
                        )
                    )}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-orange-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

// Add custom scrollbar styles to your CSS
const styles = `
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #fef3c7;
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #f97316;
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #ea580c;
}
`;

export default ParticipantListModal; 