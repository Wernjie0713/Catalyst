import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
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
import SupervisorInvitationsDropdown from '@/Components/Projects/SupervisorInvitationsDropdown';
import axios from 'axios';

export default function LecturerDashboard({ projects, pendingInvitations, stats, auth }) {
    const [statusFilter, setStatusFilter] = useState('all');
    const [isInvitationsDropdownOpen, setIsInvitationsDropdownOpen] = useState(false);
    // Mentor request UI removed from project dashboard
    
    // Loading states for different actions
    const [loadingStates, setLoadingStates] = useState({
        mentorRequests: {},
        supervisorRequests: {}
    });
    
    // Fetch mentor requests on component mount
    // Mentor requests moved to mentors/dashboard only

    // Animations removed to improve responsiveness

    // Handle mentor request responses
    const handleMentorResponse = async (requestId, action) => {
        // Set loading state
        setLoadingStates(prev => ({
            ...prev,
            mentorRequests: { ...prev.mentorRequests, [requestId]: action === 'accept' ? 'accepting' : 'rejecting' }
        }));

        try {
            await axios.post(route(`mentor.${action}`, requestId));
            setIsMentorRequestsDropdownOpen(false);
            fetchMentorRequests(); // Refresh the requests
        } catch (error) {
            console.error(`Error ${action}ing mentor request:`, error);
        } finally {
            // Clear loading state
            setLoadingStates(prev => ({
                ...prev,
                mentorRequests: { ...prev.mentorRequests, [requestId]: null }
            }));
        }
    };
    
    // Framer-motion variants removed for heavy sections (cards/table rows)
    
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

    // Accept/Reject handler
    const handleSupervisorResponse = (projectId, action) => {
        // Set loading state
        setLoadingStates(prev => ({
            ...prev,
            supervisorRequests: { ...prev.supervisorRequests, [projectId]: action === 'accept' ? 'accepting' : 'rejecting' }
        }));

        router.post(route(`projects.supervisor.${action}`, projectId), {}, {
            onSuccess: () => {
                router.reload();
            },
            onFinish: () => {
                // Clear loading state
                setLoadingStates(prev => ({
                    ...prev,
                    supervisorRequests: { ...prev.supervisorRequests, [projectId]: null }
                }));
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Project Dashboard" />

            <div className="py-12 bg-gray-50 min-h-screen isolate">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 relative">
                    {/* Dashboard Header */}
                    <div className="mb-8 flex items-center justify-between relative z-50">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                <AcademicCapIcon className="h-8 w-8 text-[#F37022] mr-3" />
                                Project Dashboard
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Track and manage all your supervised projects
                            </p>
                        </div>
                        <div className="flex gap-4 relative z-30">
                            {/* Mentor requests are available in mentors/dashboard */}
                            
                            {/* Supervisor Invitations Dropdown */}
                        <div className="relative">
                            <motion.button
                                onClick={() => setIsInvitationsDropdownOpen(!isInvitationsDropdownOpen)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center px-4 py-2 bg-[#F37022] hover:bg-orange-600 text-white rounded-lg text-sm border border-transparent transition-all duration-200 font-medium shadow"
                            >
                                <span className="material-symbols-outlined text-sm mr-2">
                                    mail
                                </span>
                                Supervisor Invitations
                                {pendingInvitations.length > 0 && (
                                    <motion.span 
                                        className="ml-2 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs shadow ring-1 ring-red-700/40"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ 
                                            type: "spring", 
                                            stiffness: 400, 
                                            damping: 10 
                                        }}
                                    >
                                        {pendingInvitations.length}
                                    </motion.span>
                                )}
                            </motion.button>
                            <SupervisorInvitationsDropdown
                                isOpen={isInvitationsDropdownOpen}
                                onClose={() => setIsInvitationsDropdownOpen(false)}
                                invitations={pendingInvitations}
                                onAccept={projectId => handleSupervisorResponse(projectId, 'accept')}
                                onReject={projectId => handleSupervisorResponse(projectId, 'reject')}
                                auth={auth}
                                loadingStates={loadingStates.supervisorRequests}
                            />
                            </div>
                        </div>
                    </div>
                
                    {/* Stats Overview */}
                    <div 
                        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8 relative z-10"
                    >
                        <div 
                            className="bg-white overflow-hidden shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-orange-500/10 rounded-lg">
                                    <DocumentTextIcon className="h-6 w-6 text-[#F37022]" />
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-sm font-medium text-[#F37022]">Total Projects</h2>
                                    <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.total}</p>
                                </div>
                            </div>
                        </div>

                        <div 
                            className="bg-white overflow-hidden shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-orange-500/10 rounded-lg">
                                    <CheckCircleIcon className="h-6 w-6 text-[#F37022]" />
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-sm font-medium text-[#F37022]">Completed</h2>
                                    <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.completed}</p>
                                </div>
                            </div>
                        </div>

                        <div 
                            className="bg-white overflow-hidden shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-orange-500/10 rounded-lg">
                                    <ClockIcon className="h-6 w-6 text-[#F37022]" />
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-sm font-medium text-[#F37022]">In Progress</h2>
                                    <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.in_progress}</p>
                                </div>
                            </div>
                        </div>

                        <div 
                            className="bg-white overflow-hidden shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-orange-500/10 rounded-lg">
                                    <ExclamationCircleIcon className="h-6 w-6 text-[#F37022]" />
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-sm font-medium text-[#F37022]">Overdue</h2>
                                    <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.overdue}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Projects Table */}
                    <div 
                        className="bg-white overflow-hidden shadow-md rounded-xl border border-gray-100"
                    >
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-wrap items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                    <DocumentTextIcon className="h-6 w-6 text-[#F37022] mr-2" />
                                    Supervised Projects
                                </h2>
                                
                                <div className="flex space-x-2 mt-4 sm:mt-0">
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setStatusFilter('all')}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                                            statusFilter === 'all' 
                                            ? 'bg-[#F37022] text-white shadow' 
                                            : 'border border-gray-300 text-gray-700 hover:border-[#F37022] hover:text-[#F37022]'
                                        }`}
                                    >
                                        All
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setStatusFilter('in_progress')}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                                            statusFilter === 'in_progress' 
                                            ? 'bg-[#F37022] text-white shadow' 
                                            : 'border border-gray-300 text-gray-700 hover:border-[#F37022] hover:text-[#F37022]'
                                        }`}
                                    >
                                        In Progress
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setStatusFilter('completed')}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                                            statusFilter === 'completed' 
                                            ? 'bg-[#F37022] text-white shadow' 
                                            : 'border border-gray-300 text-gray-700 hover:border-[#F37022] hover:text-[#F37022]'
                                        }`}
                                    >
                                        Completed
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setStatusFilter('on_hold')}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                                            statusFilter === 'on_hold' 
                                            ? 'bg-[#F37022] text-white shadow' 
                                            : 'border border-gray-300 text-gray-700 hover:border-[#F37022] hover:text-[#F37022]'
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
                                            <tr 
                                                key={project.id} 
                                                className={`${project.is_overdue ? 'bg-red-50' : ''} hover:bg-gray-50 transition-colors`}
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
                                                        <div 
                                                            className="bg-[#F37022] h-2.5 rounded-full transition-all" 
                                                            style={{ width: `${project.progress}%` }}
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
                                                        ? 'bg-red-500/10 text-red-700' 
                                                        : 'bg-[#F37022]/10 text-[#F37022]'
                                                    }`}>
                                                        {Math.floor(Math.abs(project.days_remaining))} days 
                                                        {project.days_remaining < 0 ? ' overdue' : ' remaining'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        href={route('projects.analytics', project.id)}
                                                        className="text-[#F37022] hover:text-orange-600 mr-4"
                                                    >
                                                        Analytics
                                                    </Link>
                                                    <Link
                                                        href={route('projects.show', project.id)}
                                                        className="text-[#F37022] hover:text-orange-600"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 