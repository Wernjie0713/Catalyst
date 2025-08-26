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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-orange-200">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-800 mb-4">
                                    Create a New Team
                                </Dialog.Title>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Team Name Input */}
                                    <div>
                                        <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
                                            Team Name
                                        </label>
                                        <input
                                            type="text"
                                            id="teamName"
                                            value={teamName}
                                            onChange={(e) => setTeamName(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-orange-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                                            placeholder="Enter team name"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Friends Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Members
                                        </label>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                            {friends.map((friend) => (
                                                <div
                                                    key={friend.id}
                                                    className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg border border-orange-100"
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
                                                        className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 bg-white"
                                                    />
                                                    <label htmlFor={`friend-${friend.id}`} className="text-gray-800">
                                                        {friend.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.friends && (
                                            <p className="mt-1 text-sm text-red-600">{errors.friends}</p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading || !teamName || selectedFriends.length === 0}
                                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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