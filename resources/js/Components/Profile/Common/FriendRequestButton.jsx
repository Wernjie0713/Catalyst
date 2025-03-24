import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function FriendRequestButton({ userId, friendStatus: initialFriendStatus, friendRequestId }) {
    const { post, processing } = useForm();
    const [friendStatus, setFriendStatus] = useState(initialFriendStatus);

    // Update local state when prop changes
    useEffect(() => {
        setFriendStatus(initialFriendStatus);
    }, [initialFriendStatus]);

    const handleFriendRequest = () => {
        post(route('friend.request', userId), {}, {
            onSuccess: () => {
                setFriendStatus('pending');
            },
        });
    };

    const handleAcceptRequest = () => {
        post(route('friend.accept', friendRequestId));
    };

    const handleRejectRequest = () => {
        post(route('friend.reject', friendRequestId));
    };

    if (friendStatus === 'accepted') {
        return (
            <button
                className="inline-flex items-center px-4 py-2 bg-green-500/80 text-white rounded-xl text-sm font-medium backdrop-blur-sm"
                disabled
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Friends
            </button>
        );
    }

    if (friendStatus === 'pending') {
        return (
            <button
                className="inline-flex items-center px-4 py-2 bg-gray-500/80 text-white rounded-xl text-sm font-medium backdrop-blur-sm cursor-not-allowed"
                disabled
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Request Pending
            </button>
        );
    }

    return (
        <button
            onClick={handleFriendRequest}
            disabled={processing}
            className="inline-flex items-center px-4 py-2 bg-[#635985]/80 hover:bg-[#635985] text-white rounded-xl text-sm font-medium transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
            Add Friend
        </button>
    );
} 