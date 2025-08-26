import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import TagDisplay from '@/Components/TagDisplay';
import { Link } from '@inertiajs/react';

const Shared = ({ event, isShared }) => {
    const enrollmentPercentage = event.is_team_event 
        ? (event.enrolled_teams_count / event.max_participants) * 100
        : (event.enrolled_count / event.max_participants) * 100;

    const pageVariants = {
        initial: {
            opacity: 0,
            y: 20
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <>
            <Head title={`${event.title} - Shared Event`} />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={pageVariants}
                    className="py-12"
                >
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mb-4"
                            >
                                <Link
                                    href="/"
                                    className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    <span className="material-symbols-outlined">arrow_back</span>
                                    <span>Back to Catalyst</span>
                                </Link>
                            </motion.div>
                            
                            <motion.h1
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl font-bold text-white mb-2"
                            >
                                {event.title}
                            </motion.h1>
                            
                            <motion.p
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-gray-400 text-lg"
                            >
                                {event.is_external ? `Organized by ${event.organizer_name}` : `Created by ${event.creator_name}`}
                            </motion.p>
                        </div>

                        {/* Event Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-[#1E1E2E] rounded-2xl shadow-2xl overflow-hidden"
                        >
                            {/* Cover Image */}
                            <div className="relative h-64 md:h-80">
                                <img
                                    src={event.cover_image ? `/${event.cover_image}` : '/default-event-image.jpg'}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E2E] via-transparent to-transparent" />
                                
                                {/* Status Badges */}
                                <div className="absolute top-4 right-4 flex flex-wrap gap-2">
                                    {event.is_external && (
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                            External Event
                                        </span>
                                    )}
                                    {event.is_team_event && (
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                            Team Event
                                        </span>
                                    )}
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                                        event.status === 'Upcoming' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                        event.status === 'Ongoing' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                        'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                    }`}>
                                        {event.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 md:p-8">
                                {/* Event Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                                            <span className="material-symbols-outlined mr-2 text-blue-400">calendar_today</span>
                                            Date & Time
                                        </h3>
                                        <p className="text-white text-lg">
                                            {format(new Date(event.date), 'MMMM dd, yyyy')} at {event.formatted_time}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                                            <span className="material-symbols-outlined mr-2 text-green-400">location_on</span>
                                            Location
                                        </h3>
                                        <p className="text-white text-lg">{event.location}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                                            <span className="material-symbols-outlined mr-2 text-purple-400">category</span>
                                            Event Type
                                        </h3>
                                        <p className="text-white text-lg">{event.event_type}</p>
                                    </div>

                                    {event.is_team_event && !event.is_external && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                                                <span className="material-symbols-outlined mr-2 text-amber-400">group</span>
                                                Team Requirements
                                            </h3>
                                            <p className="text-white text-lg">
                                                {event.min_team_members === event.max_team_members 
                                                    ? `Exactly ${event.min_team_members} members per team` 
                                                    : `${event.min_team_members}-${event.max_team_members} members per team`}
                                            </p>
                                        </div>
                                    )}

                                    {!event.is_external && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                                                <span className="material-symbols-outlined mr-2 text-indigo-400">
                                                    {event.is_team_event ? 'groups' : 'group'}
                                                </span>
                                                {event.is_team_event ? 'Team Enrollment Status' : 'Enrollment Status'}
                                            </h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-white">
                                                        {event.is_team_event 
                                                            ? `${event.enrolled_teams_count || 0} teams enrolled of ${event.max_participants} spots`
                                                            : `${event.enrolled_count} enrolled of ${event.max_participants} spots`
                                                        }
                                                    </span>
                                                    <span className="text-white">
                                                        {event.is_team_event
                                                            ? `${((event.enrolled_teams_count || 0) / event.max_participants * 100).toFixed(0)}%`
                                                            : `${((event.enrolled_count / event.max_participants) * 100).toFixed(0)}%`
                                                        }
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-3">
                                                    <div
                                                        className={`h-3 rounded-full ${
                                                            enrollmentPercentage >= 90 ? 'bg-red-500' :
                                                            enrollmentPercentage >= 75 ? 'bg-yellow-500' :
                                                            'bg-green-500'
                                                        }`}
                                                        style={{ width: `${Math.min(enrollmentPercentage, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {event.is_external && event.organizer_website && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                                                <span className="material-symbols-outlined mr-2 text-blue-400">language</span>
                                                Organizer Website
                                            </h3>
                                            <a 
                                                href={event.organizer_website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 transition-colors text-lg"
                                            >
                                                Visit Website
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="mb-8">
                                    <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
                                        <span className="material-symbols-outlined mr-2 text-gray-400">description</span>
                                        Description
                                    </h3>
                                    <p className="text-white text-lg leading-relaxed whitespace-pre-line">
                                        {event.description}
                                    </p>
                                </div>

                                {/* Event Tags */}
                                {event.label_tags && event.label_tags.length > 0 && (
                                    <div className="mb-8">
                                        <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
                                            <span className="material-symbols-outlined mr-2 text-indigo-400">label</span>
                                            Event Categories
                                        </h3>
                                        <TagDisplay 
                                            tags={event.label_tags} 
                                            maxDisplay={50}
                                            showCount={false}
                                            className="gap-2"
                                        />
                                    </div>
                                )}

                                {/* Call to Action */}
                                <div className="text-center pt-6 border-t border-gray-700">
                                    {event.is_external ? (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => window.open(event.registration_url, '_blank')}
                                            className="inline-flex items-center space-x-2 px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-lg font-medium"
                                        >
                                            <span className="material-symbols-outlined">open_in_new</span>
                                            <span>Register at External Site</span>
                                        </motion.button>
                                    ) : (
                                        <div className="space-y-4">
                                            <p className="text-gray-400">
                                                To enroll in this event, you need to be a registered user.
                                            </p>
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Link
                                                    href="/login"
                                                    className="inline-flex items-center space-x-2 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-lg font-medium"
                                                >
                                                    <span className="material-symbols-outlined">login</span>
                                                    <span>Login to Enroll</span>
                                                </Link>
                                            </motion.div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Footer */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="text-center mt-8 text-gray-400"
                        >
                            <p>This event was shared from Catalyst Energy</p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default Shared;
