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
                className="py-12 bg-gray-50 min-h-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <motion.div 
                        className="flex justify-between items-center mb-8"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Projects</h3>
                            <p className="text-gray-600">Manage and track your academic projects</p>
                        </div>
                        <Link href={route('projects.create')}>
                            <motion.div 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }}
                            >
                                <PrimaryButton className="px-6 py-3 bg-[#F37022] hover:bg-orange-600 border-[#F37022] hover:border-orange-600 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                                    <span className="material-symbols-outlined mr-2">add_task</span>
                                    Create New Project
                                </PrimaryButton>
                            </motion.div>
                        </Link>
                    </motion.div>

                    {projects.length === 0 ? (
                        <motion.div 
                            className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="text-center py-16 px-8">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
                                    <span className="material-symbols-outlined text-3xl text-[#F37022]">folder_open</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Your Project Journey</h3>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    You haven't created any projects yet. Begin your academic journey by creating your first project 
                                    and collaborating with mentors and team members.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <Link href={route('projects.create')}>
                                        <motion.div 
                                            whileHover={{ scale: 1.05 }} 
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <PrimaryButton className="px-8 py-3 bg-[#F37022] hover:bg-orange-600 border-[#F37022] hover:border-orange-600 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                                                <span className="material-symbols-outlined mr-2">add_task</span>
                                                Create Your First Project
                                            </PrimaryButton>
                                        </motion.div>
                                    </Link>
                                    <Link href={route('friends.list', { tab: 'mentors' })}>
                                        <motion.div 
                                            whileHover={{ scale: 1.05 }} 
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <SecondaryButton className="px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold transition-all duration-200">
                                                <span className="material-symbols-outlined mr-2">group_add</span>
                                                Find Mentors
                                            </SecondaryButton>
                                        </motion.div>
                                    </Link>
                                </div>
                                
                                {/* Feature highlights */}
                                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                                    <motion.div 
                                        className="text-center p-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                                            <span className="material-symbols-outlined text-blue-600">school</span>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Academic Excellence</h4>
                                        <p className="text-sm text-gray-600">Work on meaningful projects that enhance your academic portfolio</p>
                                    </motion.div>
                                    
                                    <motion.div 
                                        className="text-center p-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                                            <span className="material-symbols-outlined text-green-600">group</span>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Team Collaboration</h4>
                                        <p className="text-sm text-gray-600">Collaborate with peers and mentors for better learning outcomes</p>
                                    </motion.div>
                                    
                                    <motion.div 
                                        className="text-center p-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                                            <span className="material-symbols-outlined text-purple-600">trending_up</span>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Track Progress</h4>
                                        <p className="text-sm text-gray-600">Monitor your project progress and milestones effectively</p>
                                    </motion.div>
                                </div>
                            </div>
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
                                    className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
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
                                className="p-0"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Header Section */}
                                <div className="bg-gradient-to-r from-[#F37022] to-orange-500 p-6 text-white rounded-t-lg">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                                <span className="material-symbols-outlined text-2xl">folder</span>
                                            </div>
                                            <div>
                                                <motion.h2 
                                                    className="text-3xl font-bold"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1, duration: 0.3 }}
                                                >
                                                    {selectedProject.title}
                                                </motion.h2>
                                                <motion.p 
                                                    className="text-orange-100 mt-1"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.2, duration: 0.3 }}
                                                >
                                                    {selectedProject.type || 'Individual'} Project
                                                </motion.p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Link href={route('projects.show', selectedProject.id)}>
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <PrimaryButton className="bg-white text-[#F37022] hover:bg-gray-100 border-white hover:border-gray-100 font-semibold">
                                                        <span className="material-symbols-outlined mr-2 text-[#F37022]">visibility</span>
                                                        <span className="text-[#F37022]">View Details</span>
                                                    </PrimaryButton>
                                                </motion.div>
                                            </Link>
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <SecondaryButton 
                                                    onClick={() => setShowModal(false)}
                                                    className="bg-white/20 text-white border-white/30 hover:bg-white/30 font-semibold"
                                                >
                                                    <span className="material-symbols-outlined mr-2">close</span>
                                                    Close
                                                </SecondaryButton>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6">
                                    <motion.div 
                                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.4 }}
                                    >
                                        {/* Project Information Card */}
                                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                <span className="material-symbols-outlined text-[#F37022] mr-2">info</span>
                                                Project Information
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">Type</span>
                                                    <span className="text-sm font-medium text-gray-900">{selectedProject.type || 'Individual'}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">Status</span>
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(determineStatus(selectedProject))}`}>
                                                        {determineStatus(selectedProject).replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">Priority</span>
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedProject.priority || 'medium')}`}>
                                                        {selectedProject.priority || 'medium'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">Start Date</span>
                                                    <span className="text-sm font-medium text-gray-900">{formatDate(selectedProject.start_date)}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">
                                                        {selectedProject.actual_end_date ? 'Completed' : 'Expected End'}
                                                    </span>
                                                    <span className={`text-sm font-medium ${selectedProject.actual_end_date ? 'text-emerald-600' : 'text-gray-900'}`}>
                                                        {selectedProject.actual_end_date ? formatDate(selectedProject.actual_end_date) : formatDate(selectedProject.expected_end_date)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress Card */}
                                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                <span className="material-symbols-outlined text-[#F37022] mr-2">trending_up</span>
                                                Progress Overview
                                            </h3>
                                            <div className="mb-4">
                                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                    <span>Overall Progress</span>
                                                    <span className="font-semibold text-gray-900">{selectedProject.progress_percentage || 0}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                    <motion.div
                                                        className={`h-3 rounded-full ${getProgressBarColor(selectedProject.progress_percentage || 0)}`}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${selectedProject.progress_percentage || 0}%` }}
                                                        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                                                    ></motion.div>
                                                </div>
                                            </div>
                                            
                                            {/* Progress Status */}
                                            <div className="text-center">
                                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                    (selectedProject.progress_percentage || 0) === 0 ? 'bg-gray-100 text-gray-600' :
                                                    (selectedProject.progress_percentage || 0) === 100 ? 'bg-emerald-100 text-emerald-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    <span className="material-symbols-outlined text-sm mr-1">
                                                        {(selectedProject.progress_percentage || 0) === 0 ? 'schedule' :
                                                         (selectedProject.progress_percentage || 0) === 100 ? 'check_circle' : 'play_arrow'}
                                                    </span>
                                                    {(selectedProject.progress_percentage || 0) === 0 ? 'Not Started' :
                                                     (selectedProject.progress_percentage || 0) === 100 ? 'Completed' : 'In Progress'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Team Members Card - Only show if team exists */}
                                        {selectedProject.team && selectedProject.team.members && (
                                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 md:col-span-2">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                    <span className="material-symbols-outlined text-[#F37022] mr-2">group</span>
                                                    Team Members
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {selectedProject.team.members.map((member, index) => (
                                                        <motion.div 
                                                            key={member.id} 
                                                            className="flex items-center space-x-3 p-2 bg-white rounded-lg border border-gray-100"
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.3 + (index * 0.1), duration: 0.3 }}
                                                        >
                                                            <div className="w-8 h-8 bg-[#F37022] rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                                {member.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-900">{member.name}</span>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Description Section */}
                                    <motion.div
                                        className="bg-gray-50 rounded-xl p-5 border border-gray-100"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.3 }}
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <span className="material-symbols-outlined text-[#F37022] mr-2">description</span>
                                            Project Description
                                        </h3>
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <p className="text-gray-700 leading-relaxed">
                                                {selectedProject.description || 'No description provided for this project.'}
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </Modal>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
} 