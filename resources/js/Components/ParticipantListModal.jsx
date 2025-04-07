import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@/Components/Modal';

const ParticipantListModal = ({ event, isOpen, onClose }) => {
    const [enrolledUsers, setEnrolledUsers] = useState([]);
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
            setEnrolledUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch enrolled users:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const filteredUsers = searchTerm 
        ? enrolledUsers.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : enrolledUsers;

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-6 bg-[#18122B] rounded-lg shadow-xl max-w-2xl w-full">
                {/* Header */}
                <div className="border-b border-gray-700/50 pb-4 mb-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">
                            Event Participants
                        </h2>
                        <div className="px-3 py-1 bg-indigo-500/20 rounded-full text-indigo-300 text-sm font-medium">
                            {enrolledUsers.length} / {event?.max_participants || '∞'}
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
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
                            className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-[#242031] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    ) : filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <div 
                                key={user.id} 
                                className="group flex items-center space-x-4 p-4 bg-[#242031]/80 hover:bg-[#242031] rounded-xl transition-all duration-200 border border-gray-700/30"
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                        <span className="text-white text-lg font-medium">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">
                                        {user.email}
                                    </p>
                                </div>
                                <a 
                                    href={route('profile.view', user.id)}
                                    className="px-3 py-1 text-xs font-medium text-indigo-400 border border-indigo-500/30 rounded-md hover:bg-indigo-500/10 transition-colors"
                                >
                                    View Profile
                                </a>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#242031] mb-4">
                                <span className="material-symbols-outlined text-gray-400 text-2xl">
                                    group_off
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                {searchTerm ? 'No matching participants found' : 'No enrolled users yet'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-700/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-[#635985] text-white rounded-md hover:bg-[#443C68] transition-colors"
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
    background: #18122B;
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #635985;
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #443C68;
}
`;

export default ParticipantListModal; 