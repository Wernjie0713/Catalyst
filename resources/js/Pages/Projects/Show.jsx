import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const statusColors = {
    planning: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
    in_progress: 'bg-blue-100 text-blue-800 border border-blue-200',
    completed: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    on_hold: 'bg-amber-100 text-amber-800 border border-amber-200',
};

const priorityColors = {
    low: 'bg-slate-100 text-slate-800 border border-slate-200',
    medium: 'bg-blue-100 text-blue-800 border border-blue-200',
    high: 'bg-orange-100 text-orange-800 border border-orange-200',
    critical: 'bg-rose-100 text-rose-800 border border-rose-200',
};

export default function Show({ auth, project, available_mentors }) {

    const [currentProgress, setCurrentProgress] = useState(0);
    const [currentStatus, setCurrentStatus] = useState('planning');
    
    const { data, setData, post, put, processing, errors, reset } = useForm({
        progress_description: '',
        progress_percentage: 0,
        milestones_completed: '',
        challenges_faced: '',
        resources_needed: '',
        accepted_resources: '',
        supervisor_id: '',
    });

    const [isDragging, setIsDragging] = useState(false);
    const [newItem, setNewItem] = useState({
        milestone: '',
        challenge: '',
        resource: '',
        acceptedResource: ''
    });
    
    const [activeTab, setActiveTab] = useState('info');

    // Add section for accepted resources
    const [acceptedResources, setAcceptedResources] = useState([]);

    // Determine status based on progress percentage
    const determineStatus = (progress) => {
        if (project.status === 'on_hold') return 'on_hold';
        if (progress === 0) return 'planning';
        if (progress === 100) return 'completed';
        return 'in_progress';
    };

    // Initialize progress when component mounts or project changes
    useEffect(() => {
        console.log('Project progress:', project?.progress_percentage); // Debug log
        const progress = project?.progress_percentage ?? 0;
        setCurrentProgress(progress);
        setData('progress_percentage', progress);
        setCurrentStatus(determineStatus(progress));

        // Initialize acceptedResources from the project data if available
        if (project?.unresolvedResources) {
            setAcceptedResources([]);
        }
    }, [project]);
    
    // Add debug information for project updates
    useEffect(() => {
        if (project?.updates?.length > 0) {
            console.log('Project updates:', project.updates);
            
            // Check for missing updatedBy data
            const updatesMissingUser = project.updates.filter(update => 
                !update.updatedBy || !update.updatedBy.name
            );
            
            if (updatesMissingUser.length > 0) {
                console.warn('Updates missing user information:', updatesMissingUser);
            }
        }
    }, [project]);
    
    // Update status when progress changes in the form
    useEffect(() => {
        setCurrentStatus(determineStatus(data.progress_percentage));
    }, [data.progress_percentage]);

    // Prevent access to add tab if project is completed
    useEffect(() => {
        if (project.status === 'completed' && activeTab === 'add') {
            setActiveTab('info');
            console.log('Project is completed - redirecting from add update tab');
        }
    }, [activeTab, project.status]);

    const handleProgressBarClick = (e) => {
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.round((x / rect.width) * 100);
        const newProgress = Math.min(100, Math.max(0, percentage));
        setData('progress_percentage', newProgress);
        setCurrentProgress(newProgress);
    };

    const handleProgressBarDrag = (e) => {
        if (isDragging) {
            const progressBar = e.currentTarget;
            const rect = progressBar.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = Math.round((x / rect.width) * 100);
            const newProgress = Math.min(100, Math.max(0, percentage));
            setData('progress_percentage', newProgress);
            setCurrentProgress(newProgress);
        }
    };

    const addItem = (type) => {
        if (newItem[type].trim()) {
            const fieldMap = {
                milestone: 'milestones_completed',
                challenge: 'challenges_faced',
                resource: 'resources_needed'
            };
            const field = fieldMap[type];
            const currentItems = data[field] ? data[field].split(',').filter(Boolean) : [];
            setData(field, [...currentItems, newItem[type].trim()].join(','));
            setNewItem(prev => ({ ...prev, [type]: '' }));
        }
    };

    const removeItem = (type, index) => {
        const fieldMap = {
            milestone: 'milestones_completed',
            challenge: 'challenges_faced',
            resource: 'resources_needed'
        };
        const field = fieldMap[type];
        const items = data[field] ? data[field].split(',').filter(Boolean) : [];
        items.splice(index, 1);
        setData(field, items.join(','));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Make sure the accepted_resources field in data is updated with the latest values
        // This is already done by the toggleAcceptedResource function, but we'll ensure it's synchronized
        setData('accepted_resources', acceptedResources.join(','));
        
        // Log the form data for debugging
        console.log('Form data being submitted:', {
            ...data,
            updated_by: auth.user.id
        });
        
        // Submit the form with all data
        post(route('projects.updates.store', project.id), {
            ...data,
            updated_by: auth.user.id
        }, {
            onSuccess: () => {
                console.log('Update submitted successfully');
                reset();
                window.location.reload();
            },
            onError: (errors) => {
                console.error('Failed to add project update:', errors);
            }
        });
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM d, yyyy');
        } catch (error) {
            return 'Invalid date';
        }
    };

    const toggleAcceptedResource = (resource) => {
        if (acceptedResources.includes(resource)) {
            setAcceptedResources(acceptedResources.filter(r => r !== resource));
            
            // Update the form data as well
            const currentResources = data.accepted_resources ? data.accepted_resources.split(',').filter(Boolean) : [];
            setData('accepted_resources', currentResources.filter(r => r !== resource).join(','));
        } else {
            setAcceptedResources([...acceptedResources, resource]);
            
            // Update the form data as well
            const currentResources = data.accepted_resources ? data.accepted_resources.split(',').filter(Boolean) : [];
            setData('accepted_resources', [...currentResources, resource].join(','));
        }
    };
    
    // Function to mark a resource as resolved/accepted
    const markResourceAccepted = (resource) => {
        toggleAcceptedResource(resource);
    };

    const renderItems = (type) => {
        const fieldMap = {
            milestone: 'milestones_completed',
            challenge: 'challenges_faced',
            resource: 'resources_needed'
        };
        
        const colorClasses = {
            milestone: {
                item: 'bg-white border border-green-200',
                button: 'text-green-600 hover:text-green-800',
                dot: 'bg-green-500'
            },
            challenge: {
                item: 'bg-white border border-red-200',
                button: 'text-red-600 hover:text-red-800',
                dot: 'bg-red-500'
            },
            resource: {
                item: 'bg-white border border-blue-200',
                button: 'text-blue-600 hover:text-blue-800',
                dot: 'bg-blue-500'
            }
        };
        
        const field = fieldMap[type];
        const colorClass = colorClasses[type];
        const items = data[field] ? data[field].split(',').filter(Boolean) : [];
        
        // For resources, check against accepted resources
        const acceptedResourcesList = data.accepted_resources ? data.accepted_resources.split(',').filter(Boolean) : [];
        
        return items.map((item, index) => (
            <motion.li 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center justify-between text-sm p-2 rounded ${colorClass.item}`}
            >
                <span className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${colorClass.dot}`}></span>
                    {item}
                </span>
                <div className="flex items-center space-x-2">
                    {type === 'resource' && (
                        <button
                            type="button"
                            onClick={() => markResourceAccepted(item)}
                            className={`p-1 ${acceptedResourcesList.includes(item) ? 'text-green-600' : 'text-gray-400'} hover:text-green-800`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => removeItem(type, index)}
                        className={`p-1 ${colorClass.button}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </motion.li>
        ));
    };

    // Get badge color based on status
    const getBadgeColor = (status) => {
        return statusColors[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
    };

    // Get progress bar color based on percentage
    const getProgressBarColor = (percentage) => {
        if (percentage < 25) return 'bg-red-500';
        if (percentage < 50) return 'bg-orange-500';
        if (percentage < 75) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    // Display unresolved challenges and resources
    const unresolvedResources = project.unresolvedResources || [];

    const handleRequestNewSupervisor = (e) => {
        e.preventDefault();
        
        if (!data.supervisor_id) {
            return;
        }
        
        post(route('projects.supervisor.request-new', project.id), {
            supervisor_id: data.supervisor_id
        }, {
            onSuccess: () => {
                window.location.reload();
            },
            onError: (errors) => {
                console.error('Failed to request new supervisor:', errors);
            }
        });
    };

    if (!project) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6"
                        >
                            <p className="text-gray-500 text-center">Project not found.</p>
                        </motion.div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Project Details</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[project.priority || 'medium']}`}>
                        {project.priority || 'Medium'} Priority
                    </span>
                </div>
            }
        >
            <Head title={`Project - ${project?.title || 'Details'}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Local Back control inside page content */}
                    <div className="mb-4 flex items-center">
                        <button
                            type="button"
                            onClick={() => window.history.length > 1 ? window.history.back() : router.visit(route('lecturer.dashboard'))}
                            className="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-base sm:text-lg font-semibold border-4 border-white group shadow"
                        >
                            <div className="bg-green-400 rounded-xl h-12 w-1/4 grid place-items-center absolute left-0 top-0 group-hover:w-full z-10 duration-500 pointer-events-none">
                                <svg width="25px" height="25px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                                  <path fill="#000000" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" />
                                  <path fill="#000000" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" />
                                </svg>
                            </div>
                            <p className="translate-x-4 relative z-20 pointer-events-none group-hover:opacity-0 duration-300">Go Back</p>
                        </button>
                    </div>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg"
                    >
                        {/* Project Header Section */}
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{project.title || 'Untitled Project'}</h1>
                                    <p className="text-gray-600 mt-1">
                                        Started on {formatDate(project.start_date)} • Expected to finish by {formatDate(project.expected_end_date)}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status || 'planning']}`}>
                                        {(project.status || 'planning').replace('_', ' ')}
                                    </span>
                                    <span className="text-xl font-bold text-indigo-600">{project.progress_percentage}%</span>
                                    {project.status === 'completed' && project.actual_end_date && (
                                        <span className="text-xs font-medium text-emerald-600">
                                            Completed on {formatDate(project.actual_end_date)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="mt-4">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className={`${getProgressBarColor(project.progress_percentage)} h-2.5 rounded-full`} style={{ width: `${project.progress_percentage}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="border-b border-gray-200">
                            <nav className="flex -mb-px">
                                <button 
                                    onClick={() => setActiveTab('info')}
                                    className={`py-3 px-6 text-sm font-medium ${
                                        activeTab === 'info' 
                                            ? 'border-b-2 border-indigo-500 text-indigo-600' 
                                            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Project Info
                                </button>
                                <button 
                                    onClick={() => setActiveTab('updates')}
                                    className={`py-3 px-6 text-sm font-medium ${
                                        activeTab === 'updates' 
                                            ? 'border-b-2 border-indigo-500 text-indigo-600' 
                                            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Updates & Timeline
                                </button>
                                {project.status !== 'completed' ? (
                                    <button 
                                        onClick={() => setActiveTab('add')}
                                        className={`py-3 px-6 text-sm font-medium ${
                                            activeTab === 'add' 
                                                ? 'border-b-2 border-indigo-500 text-indigo-600' 
                                                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        Add Update
                                    </button>
                                ) : (
                                    <div className="py-3 px-6 text-sm font-medium text-gray-400 flex items-center cursor-not-allowed">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Project Completed
                                    </div>
                                )}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'info' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                                >
                                    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Project Information</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Title:</span>
                                                <span className="font-medium text-gray-900">{project.title || 'Untitled'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Type:</span>
                                                <span className="font-medium text-gray-900 capitalize">{project.type || 'Individual'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Status:</span>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status || 'planning']}`}>
                                                    {(project.status || 'planning').replace('_', ' ')}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Priority:</span>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[project.priority || 'medium']}`}>
                                                    {project.priority || 'medium'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Start Date:</span>
                                                <span className="font-medium text-gray-900">{formatDate(project.start_date)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Expected End:</span>
                                                <span className="font-medium text-gray-900">{formatDate(project.expected_end_date)}</span>
                                            </div>
                                            {project.actual_end_date && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Completed On:</span>
                                                    <span className="font-medium text-emerald-600">{formatDate(project.actual_end_date)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {project.type === 'individual' && project.student && (
                                                <div className="mt-6">
                                                    <h4 className="font-medium text-gray-900 mb-2">Student</h4>
                                                    <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg border border-green-100">
                                                        <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-medium">
                                                            {project.student.user?.name?.charAt(0) || '?'}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {project.student.user?.name || 'Unknown'}
                                                            {project.student.matric_no && 
                                                                <span className="text-xs text-gray-500 ml-2">({project.student.matric_no})</span>
                                                            }
                                                        </span>
                                                        {project.student.user && (
                                                            <a href={route('profile.view', project.student.user.id)} className="ml-auto">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 hover:text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {project.type === 'team' && project.team && (
                                                <div className="mt-6">
                                                    <h4 className="font-medium text-gray-900 mb-2">Team Members</h4>
                                                    <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                                                        <div className="text-xs text-indigo-700 mb-2">
                                                            {project.team.name} <span className="bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded text-xs ml-1">
                                                                {project.team.members?.length || 0} members
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="space-y-2 mt-3">
                                                            {project.team.members?.map(member => (
                                                                <div key={member.id} className="flex items-center space-x-2 p-2 bg-white rounded-md shadow-sm">
                                                                    <div className="w-7 h-7 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-medium text-xs">
                                                                        {member.user?.name?.charAt(0) || '?'}
                                                                    </div>
                                                                    <span className="text-sm text-gray-700">{member.user?.name}</span>
                                                                    
                                                                    <a href={route('profile.view', member.user?.id)} className="ml-auto">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 hover:text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                        </svg>
                                                                    </a>
                                                                </div>
                                                            ))}
                                                            
                                                            {(!project.team.members || project.team.members.length === 0) && (
                                                                <p className="text-xs text-indigo-500 italic py-2 px-3 bg-white rounded">
                                                                    No team members found
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                        <div className="mt-6">
                                            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                                            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{project.description || 'No description provided.'}</p>
                                        </div>

                                        
                                    </div>

                                    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Project Details</h3>
                                        
                                        <div className="space-y-5">
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Progress Overview</h4>
                                                <div className="bg-gray-50 p-4 rounded-md">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm text-gray-500">Current Progress</span>
                                                        <span className="text-sm font-medium text-indigo-600">{project.progress_percentage}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div 
                                                            className="h-2.5 rounded-full"
                                                            style={{ 
                                                                width: `${project.progress_percentage}%`,
                                                                background: `linear-gradient(90deg, ${project.progress_percentage < 30 ? '#818cf8' : project.progress_percentage < 70 ? '#60a5fa' : '#34d399'}, ${project.progress_percentage < 30 ? '#6366f1' : project.progress_percentage < 70 ? '#3b82f6' : '#10b981'})`
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-2">
                                                        {project.status === 'completed' ? 
                                                            'Project completed!' : 
                                                            project.status === 'planning' ? 
                                                                'Project in planning phase.' : 
                                                                project.status === 'on_hold' ? 
                                                                    'Project currently on hold.' : 
                                                                    `${project.progress_percentage}% of project tasks completed.`
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Supervisor</h4>
                                                {project.supervisor ? (
                                                    <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
                                                        <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-medium">
                                                            {project.supervisor.name.charAt(0)}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-700">{project.supervisor.name}</span>
                                                        {project.supervisor_request_status === 'pending' && (
                                                            <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                                                                Pending Approval
                                                            </span>
                                                        )}
                                                        {project.supervisor_request_status === 'accepted' && (
                                                            <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                                                                Approved
                                                            </span>
                                                        )}
                                                        <a href={route('profile.view', project.supervisor.id)} className="ml-auto">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 hover:text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {project.supervisor_request_status === 'rejected' && auth.user.id === project.student?.user?.id ? (
                                                            <div className="space-y-3">
                                                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                                                    <p className="text-sm text-red-800 font-medium">Supervisor Request Rejected</p>
                                                                    <p className="text-xs text-red-600 mt-1">
                                                                        Your previous supervisor request was rejected. Please select a new supervisor from your mentors.
                                                                    </p>
                                                                </div>
                                                                
                                                                {available_mentors && available_mentors.length > 0 ? (
                                                                    <form onSubmit={handleRequestNewSupervisor} className="flex items-center gap-2">
                                                                        <select
                                                                            value={data.supervisor_id}
                                                                            onChange={e => setData('supervisor_id', e.target.value)}
                                                                            className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                            required
                                                                        >
                                                                            <option value="">Select a new supervisor from your mentors</option>
                                                                            {available_mentors.map(mentor => (
                                                                                <option key={mentor.id} value={mentor.id}>{mentor.name}</option>
                                                                            ))}
                                                                        </select>
                                                                        <button
                                                                            type="submit"
                                                                            disabled={processing || !data.supervisor_id}
                                                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                                                        >
                                                                            {processing ? 'Requesting...' : 'Request Supervisor'}
                                                                        </button>
                                                                        {errors.supervisor_id && <span className="text-red-500 text-xs">{errors.supervisor_id}</span>}
                                                                    </form>
                                                                ) : (
                                                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                                        <p className="text-sm text-blue-800">
                                                                            <strong>No mentors available.</strong> You need mentors to request a new supervisor.
                                                                            Please visit the{' '}
                                                                            <a href={route('friends.list', { tab: 'mentors' })} className="text-blue-600 hover:text-blue-800 underline">
                                                                                Find Mentors
                                                                            </a>{' '}
                                                                            page to establish mentor relationships first.
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <p className="text-gray-500 italic">No supervisor assigned.</p>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                            
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Project Statistics</h4>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                                                        <div className="text-xs text-indigo-700 mb-1">Total Updates</div>
                                                        <div className="text-xl font-bold text-indigo-800">{project.updates?.length || 0}</div>
                                                    </div>
                                                    {project.status === 'completed' ? (
                                                        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                                                            <div className="text-xs text-emerald-700 mb-1">Completed On</div>
                                                            <div className="text-xl font-bold text-emerald-800">
                                                                {formatDate(project.actual_end_date)}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                                                            <div className="text-xs text-emerald-700 mb-1">Days Remaining</div>
                                                            <div className="text-xl font-bold text-emerald-800">
                                                                {project.expected_end_date ? 
                                                                    Math.max(0, Math.ceil((new Date(project.expected_end_date) - new Date()) / (1000 * 60 * 60 * 24))) : 
                                                                    'N/A'
                                                                }
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'updates' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Project Timeline</h3>
                                    {project.updates && project.updates.length > 0 ? (
                                        <div className="relative border-l-2 border-indigo-200 ml-3 pb-4">
                                            {project.updates.map((update, index) => (
                                                <motion.div 
                                                    key={update.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                                    className="mb-6 ml-6"
                                                >
                                                    <div className="absolute w-4 h-4 bg-indigo-500 rounded-full mt-1.5 -left-2 border border-white"></div>
                                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <span className="text-xs text-gray-500">{format(new Date(update.created_at), 'MMM d, yyyy')}</span>
                                                                <div className="flex items-center mt-1">
                                                                    <div className="h-2.5 w-2.5 rounded-full bg-blue-600 mr-2"></div>
                                                                    <span className="text-sm font-medium text-gray-900">Progress Update: {update.progress_percentage}%</span>
                                                                </div>
                                                            </div>
                                                            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                                By {update.user_name || update.updatedBy?.name || 'Unknown'}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-600 mb-3">{update.progress_description}</p>
                                                        
                                                        {/* Display Milestones, Challenges and Resources */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                                            {update.milestones_completed && (
                                                                <div className="bg-green-50 p-2 rounded border border-green-100">
                                                                    <h5 className="text-xs font-medium text-green-800 mb-1">Milestones Completed</h5>
                                                                    <ul className="text-xs text-gray-600 pl-2">
                                                                        {update.milestones_completed.split(',').filter(Boolean).map((item, i) => (
                                                                            <li key={i} className="flex items-center mb-1">
                                                                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                                                                {item}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                            
                                                            {update.challenges_faced && (
                                                                <div className="bg-red-50 p-2 rounded border border-red-100">
                                                                    <h5 className="text-xs font-medium text-red-800 mb-1">Challenges Faced</h5>
                                                                    <ul className="text-xs text-gray-600 pl-2">
                                                                        {update.challenges_faced.split(',').filter(Boolean).map((item, i) => (
                                                                            <li key={i} className="flex items-center mb-1">
                                                                                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                                                                {item}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                            
                                                            {update.resources_needed && (
                                                                <div className="bg-blue-50 p-2 rounded border border-blue-100">
                                                                    <h5 className="text-xs font-medium text-blue-800 mb-1">Resources Needed</h5>
                                                                    <ul className="text-xs text-gray-600 pl-2">
                                                                        {update.resources_needed.split(',').filter(Boolean).map((item, i) => (
                                                                            <li key={i} className="flex items-center mb-1">
                                                                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                                                                {item}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                            
                                                            {update.accepted_resources && (
                                                                <div className="bg-emerald-50 p-2 rounded border border-emerald-100">
                                                                    <h5 className="text-xs font-medium text-emerald-800 mb-1">Accepted Resources</h5>
                                                                    <ul className="text-xs text-gray-600 pl-2">
                                                                        {update.accepted_resources.split(',').filter(Boolean).map((item, i) => (
                                                                            <li key={i} className="flex items-center mb-1">
                                                                                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                                                                                {item}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No updates yet</h3>
                                            <p className="mt-1 text-sm text-gray-500">Add your first project update to begin tracking progress.</p>
                                            <div className="mt-6">
                                                {project.status !== 'completed' ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveTab('add')}
                                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                                    >
                                                        Add Update
                                                    </button>
                                                ) : (
                                                    <div className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-gray-100">
                                                        Project Completed
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'add' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {project.status === 'completed' ? (
                                        <div className="bg-amber-50 p-8 rounded-lg border border-amber-200 text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-amber-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            <h3 className="text-lg font-medium text-amber-800 mb-2">Project Already Completed</h3>
                                            <p className="text-amber-700 mb-4">
                                                This project has been marked as completed on {formatDate(project.actual_end_date)}. 
                                                No further updates can be added to completed projects.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('updates')}
                                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
                                            >
                                                View Project Timeline
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Project Update</h3>
                                            <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                                <div className="space-y-5">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Progress Description</label>
                                                        <textarea
                                                            value={data.progress_description}
                                                            onChange={(e) => setData('progress_description', e.target.value)}
                                                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                                            rows="3"
                                                            placeholder="Describe the current progress, key achievements, or challenges..."
                                                            required
                                                        />
                                                        {errors.progress_description && (
                                                            <div className="text-red-500 text-sm mt-1">{errors.progress_description}</div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Progress Percentage</label>
                                                        <div className="mt-2 mb-10 relative">
                                                            <div
                                                                className="h-5 w-full bg-gray-200 rounded-lg cursor-pointer relative"
                                                                onClick={handleProgressBarClick}
                                                                onMouseMove={handleProgressBarDrag}
                                                                onMouseDown={() => setIsDragging(true)}
                                                                onMouseUp={() => setIsDragging(false)}
                                                                onMouseLeave={() => setIsDragging(false)}
                                                            >
                                                                <motion.div
                                                                    initial={{ width: '0%' }}
                                                                    animate={{ width: `${data.progress_percentage}%` }}
                                                                    transition={{ duration: 0.3 }}
                                                                    className="h-full rounded-lg relative"
                                                                    style={{ 
                                                                        background: `linear-gradient(90deg, 
                                                                            ${data.progress_percentage < 30 ? '#818cf8' : data.progress_percentage < 70 ? '#60a5fa' : '#34d399'}, 
                                                                            ${data.progress_percentage < 30 ? '#6366f1' : data.progress_percentage < 70 ? '#3b82f6' : '#10b981'})`
                                                                    }}
                                                                >
                                                                    <div className="absolute -right-3.5 -top-2 w-9 h-9 bg-white rounded-full cursor-grab shadow-md flex items-center justify-center border-2 border-indigo-500 select-none">
                                                                        <span className="text-xs font-semibold text-indigo-700">{data.progress_percentage}%</span>
                                                                    </div>
                                                                </motion.div>
                                                            </div>
                                                            <div className="absolute mt-2 w-full flex justify-between px-1 text-xs text-gray-500">
                                                                <span>0%</span>
                                                                <span>25%</span>
                                                                <span>50%</span>
                                                                <span>75%</span>
                                                                <span>100%</span>
                                                            </div>
                                                        </div>
                                                        {errors.progress_percentage && (
                                                            <div className="text-red-500 text-sm mt-1">{errors.progress_percentage}</div>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {/* First column - Milestones and Challenges */}
                                                        <div className="space-y-4 sm:space-y-6">
                                                            {/* Milestones Section */}
                                                            <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-100">
                                                                <label className="block text-sm font-medium text-green-800 mb-2">Milestones Completed</label>
                                                                <div className="flex">
                                                                    <input
                                                                        type="text"
                                                                        value={newItem.milestone}
                                                                        onChange={(e) => setNewItem(prev => ({ ...prev, milestone: e.target.value }))}
                                                                        className="flex-1 rounded-l-md border-gray-300 focus:border-green-500 focus:ring-green-500 text-sm"
                                                                        placeholder="Add a milestone"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => addItem('milestone')}
                                                                        className="inline-flex items-center px-2 sm:px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-green-100 text-green-700 hover:bg-green-200 text-sm"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-0 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                        </svg>
                                                                        <span className="hidden sm:inline">Add</span>
                                                                    </button>
                                                                </div>
                                                                <ul className="mt-2 sm:mt-3 space-y-1 max-h-28 sm:max-h-32 overflow-y-auto">
                                                                    {renderItems('milestone').length > 0 ? renderItems('milestone') : (
                                                                        <li className="text-sm text-gray-500 italic py-2 px-3 bg-white rounded">
                                                                            No milestones added yet
                                                                        </li>
                                                                    )}
                                                                </ul>
                                                            </div>

                                                            {/* Challenges Section */}
                                                            <div className="bg-red-50 p-3 sm:p-4 rounded-lg border border-red-100">
                                                                <label className="block text-sm font-medium text-red-800 mb-2">Challenges Faced</label>
                                                                <div className="flex">
                                                                    <input
                                                                        type="text"
                                                                        value={newItem.challenge}
                                                                        onChange={(e) => setNewItem(prev => ({ ...prev, challenge: e.target.value }))}
                                                                        className="flex-1 rounded-l-md border-gray-300 focus:border-red-500 focus:ring-red-500 text-sm"
                                                                        placeholder="Add a challenge"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => addItem('challenge')}
                                                                        className="inline-flex items-center px-2 sm:px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-red-100 text-red-700 hover:bg-red-200 text-sm"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-0 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                        </svg>
                                                                        <span className="hidden sm:inline">Add</span>
                                                                    </button>
                                                                </div>
                                                                <ul className="mt-2 sm:mt-3 space-y-1 max-h-28 sm:max-h-32 overflow-y-auto">
                                                                    {renderItems('challenge').length > 0 ? renderItems('challenge') : (
                                                                        <li className="text-sm text-gray-500 italic py-2 px-3 bg-white rounded">
                                                                            No challenges added yet
                                                                        </li>
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        {/* Second column - Resources Needed and Accepted */}
                                                        <div className="space-y-4 sm:space-y-6">
                                                            {/* Resources Needed Section */}
                                                            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-100">
                                                                <label className="block text-sm font-medium text-blue-800 mb-2">Resources Needed</label>
                                                                <div className="flex">
                                                                    <input
                                                                        type="text"
                                                                        value={newItem.resource}
                                                                        onChange={(e) => setNewItem(prev => ({ ...prev, resource: e.target.value }))}
                                                                        className="flex-1 rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                                                                        placeholder="Add a resource"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => addItem('resource')}
                                                                        className="inline-flex items-center px-2 sm:px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-0 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                        </svg>
                                                                        <span className="hidden sm:inline">Add</span>
                                                                    </button>
                                                                </div>
                                                                <ul className="mt-2 sm:mt-3 space-y-1 max-h-28 sm:max-h-32 overflow-y-auto">
                                                                    {renderItems('resource').length > 0 ? renderItems('resource') : (
                                                                        <li className="text-sm text-gray-500 italic py-2 px-3 bg-white rounded">
                                                                            No resources added yet
                                                                        </li>
                                                                    )}
                                                                </ul>
                                                                {unresolvedResources.length > 0 && (
                                                                    <div className="mt-2 sm:mt-3">
                                                                        <h4 className="text-xs font-medium text-blue-800 mb-1">Unresolved Resources</h4>
                                                                        <ul className="space-y-1 text-xs">
                                                                            {unresolvedResources.map((resource, index) => (
                                                                                <li key={index} className="text-gray-700 flex items-center">
                                                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1.5"></span>
                                                                                    {resource}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Accepted Resources Section */}
                                                            <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-100">
                                                                <label className="block text-sm font-medium text-green-800 mb-2">Accepted Resources</label>
                                                                <div className="flex mb-2 sm:mb-3">
                                                                    <select
                                                                        value={newItem.acceptedResource || ''}
                                                                        onChange={(e) => setNewItem(prev => ({ ...prev, acceptedResource: e.target.value }))}
                                                                        className="flex-1 rounded-l-md border-gray-300 focus:border-green-500 focus:ring-green-500 text-sm"
                                                                    >
                                                                        <option value="">Select a resource...</option>
                                                                        <option value="Mentorship Access">Mentorship</option>
                                                                        <option value="Funding Opportunities">Funding</option>
                                                                        <option value="Tools for Startup">Tools for Startup</option>
                                                                        <option value="Networking">Networking</option>
                                                                        <option value="Educational Resources">Educational</option>
                                                                        <option value="Legal Assistance">Legal Assistance</option>
                                                                        <option value="Market Research">Market Research</option>
                                                                        <option value="Prototyping Resources">Prototyping</option>
                                                                    </select>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            if (newItem.acceptedResource && newItem.acceptedResource.trim()) {
                                                                                toggleAcceptedResource(newItem.acceptedResource);
                                                                                setNewItem(prev => ({ ...prev, acceptedResource: '' }));
                                                                            }
                                                                        }}
                                                                        className="inline-flex items-center px-2 sm:px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-green-100 text-green-700 hover:bg-green-200 text-sm"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-0 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                        </svg>
                                                                        <span className="hidden sm:inline">Add</span>
                                                                    </button>
                                                                </div>
                                                                <ul className="space-y-1 max-h-28 sm:max-h-32 overflow-y-auto">
                                                                    {acceptedResources.length > 0 ? (
                                                                        acceptedResources.map((resource, index) => (
                                                                            <li key={index} className="flex items-center justify-between text-sm p-2 rounded bg-white border border-green-200">
                                                                                <span className="flex items-center text-xs sm:text-sm truncate pr-2">
                                                                                    <span className="w-2 h-2 rounded-full mr-1 sm:mr-2 flex-shrink-0 bg-green-500"></span>
                                                                                    {resource}
                                                                                </span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => toggleAcceptedResource(resource)}
                                                                                    className="p-1 text-green-600 hover:text-green-800 flex-shrink-0"
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                                    </svg>
                                                                                </button>
                                                                            </li>
                                                                        ))
                                                                    ) : (
                                                                        <li className="text-sm text-gray-500 italic py-2 px-3 bg-white rounded">
                                                                            No accepted resources added yet
                                                                        </li>
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end pt-4 border-t">
                                                    <button
                                                        type="button"
                                                        onClick={() => reset()}
                                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                                                        disabled={processing}
                                                    >
                                                        Reset
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    >
                                                        {processing ? (
                                                            <>
                                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Updating...
                                                            </>
                                                        ) : (
                                                            'Submit Update'
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 