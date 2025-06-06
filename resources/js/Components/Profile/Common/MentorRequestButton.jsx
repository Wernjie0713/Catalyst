import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function MentorRequestButton({ lecturerId, mentorStatus: initialMentorStatus, mentorRequestId }) {
    const { data, setData, post, processing, reset } = useForm({
        message: ''
    });
    const [mentorStatus, setMentorStatus] = useState(initialMentorStatus);
    const [showMessageModal, setShowMessageModal] = useState(false);

    // Update local state when prop changes
    useEffect(() => {
        setMentorStatus(initialMentorStatus);
    }, [initialMentorStatus]);

    const handleMentorRequest = () => {
        console.log('Opening mentor request modal, current status:', mentorStatus);
        setShowMessageModal(true);
    };

    const submitMentorRequest = () => {
        console.log('Submitting mentor request from profile:', {
            lecturerId: lecturerId,
            message: data.message,
            messageLength: data.message.length,
            route: route('mentor.request', lecturerId)
        });

        post(route('mentor.request', lecturerId), {
            onSuccess: () => {
                console.log('Mentor request sent successfully from profile');
                setMentorStatus('pending');
                setShowMessageModal(false);
                reset();
            },
            onError: (errors) => {
                console.error('Error sending mentor request from profile:', errors);
            }
        });
    };

    // Render the appropriate button based on status
    const renderButton = () => {
        if (mentorStatus === 'accepted') {
            return (
                <button
                    className="inline-flex items-center px-4 py-2 bg-green-500/80 text-white rounded-xl text-sm font-medium backdrop-blur-sm"
                    disabled
                >
                    <span className="material-symbols-outlined text-lg mr-2">
                        school
                    </span>
                    Your Mentor
                </button>
            );
        }

        if (mentorStatus === 'pending') {
            return (
                <button
                    className="inline-flex items-center px-4 py-2 bg-yellow-500/80 text-white rounded-xl text-sm font-medium backdrop-blur-sm cursor-not-allowed"
                    disabled
                >
                    <span className="material-symbols-outlined text-lg mr-2">
                        hourglass_empty
                    </span>
                    Request Pending
                </button>
            );
        }

        if (mentorStatus === 'rejected') {
            return (
                <button
                    onClick={handleMentorRequest}
                    disabled={processing}
                    className="inline-flex items-center px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition-colors"
                >
                    <span className="material-symbols-outlined text-lg mr-2">
                        refresh
                    </span>
                    Request Again
                </button>
            );
        }

        // Default case - no existing request
        return (
            <button
                onClick={handleMentorRequest}
                disabled={processing}
                className="inline-flex items-center px-4 py-2 bg-[#635985]/80 hover:bg-[#635985] text-white rounded-xl text-sm font-medium transition-colors"
            >
                <span className="material-symbols-outlined text-lg mr-2">
                    person_add
                </span>
                Request Mentor
            </button>
        );
    };

    return (
        <>
            {renderButton()}

            {/* Message Modal - Always available */}
            {showMessageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Mentorship</h3>
                        <textarea
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            placeholder="Tell the lecturer why you'd like them as your mentor (optional)..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            rows="4"
                            maxLength="500"
                        />
                        <p className="text-xs text-gray-500 mt-1 mb-4">
                            {data.message.length}/500 characters
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setShowMessageModal(false);
                                    reset();
                                }}
                                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitMentorRequest}
                                disabled={processing}
                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {processing ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    'Send Request'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 