import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    UserGroupIcon,
    AcademicCapIcon,
    CalendarIcon,
    TrophyIcon,
    CheckCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import MentorRequestsDropdown from '@/Components/Projects/MentorRequestsDropdown';
import axios from 'axios';

export default function MenteesDashboard({ mentees, stats }) {
    const { auth } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [isMentorRequestsDropdownOpen, setIsMentorRequestsDropdownOpen] = useState(false);
    const [pendingMentorRequests, setPendingMentorRequests] = useState([]);

    useEffect(() => {
        axios.get(route('mentor.pending'))
            .then(res => setPendingMentorRequests(res.data || []))
            .catch(() => {});
    }, []);
    
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

    const filteredMentees = mentees.filter(mentee =>
        mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentee.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentee.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentee.faculty.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleRowClick = (mentee) => {
        router.visit(mentee.profile_url);
    };

    return (
        <AuthenticatedLayout>
            <Head title="My Mentees" />

            <div className="py-12 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Dashboard Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-white flex items-center">
                            <UserGroupIcon className="h-8 w-8 text-indigo-400 mr-3" />
                            My Mentees
                        </h1>
                        <div className="relative">
                            <motion.button
                                onClick={() => setIsMentorRequestsDropdownOpen(!isMentorRequestsDropdownOpen)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center px-4 py-2 bg-orange-100 hover:bg-orange-200 text-[#F37022] rounded-lg text-sm border border-orange-200 hover:border-orange-300 transition-all duration-200 font-medium shadow"
                            >
                                <span className="material-symbols-outlined text-sm mr-2">group_add</span>
                                Mentor Requests
                                {pendingMentorRequests.length > 0 && (
                                    <span className="ml-2 bg-red-500/20 text-red-700 px-2 py-0.5 rounded-full text-xs">
                                        {pendingMentorRequests.length}
                                    </span>
                                )}
                            </motion.button>
                            <MentorRequestsDropdown
                                isOpen={isMentorRequestsDropdownOpen}
                                onClose={() => setIsMentorRequestsDropdownOpen(false)}
                                requests={pendingMentorRequests}
                                onAccept={(id) => axios.post(route('mentor.accept', id)).then(() => axios.get(route('mentor.pending')).then(r=>setPendingMentorRequests(r.data||[]))) }
                                onReject={(id) => axios.post(route('mentor.reject', id)).then(() => axios.get(route('mentor.pending')).then(r=>setPendingMentorRequests(r.data||[]))) }
                                auth={auth}
                                loadingStates={{}}
                            />
                        </div>
                    </div>
                
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
                                    <UserGroupIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-sm font-medium text-blue-600">Total Mentees</h2>
                                    <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.total_mentees}</p>
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
                                    <h2 className="text-sm font-medium text-green-600">Active Mentees</h2>
                                    <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.active_mentees}</p>
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
                                    <h2 className="text-sm font-medium text-yellow-600">Pending Requests</h2>
                                    <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.pending_requests}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="bg-gradient-to-br from-white to-purple-50 overflow-hidden shadow-md rounded-xl p-6 border border-purple-100"
                            variants={cardVariants}
                            whileHover="hover"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <TrophyIcon className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-sm font-medium text-purple-600">Total Requests</h2>
                                    <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.total_requests}</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Mentees Table */}
                    <motion.div 
                        className="bg-white overflow-hidden shadow-md rounded-xl border border-gray-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-wrap items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                    <UserGroupIcon className="h-6 w-6 text-indigo-500 mr-2" />
                                    My Mentees
                                </h2>
                                
                                <div className="mt-4 sm:mt-0">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search mentees by name, matric number, or contact..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matric No</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentorship Started</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Events</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredMentees.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                                {searchQuery ? 'No mentees match your search.' : 'No mentees yet.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredMentees.map((mentee, index) => (
                                            <motion.tr 
                                                key={mentee.id} 
                                                custom={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05, duration: 0.3 }}
                                                className="hover:bg-gray-50 cursor-pointer"
                                                onClick={() => handleRowClick(mentee)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                                                                {mentee.name?.charAt(0) || '?'}
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{mentee.name}</div>
                                                            <div className="text-sm text-gray-500">{mentee.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {mentee.student_id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {mentee.contact}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {mentee.faculty}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    Year {mentee.year}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {mentee.mentorship_started}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                        {mentee.total_events_joined}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                                        {mentee.active_projects}
                                                    </span>
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