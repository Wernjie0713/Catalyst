import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import TiltedEventCard from '@/Components/TiltedEventCard';
import FriendSuggestionCard from '@/Components/FriendSuggestionCard';
import DisplayProfilePhoto from '@/Components/Profile/Common/DisplayProfilePhoto';
import SearchBar from '@/Components/SearchBar';

export default function Dashboard() {
    const { auth, stats, recentEvents, friendSuggestions } = usePage().props;

    const getWelcomeMessage = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    const defaultProfileIcon = (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="material-symbols-outlined text-4xl">person</span>
        </div>
    );

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <motion.div 
                        className="mb-8"
                        style={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">
                                    {getWelcomeMessage()}, {auth.user.name}
                                </h2>
                                <p className="text-gray-400">
                                    Welcome to your {auth.user.roles[0]?.title || 'dashboard'}
                                </p>
                            </div>
                            
                            {/* Search Bar in right corner */}
                            <div className="w-72">
                                <SearchBar />
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                        style={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.7 }}
                    >
                        <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl p-6 backdrop-blur-md border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 group">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <span className="text-gray-400 text-sm font-medium">Total Events</span>
                                    <h3 className="text-3xl font-bold text-white">{stats?.totalEvents || 0}</h3>
                                </div>
                                <div className="bg-blue-500/10 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-blue-400">event</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl p-6 backdrop-blur-md border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5 group">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <span className="text-gray-400 text-sm font-medium">Upcoming Events</span>
                                    <h3 className="text-3xl font-bold text-white">{stats?.upcomingEvents || 0}</h3>
                                </div>
                                <div className="bg-green-500/10 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-green-400">upcoming</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-500/10 to-red-600/10 rounded-2xl p-6 backdrop-blur-md border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5 group">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <span className="text-gray-400 text-sm font-medium">My Events</span>
                                    <h3 className="text-3xl font-bold text-white">{stats?.myEvents || 0}</h3>
                                </div>
                                <div className="bg-orange-500/10 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-orange-400">work_history</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-pink-500/10 to-purple-600/10 rounded-2xl p-6 backdrop-blur-md border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/5 group">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <span className="text-gray-400 text-sm font-medium">Enrolled Events</span>
                                    <h3 className="text-3xl font-bold text-white">{stats?.enrolledEvents || 0}</h3>
                                </div>
                                <div className="bg-pink-500/10 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-pink-400">how_to_reg</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Recent Events Section */}
                    <motion.div
                        style={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-white">Recent Events</h2>
                            <motion.a
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                href={route('events.index')}
                                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center space-x-1"
                            >
                                <span>View All</span>
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </motion.a>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recentEvents?.filter(event => event.status !== 'Completed').map((event) => (
                                <motion.div 
                                    key={event.event_id}
                                    style={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <TiltedEventCard 
                                        event={event} 
                                        onEventUpdate={(updatedEvent) => {
                                            // Handle event updates if needed
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Friend Suggestions Section - Only for Students */}
                    {auth.user.roles[0]?.name === 'student' && friendSuggestions.length > 0 && (
                        <motion.div
                            style={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.7 }}
                            className="mt-12"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-white">Friend Suggestions</h2>
                            </div>

                            <div className="friend-suggestions grid grid-cols-1 md:grid-cols-3 gap-4">
                                {friendSuggestions.map((user, index) => (
                                    <FriendSuggestionCard 
                                        key={user.id}
                                        user={user}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
