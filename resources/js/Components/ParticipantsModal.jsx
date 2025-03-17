import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function ParticipantsModal({ isOpen, onClose, event }) {
    if (!isOpen) return null;

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
                    <div className="fixed inset-0 bg-black/75" />
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-900 p-6 text-left align-middle shadow-xl transition-all border border-gray-800">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white mb-4">
                                    Participants - {event.title}
                                </Dialog.Title>

                                <div className="mt-2">
                                    {event.enrollments && event.enrollments.length > 0 ? (
                                        <div className="space-y-4">
                                            {event.enrollments.map((enrollment) => (
                                                <div 
                                                    key={enrollment.enrollment_id} 
                                                    className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        {enrollment.user.profile_photo_url ? (
                                                            <img 
                                                                src={enrollment.user.profile_photo_url} 
                                                                alt={enrollment.user.name}
                                                                className="h-8 w-8 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                                                                <span className="text-sm text-gray-300">
                                                                    {enrollment.user.name.charAt(0)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-sm font-medium text-white">
                                                                {enrollment.user.name}
                                                            </p>
                                                            <p className="text-xs text-gray-400">
                                                                {enrollment.user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 text-center py-4">No participants yet</p>
                                    )}
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors duration-200"
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