import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    ChartBarIcon, 
    ClockIcon, 
    CheckCircleIcon, 
    ExclamationCircleIcon,
    UserGroupIcon,
    DocumentTextIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';

export default function LecturerDashboard({ projects, stats }) {
    const [statusFilter, setStatusFilter] = useState('all');
    
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                when: "beforeChildren",
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

    const cardVariants = {
        hidden: { scale: 0.9, opacity: 0 },
        visible: { 
            scale: 1, 
            opacity: 1,
            transition: { type: "spring", stiffness: 300 } 
        },
        hover: { 
            y: -5,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            transition: { type: "spring", stiffness: 300 }
        }
    };

    const progressVariants = {
        hidden: { width: 0 },
        visible: progress => ({
            width: `${progress}%`,
            transition: { duration: 1, ease: "easeOut" }
        })
    };

    const tableRowVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: i => ({ 
            opacity: 1, 
            x: 0,
            transition: { 
                delay: i * 0.05,
                duration: 0.3
            }
        }),
        hover: { 
            backgroundColor: "rgba(243, 244, 246, 0.7)",
            transition: { duration: 0.2 }
        }
    };
    
    const getStatusColor = (status) => {
        const colors = {
            'planning': 'bg-gray-100 text-gray-800',
            'in_progress': 'bg-blue-100 text-blue-800',
            'completed': 'bg-green-100 text-green-800',
            'on_hold': 'bg-yellow-100 text-yellow-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'low': 'bg-green-100 text-green-800',
            'medium': 'bg-yellow-100 text-yellow-800',
            'high': 'bg-orange-100 text-orange-800',
            'critical': 'bg-red-100 text-red-800'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    const filteredProjects = projects.filter(project => {
        if (statusFilter === 'all') return true;
        return project.status === statusFilter;
    });

    return (
        <AuthenticatedLayout>
            <Head title="Project Dashboard" />

            <div className="py-12 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Dashboard Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <AcademicCapIcon className="h-8 w-8 text-indigo-600 mr-3" />
                            Project Dashboard
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Track and manage all your supervised projects
                        </p>
                    </motion.div>
                
                    {/* Stats Overview */}
                    <motion.div 
                        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div 
                            className="bg-gradient-to-br from-white to-blue-50 overflow-hidden shadow-md rounded-xl p-6 border border-blue-100"
                            variants={cardVariants}
                            whileHover="hover"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-sm font-medium text-blue-600">Total Projects</h2>
                                    <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.total}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="bg-gradient-to-br from-white to-green-50 overflow-hidden shadow-md rounded-xl p-6 border border-green-100"
                            variants={cardVariants}
                            whileHover="hover"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-sm font-medium text-green-600">Completed</h2>
                                    <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.completed}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="bg-gradient-to-br from-white to-yellow-50 overflow-hidden shadow-md rounded-xl p-6 border border-yellow-100"
                            variants={cardVariants}
                            whileHover="hover"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-sm font-medium text-yellow-600">In Progress</h2>
                                    <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.in_progress}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="bg-gradient-to-br from-white to-red-50 overflow-hidden shadow-md rounded-xl p-6 border border-red-100"
                            variants={cardVariants}
                            whileHover="hover"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-sm font-medium text-red-600">Overdue</h2>
                                    <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.overdue}</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Projects Table */}
                    <motion.div 
                        className="bg-white overflow-hidden shadow-md rounded-xl border border-gray-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-wrap items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                    <DocumentTextIcon className="h-6 w-6 text-indigo-500 mr-2" />
                                    Supervised Projects
                                </h2>
                                
                                <div className="flex space-x-2 mt-4 sm:mt-0">
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setStatusFilter('all')}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                                            statusFilter === 'all' 
                                            ? 'bg-indigo-100 text-indigo-700' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        All
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setStatusFilter('in_progress')}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                                            statusFilter === 'in_progress' 
                                            ? 'bg-blue-100 text-blue-700' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        In Progress
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setStatusFilter('completed')}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                                            statusFilter === 'completed' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        Completed
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setStatusFilter('on_hold')}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                                            statusFilter === 'on_hold' 
                                            ? 'bg-yellow-100 text-yellow-700' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        On Hold
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student/Team</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Update</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Remaining</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredProjects.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No projects match the selected filter.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredProjects.map((project, index) => (
                                            <motion.tr 
                                                key={project.id} 
                                                custom={index}
                                                variants={tableRowVariants}
                                                initial="hidden"
                                                animate="visible"
                                                whileHover="hover"
                                                className={project.is_overdue ? 'bg-red-50 hover:bg-red-100' : ''}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{project.title}</div>
                                                    <div className="text-sm text-gray-500">{project.type}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{project.student_name}</div>
                                                    {project.team_name && (
                                                        <div className="text-sm text-gray-500">{project.team_name}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(project.status)}`}>
                                                        {project.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <motion.div 
                                                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full" 
                                                            custom={project.progress}
                                                            variants={progressVariants}
                                                            initial="hidden"
                                                            animate="visible"
                                                        />
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-1">{project.progress}%</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {project.last_update}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                                        project.days_remaining < 0 
                                                        ? 'bg-red-100 text-red-800' 
                                                        : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {Math.floor(Math.abs(project.days_remaining))} days 
                                                        {project.days_remaining < 0 ? ' overdue' : ' remaining'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        href={route('projects.analytics', project.id)}
                                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                                    >
                                                        Analytics
                                                    </Link>
                                                    <Link
                                                        href={route('projects.show', project.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 