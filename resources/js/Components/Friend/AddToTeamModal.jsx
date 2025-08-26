import { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function AddToTeamModal({ isOpen, onClose, team, onSuccess }) {
    const [availableFriends, setAvailableFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && team) {
            fetchAvailableFriends();
        }
    }, [isOpen, team]);

    const fetchAvailableFriends = async () => {
        try {
            const response = await axios.get(route('teams.available-friends', team.id));
            
            if (Array.isArray(response.data) && response.data.length === 0) {
                setError('No available friends found. They might all be in the team already.');
            } else if (!Array.isArray(response.data)) {
                setError('Invalid response format from server');
            } else {
                setAvailableFriends(response.data);
                setError('');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to load available friends');
            setAvailableFriends([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFriend) return;

        setIsLoading(true);
        setError('');

        try {
            await axios.post(route('teams.add-member'), {
                team_id: team.id,
                user_id: selectedFriend
            });

            onSuccess();
        } catch (error) {
            console.error('Error adding member:', error);
            setError(error.response?.data?.message || 'Failed to add member');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="sm">
            <div className="bg-white rounded-lg border border-orange-200">
                <div className="p-4">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Add to Team</h2>
                    </div>

                    {/* Team Name */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 mb-1">Team Name</label>
                        <div className="bg-orange-50 p-2.5 rounded-md border border-orange-200">
                            <p className="text-gray-800">{team?.name}</p>
                        </div>
                    </div>

                    {/* Select Friend Section */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 mb-1">Select Friend</label>
                        <div className="relative">
                            <select
                                value={selectedFriend}
                                onChange={(e) => setSelectedFriend(e.target.value)}
                                className="w-full bg-white text-gray-800 p-2.5 rounded-md border border-orange-200 focus:border-orange-500 focus:ring-0"
                                required
                            >
                                <option value="" className="bg-white">Choose a friend</option>
                                {availableFriends.map((friend) => (
                                    <option 
                                        key={friend.id} 
                                        value={friend.id}
                                        className="bg-white"
                                    >
                                        {friend.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 mt-4">
                        <motion.button
                            type="button"
                            onClick={onClose}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Close
                        </motion.button>
                        <motion.button
                            onClick={handleSubmit}
                            disabled={isLoading || !selectedFriend}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-md transition-colors shadow-md ${
                                isLoading || !selectedFriend ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? 'Adding...' : 'Add to Team'}
                        </motion.button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}