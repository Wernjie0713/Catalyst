import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function CreateTeamModal({ isOpen, onClose, friends, onTeamCreated, auth }) {
    const [teamName, setTeamName] = useState('');
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const response = await axios.post(route('teams.store'), {
                name: teamName,
                members: selectedFriends
            });

            if (response.data.success) {
                onTeamCreated(response.data.team);
                setTeamName('');
                setSelectedFriends([]);
                onClose();
            }
        } catch (error) {
            setErrors(error.response?.data?.errors || {
                general: 'Failed to create team'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/80 via-gray-900/90 to-gray-950/95 p-6 text-left align-middle shadow-xl transition-all border border-white/10">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white mb-4">
                                    Create a New Team
                                </Dialog.Title>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Team Name Input */}
                                    <div>
                                        <label htmlFor="teamName" className="block text-sm font-medium text-gray-400 mb-2">
                                            Team Name
                                        </label>
                                        <input
                                            type="text"
                                            id="teamName"
                                            value={teamName}
                                            onChange={(e) => setTeamName(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-800/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/60"
                                            placeholder="Enter team name"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Friends Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Select Members
                                        </label>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                            {friends.map((friend) => (
                                                <div
                                                    key={friend.id}
                                                    className="flex items-center space-x-2 p-2 bg-gray-800/30 rounded-lg"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        id={`friend-${friend.id}`}
                                                        value={friend.id}
                                                        checked={selectedFriends.includes(friend.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedFriends([...selectedFriends, friend.id]);
                                                            } else {
                                                                setSelectedFriends(selectedFriends.filter(id => id !== friend.id));
                                                            }
                                                        }}
                                                        className="rounded border-gray-700 text-purple-500 focus:ring-purple-500/30 bg-gray-800"
                                                    />
                                                    <label htmlFor={`friend-${friend.id}`} className="text-white">
                                                        {friend.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.friends && (
                                            <p className="mt-1 text-sm text-red-400">{errors.friends}</p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 rounded-lg bg-gray-800/50 text-white text-sm hover:bg-gray-800/70 transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading || !teamName || selectedFriends.length === 0}
                                            className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 text-sm hover:bg-purple-500/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? 'Creating...' : 'Create Team'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
} 