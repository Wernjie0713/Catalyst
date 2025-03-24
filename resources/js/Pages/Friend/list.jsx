import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import FriendCard from '@/Components/Friend/FriendCard';
import FriendTabs from '@/Components/Friend/FriendTabs';
import EmptyState from '@/Components/Friend/EmptyState';
import { motion } from 'framer-motion';
import SearchBar from '@/Components/Friend/SearchBar';

export default function FriendsList({ auth, friends }) {
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'teams'
    const [searchQuery, setSearchQuery] = useState('');

    const handleAcceptRequest = (requestId) => {
        router.post(route('friend.accept', requestId), {}, {
            preserveScroll: true,
        });
    };

    const handleRejectRequest = (requestId) => {
        router.post(route('friend.reject', requestId), {}, {
            preserveScroll: true,
        });
    };

    // Filter friends based on active tab
    const filteredFriends = friends.filter(friend => {
        if (activeTab === 'all') return true;
        if (activeTab === 'pending') return friend.status === 'pending';
        if (activeTab === 'teams') return friend.status === 'accepted'; // For now, show accepted friends in teams tab
        return true;
    });

    // Function to determine if the current user is the receiver of the friend request
    const isRequestReceiver = (friend) => {
        return friend.friend_id === auth.user.id;
    };

    // Helper function to get the other user's info (not the current user)
    const getOtherUser = (friend) => {
        // If current user is the sender (user_id), show the receiver (friend)
        // If current user is the receiver (friend_id), show the sender (user)
        return friend.user_id === auth.user.id ? friend.friend : friend.user;
    };

    // Helper function to get profile photo path based on user role
    const getProfilePhotoPath = (user) => {
        if (!user) return null;
        
        // Debug the user object
        console.log('User data:', user);

        if (user.student) {
            return user.student.profile_photo_path;
        } else if (user.lecturer) {
            return user.lecturer.profile_photo_path;
        } else if (user.department_staff) {
            return user.department_staff.profile_photo_path;
        } else if (user.organizer) {
            return user.organizer.profile_photo_path;
        }
        return null;
    };

    // Update EmptyState messages for teams
    const getEmptyStateMessage = () => {
        switch (activeTab) {
            case 'pending':
                return "You don't have any pending friend requests.";
            case 'teams':
                return "You haven't created or joined any teams yet.";
            default:
                return "Start connecting with others!";
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Friends & Teams" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-gray-950/50 rounded-2xl backdrop-blur-sm border border-white/5">
                        <div className="p-6">
                            <FriendTabs 
                                activeTab={activeTab} 
                                onTabChange={setActiveTab} 
                            />
                            
                            {/* SearchBar moved below tabs */}
                            {activeTab !== 'teams' && (
                                <SearchBar 
                                    value={searchQuery}
                                    onChange={setSearchQuery}
                                />
                            )}

                            {/* Content based on active tab */}
                            {activeTab === 'teams' ? (
                                <div className="text-center py-8">
                                    <div className="bg-gradient-to-br from-gray-800/80 via-gray-900/90 to-gray-950/95 p-8 rounded-2xl backdrop-blur-md border border-white/5 max-w-md mx-auto">
                                        <span className="material-symbols-outlined text-4xl text-purple-400 mb-3">
                                            group_add
                                        </span>
                                        <h3 className="text-xl font-medium text-white mb-2">
                                            Create Your First Team
                                        </h3>
                                        <p className="text-gray-400 mb-4">
                                            Start collaborating by creating a team with your friends
                                        </p>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 text-white rounded-lg text-sm border border-white/10 hover:border-white/20 transition-all duration-200"
                                        >
                                            <span className="material-symbols-outlined text-sm mr-1">add</span>
                                            Create Team
                                        </motion.button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredFriends
                                        .filter(friend => {
                                            const otherUser = getOtherUser(friend);
                                            return otherUser.name.toLowerCase().includes(searchQuery.toLowerCase());
                                        })
                                        .map((friend) => {
                                            const otherUser = getOtherUser(friend);
                                            const photoPath = getProfilePhotoPath(otherUser);
                                            return (
                                                <FriendCard
                                                    key={friend.id}
                                                    friend={friend}
                                                    otherUser={otherUser}
                                                    photoPath={photoPath}
                                                    isRequestReceiver={isRequestReceiver(friend)}
                                                    onAccept={handleAcceptRequest}
                                                    onReject={handleRejectRequest}
                                                />
                                            );
                                        })}
                                </div>
                            )}

                            {filteredFriends.length === 0 && activeTab !== 'teams' && (
                                <EmptyState activeTab={activeTab} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
