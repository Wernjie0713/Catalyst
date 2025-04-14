import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function Index({ auth, projects = [] }) {
    const [selectedProject, setSelectedProject] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: i => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.4,
                ease: "easeOut"
            }
        }),
        hover: {
            y: -5,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            transition: { duration: 0.2 }
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'low': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'critical': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'planning': return 'bg-blue-100 text-blue-800';
            case 'in_progress': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-emerald-100 text-emerald-800';
            case 'on_hold': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getProgressBarColor = (percentage) => {
        if (percentage >= 100) return 'bg-emerald-600';
        if (percentage >= 70) return 'bg-blue-600';
        if (percentage >= 30) return 'bg-yellow-600';
        return 'bg-indigo-600';
    };

    const determineStatus = (project) => {
        if (project.status === 'on_hold') return 'on_hold';
        if (project.progress_percentage === 0) return 'planning';
        if (project.progress_percentage === 100) return 'completed';
        return 'in_progress';
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM d, yyyy');
        } catch (error) {
            return 'Invalid date';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Project Dashboard</h2>}
        >
            <Head title="Projects" />

            <motion.div 
                className="py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <motion.div 
                        className="flex justify-between items-center mb-6"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h3 className="text-lg font-medium text-white">Your Projects</h3>
                        <Link href={route('projects.create')}>
                            <motion.div 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }}
                            >
                                <PrimaryButton>Create New Project</PrimaryButton>
                            </motion.div>
                        </Link>
                    </motion.div>

                    {projects.length === 0 ? (
                        <motion.div 
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <p className="text-gray-500 text-center">No projects found. Create your first project to get started!</p>
                        </motion.div>
                    ) : (
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {projects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    custom={index}
                                    variants={itemVariants}
                                    whileHover="hover"
                                    className="bg-white overflow-hidden shadow-sm sm:rounded-lg hover:shadow-md transition-shadow duration-300 cursor-pointer"
                                    onClick={() => {
                                        setSelectedProject(project);
                                        setShowModal(true);
                                    }}
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                                            <motion.span 
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(project.priority)}`}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
                                            >
                                                {project.priority}
                                            </motion.span>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm text-gray-500 mb-1">
                                                <span>Progress</span>
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.4 }}
                                                >
                                                    {project.progress_percentage || 0}%
                                                </motion.span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <motion.div
                                                    className={`h-2.5 rounded-full ${getProgressBarColor(project.progress_percentage || 0)}`}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${project.progress_percentage || 0}%` }}
                                                    transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
                                                ></motion.div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <motion.span 
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(determineStatus(project))}`}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                {(determineStatus(project)).replace('_', ' ')}
                                            </motion.span>
                                            <motion.span 
                                                className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                {project.type || 'individual'}
                                            </motion.span>
                                        </div>

                                        <motion.div 
                                            className="text-sm text-gray-500"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            <p>Start: {formatDate(project.start_date)}</p>
                                            {project.actual_end_date ? (
                                                <p>Completed: <span className="text-emerald-600 font-medium">{formatDate(project.actual_end_date)}</span></p>
                                            ) : (
                                                <p>Expected End: {formatDate(project.expected_end_date)}</p>
                                            )}
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </motion.div>

            <AnimatePresence>
                {showModal && (
                    <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="2xl">
                        {selectedProject && (
                            <motion.div 
                                className="p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <motion.h2 
                                        className="text-2xl font-bold text-gray-900"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1, duration: 0.3 }}
                                    >
                                        {selectedProject.title}
                                    </motion.h2>
                                    <div className="flex gap-2">
                                        <Link href={route('projects.show', selectedProject.id)}>
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <PrimaryButton>View Details</PrimaryButton>
                                            </motion.div>
                                        </Link>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <SecondaryButton onClick={() => setShowModal(false)}>Close</SecondaryButton>
                                        </motion.div>
                                    </div>
                                </div>

                                <motion.div 
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                >
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Project Information</h3>
                                        <div className="space-y-2">
                                            <p><span className="font-medium">Type:</span> {selectedProject.type || 'Individual'}</p>
                                            <p>
                                                <span className="font-medium">Status:</span> 
                                                <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(determineStatus(selectedProject))}`}>
                                                    {determineStatus(selectedProject).replace('_', ' ')}
                                                </span>
                                            </p>
                                            <p><span className="font-medium">Priority:</span> {selectedProject.priority || 'medium'}</p>
                                            <p><span className="font-medium">Start Date:</span> {formatDate(selectedProject.start_date)}</p>
                                            {selectedProject.actual_end_date ? (
                                                <p><span className="font-medium">Completed On:</span> <span className="text-emerald-600">{formatDate(selectedProject.actual_end_date)}</span></p>
                                            ) : (
                                                <p><span className="font-medium">Expected End:</span> {formatDate(selectedProject.expected_end_date)}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Progress</h3>
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm text-gray-500 mb-1">
                                                <span>Overall Progress</span>
                                                <span>{selectedProject.progress_percentage || 0}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <motion.div
                                                    className={`h-3 rounded-full ${getProgressBarColor(selectedProject.progress_percentage || 0)}`}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${selectedProject.progress_percentage || 0}%` }}
                                                    transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                                                ></motion.div>
                                            </div>
                                        </div>

                                        {selectedProject.team && selectedProject.team.members && (
                                            <div>
                                                <h4 className="font-medium mb-2">Team Members</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedProject.team.members.map((member, index) => (
                                                        <motion.span 
                                                            key={member.id} 
                                                            className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.3 + (index * 0.1), duration: 0.3 }}
                                                        >
                                                            {member.name}
                                                        </motion.span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.3 }}
                                >
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                                    <p className="text-gray-600">{selectedProject.description || 'No description provided.'}</p>
                                </motion.div>
                            </motion.div>
                        )}
                    </Modal>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
} 