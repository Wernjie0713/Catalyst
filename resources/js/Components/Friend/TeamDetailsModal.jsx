import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function TeamDetailsModal({ isOpen, onClose, team, onDelete, onRemoveMember, onAddMember, auth }) {
    if (!team) return null;

    // Filter for accepted members excluding creator
    const acceptedMembers = team.members.filter(member => 
        member.status === 'accepted' && member.user_id !== team.creator_id
    );

    // Calculate total accepted members (including creator)
    const totalMembers = acceptedMembers.length + 1; // +1 for creator

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
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
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
                                {/* Header with Delete Button */}
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-white">Team Details</h2>
                                    {team?.creator_id === auth.user.id && (
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => onAddMember(team)}
                                                className="text-emerald-400 hover:text-emerald-300 transition-colors"
                                                title="Add Member"
                                            >
                                                <span className="material-symbols-outlined">person_add</span>
                                            </button>
                                            <button
                                                onClick={() => onDelete(team.id)}
                                                className="text-red-400 hover:text-red-300 transition-colors"
                                                title="Delete Team"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    {/* Team Name and Total Members */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-400 mb-2">Team Name</h4>
                                        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-3 rounded-lg border border-white/5">
                                            <p className="text-lg text-white font-medium">{team.name}</p>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-400 flex items-center">
                                            <span className="material-symbols-outlined text-sm mr-1">group</span>
                                            Total Members: {totalMembers}
                                        </div>
                                    </div>

                                    {/* Team Leader Section */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-400 mb-2">Team Leader</h4>
                                        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-3 rounded-lg border border-white/5">
                                            <div className="flex items-center space-x-2">
                                                <span className="material-symbols-outlined text-yellow-500">
                                                    star
                                                </span>
                                                <p className="text-white">{team.creator.name}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Team Members Section */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-400 mb-2">
                                            Team Members ({acceptedMembers.length})
                                        </h4>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                            {acceptedMembers.map((member) => (
                                                <div 
                                                    key={member.id} 
                                                    className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-3 rounded-lg border border-white/5 flex items-center justify-between"
                                                >
                                                    <span className="text-white">{member.user.name}</span>
                                                    {team.creator_id === auth?.user?.id && member.user_id !== team.creator_id && (
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to remove this member from the team?')) {
                                                                    onRemoveMember(team.id, member.user_id);
                                                                }
                                                            }}
                                                            className="text-red-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">
                                                                remove_circle
                                                            </span>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Close Button */}
                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors duration-200 border border-white/10"
                                        onClick={onClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
} 