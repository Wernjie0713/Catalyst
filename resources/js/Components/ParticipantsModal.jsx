import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@/Components/Modal';
import { router } from '@inertiajs/react';

const ParticipantsModal = ({ event, isOpen, onClose, children }) => {
    const [enrolledUsers, setEnrolledUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showCertificateOptions, setShowCertificateOptions] = useState(true);

    useEffect(() => {
        if (isOpen && event) {
            fetchEnrolledUsers();
        }
    }, [isOpen, event]);

    const fetchEnrolledUsers = async () => {
        try {
            const response = await axios.get(route('events.enrolled-users', event.event_id));
            setEnrolledUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch enrolled users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserSelection = (userId) => {
        setSelectedUsers(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            }
            return [...prev, userId];
        });
    };

    const handleCreateCertificates = () => {
        router.get(route('certificates.create', {
            event: event.event_id,
            users: selectedUsers
        }));
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-6 bg-[#18122B] rounded-lg shadow-xl">
                {/* Header */}
                <div className="border-b border-gray-700/50 pb-4 mb-4">
                    <h2 className="text-xl font-semibold text-white">
                        Enrolled Users - {event?.title}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        {enrolledUsers.length} {enrolledUsers.length === 1 ? 'user' : 'users'} enrolled
                    </p>
                </div>

                {/* Certificate Assignment Section */}
                <div className="mb-4 pb-4 border-b border-gray-700/50">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-white">Certificate Assignment</h3>
                        <span className="text-sm text-gray-400">
                            Selected: {selectedUsers.length}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    ) : enrolledUsers.length > 0 ? (
                        enrolledUsers.map((user) => (
                            <div 
                                key={user.id} 
                                className={`group flex items-center justify-between p-4 bg-[#242031]/80 hover:bg-[#242031] rounded-xl transition-all duration-200 border ${
                                    selectedUsers.includes(user.id) 
                                        ? 'border-[#635985]' 
                                        : 'border-gray-700/30'
                                }`}
                            >
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => handleUserSelection(user.id)}
                                        className="rounded border-gray-700 text-[#635985] focus:ring-[#635985]"
                                    />
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-[#635985] flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white group-hover:text-[#635985] transition-colors">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
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
                                No enrolled users yet
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-700/50 flex justify-between">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setSelectedUsers([])}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            Clear Selection
                        </button>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreateCertificates}
                            disabled={selectedUsers.length === 0}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                ${selectedUsers.length === 0
                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#635985] text-white hover:bg-[#443C68]'
                                }
                            `}
                        >
                            Create Certificates
                        </button>
                    </div>
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

export default ParticipantsModal; 