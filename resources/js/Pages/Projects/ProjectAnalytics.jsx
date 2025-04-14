import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    ChartBarIcon, 
    ClockIcon, 
    ExclamationTriangleIcon,
    LightBulbIcon,
    DocumentTextIcon,
    ArrowLongLeftIcon
} from '@heroicons/react/24/outline';

export default function ProjectAnalytics({ project, analytics }) {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.1 
            }
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { 
                type: "spring", 
                stiffness: 100 
            }
        }
    };

    const progressVariants = {
        hidden: { width: 0 },
        visible: progress => ({
            width: `${progress}%`,
            transition: { duration: 1, ease: "easeOut" }
        })
    };

    const renderProgressTimeline = () => {
        if (!analytics.progress_timeline || analytics.progress_timeline.length === 0) {
            return <p className="text-gray-500">No progress data available</p>;
        }

        return (
            <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {analytics.progress_timeline.map((update, index) => (
                    <motion.div 
                        key={index} 
                        className="flex items-start bg-white/50 p-3 rounded-lg"
                        variants={itemVariants}
                    >
                        <div className="flex-shrink-0 w-24">
                            <span className="text-sm font-medium text-gray-600">{update.date}</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <motion.div 
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full" 
                                        custom={update.progress}
                                        variants={progressVariants}
                                        initial="hidden"
                                        animate="visible"
                                    />
                                </div>
                                <span className="ml-2 text-sm font-semibold text-gray-700">{update.progress}%</span>
                            </div>
                            <p className="mt-2 text-sm text-gray-600">{update.description}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        );
    };

    const renderCommonChallenges = () => {
        if (!analytics.common_challenges || Object.keys(analytics.common_challenges).length === 0) {
            return <p className="text-gray-500">No challenges reported</p>;
        }

        return (
            <motion.div 
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {Object.entries(analytics.common_challenges).map(([challenge, count], index) => (
                    <motion.div 
                        key={challenge} 
                        className="flex items-center justify-between p-3 bg-white/50 rounded-lg"
                        variants={itemVariants}
                    >
                        <span className="text-sm text-gray-700 font-medium">{challenge}</span>
                        <span className="text-sm font-bold bg-orange-100 text-orange-800 px-3 py-1 rounded-full">{count} times</span>
                    </motion.div>
                ))}
            </motion.div>
        );
    };

    const renderResourceRequests = () => {
        if (!analytics.resource_requests || Object.keys(analytics.resource_requests).length === 0) {
            return <p className="text-gray-500">No resource requests</p>;
        }

        return (
            <motion.div 
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {Object.entries(analytics.resource_requests).map(([resource, count], index) => (
                    <motion.div 
                        key={resource} 
                        className="flex items-center justify-between p-3 bg-white/50 rounded-lg"
                        variants={itemVariants}
                    >
                        <span className="text-sm text-gray-700 font-medium">{resource}</span>
                        <span className="text-sm font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{count} requests</span>
                    </motion.div>
                ))}
            </motion.div>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Project Analytics - ${project.title}`} />

            <div className="py-12 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Project Header */}
                    <motion.div 
                        className="bg-white overflow-hidden shadow-md rounded-xl mb-8 border border-gray-100"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                        <DocumentTextIcon className="h-7 w-7 text-indigo-500 mr-2" />
                                        {project.title}
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {project.type === 'team' ? 'Team Project' : 'Individual Project'}
                                    </p>
                                </div>
                                <Link
                                    href={route('projects.show', project.id)}
                                    className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium text-sm hover:bg-indigo-100 transition-colors duration-200"
                                >
                                    <ArrowLongLeftIcon className="h-4 w-4 mr-1" />
                                    Back to Project
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Analytics Grid */}
                    <motion.div 
                        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Update Frequency */}
                        <motion.div 
                            className="bg-gradient-to-br from-white to-gray-50 overflow-hidden shadow-md rounded-xl p-6 border border-gray-100"
                            variants={itemVariants}
                            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="flex items-center mb-5">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <ClockIcon className="h-6 w-6 text-blue-500" />
                                </div>
                                <h2 className="ml-3 text-lg font-bold text-gray-900">Update Frequency</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span className="text-sm font-medium text-gray-600">Average days between updates</span>
                                    <motion.span 
                                        className="text-sm font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3, type: "spring" }}
                                    >
                                        {analytics.update_frequency.average_days.toFixed(1)} days
                                    </motion.span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span className="text-sm font-medium text-gray-600">Last update</span>
                                    <motion.span 
                                        className="text-sm font-medium text-gray-900"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.4, type: "spring" }}
                                    >
                                        {analytics.update_frequency.last_update || 'Never'}
                                    </motion.span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Progress Timeline */}
                        <motion.div 
                            className="bg-gradient-to-br from-white to-gray-50 overflow-hidden shadow-md rounded-xl p-6 border border-gray-100"
                            variants={itemVariants}
                            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="flex items-center mb-5">
                                <div className="p-3 bg-indigo-50 rounded-lg">
                                    <ChartBarIcon className="h-6 w-6 text-indigo-500" />
                                </div>
                                <h2 className="ml-3 text-lg font-bold text-gray-900">Progress Timeline</h2>
                            </div>
                            {renderProgressTimeline()}
                        </motion.div>

                        {/* Common Challenges */}
                        <motion.div 
                            className="bg-gradient-to-br from-white to-gray-50 overflow-hidden shadow-md rounded-xl p-6 border border-gray-100"
                            variants={itemVariants}
                            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="flex items-center mb-5">
                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-orange-500" />
                                </div>
                                <h2 className="ml-3 text-lg font-bold text-gray-900">Common Challenges</h2>
                            </div>
                            {renderCommonChallenges()}
                        </motion.div>

                        {/* Resource Requests */}
                        <motion.div 
                            className="bg-gradient-to-br from-white to-gray-50 overflow-hidden shadow-md rounded-xl p-6 border border-gray-100"
                            variants={itemVariants}
                            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="flex items-center mb-5">
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <LightBulbIcon className="h-6 w-6 text-green-500" />
                                </div>
                                <h2 className="ml-3 text-lg font-bold text-gray-900">Resource Requests</h2>
                            </div>
                            {renderResourceRequests()}
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 