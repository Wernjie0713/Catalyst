import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';

export default function Create({ auth, teams = [], supervisors = [], isTeamLeader = false, hasMentors = false, canSelectSupervisor = false }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        type: 'individual',
        priority: 'medium',
        start_date: '',
        expected_end_date: '',
        team_id: '',
        supervisor_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        
        // Clean up the data before submission
        const submitData = {
            ...data,
            supervisor_id: data.supervisor_id || null,
            team_id: data.team_id || null
        };
        
        post(route('projects.store'), submitData, {
            onSuccess: () => {
                // Redirect will be handled by the backend
            },
            onError: (errors) => {
                // Form validation errors will be displayed automatically
            }
        });
    };

    // Reset team_id when switching from team to individual
    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setData(data => ({
            ...data,
            type: newType,
            team_id: newType === 'individual' ? '' : data.team_id
        }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Project</h2>}
        >
            <Head title="Create Project" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100">
                        <div className="p-8 text-gray-900">
                            {/* Header Section */}
                            <div className="mb-8 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                                    <span className="material-symbols-outlined text-2xl text-[#F37022]">add_task</span>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Project</h1>
                                <p className="text-gray-600 max-w-2xl mx-auto">
                                    Start your journey by creating a new project. Define your goals, set priorities, and collaborate with your team.
                                </p>
                            </div>

                            {Object.keys(errors).length > 0 && (
                                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                                    <div className="flex items-center">
                                        <span className="material-symbols-outlined text-red-500 mr-2">error</span>
                                        <strong className="font-semibold">Please check the form for errors.</strong>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-8">
                                {/* Project Basic Info */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <span className="material-symbols-outlined text-[#F37022] mr-2">info</span>
                                        Project Information
                                    </h3>
                                    <div className="space-y-6">
                                        <div>
                                            <InputLabel htmlFor="title" value="Project Title" />
                                            <TextInput
                                                id="title"
                                                type="text"
                                                name="title"
                                                value={data.title}
                                                className="mt-1 block w-full border-gray-300 focus:border-[#F37022] focus:ring-[#F37022] rounded-lg"
                                                onChange={(e) => setData('title', e.target.value)}
                                                required
                                                placeholder="Enter your project title"
                                            />
                                            <InputError message={errors.title} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="description" value="Description" />
                                            <TextArea
                                                id="description"
                                                name="description"
                                                value={data.description}
                                                className="mt-1 block w-full border-gray-300 focus:border-[#F37022] focus:ring-[#F37022] rounded-lg"
                                                onChange={(e) => setData('description', e.target.value)}
                                                required
                                                placeholder="Describe your project goals and objectives"
                                                rows={4}
                                            />
                                            <InputError message={errors.description} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Project Settings */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <span className="material-symbols-outlined text-[#F37022] mr-2">settings</span>
                                        Project Settings
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="type" value="Project Type" />
                                            <select
                                                id="type"
                                                name="type"
                                                value={data.type}
                                                className="mt-1 block w-full border-gray-300 focus:border-[#F37022] focus:ring-[#F37022] rounded-lg shadow-sm"
                                                onChange={handleTypeChange}
                                            >
                                                <option value="individual">Individual Project</option>
                                                {isTeamLeader && (
                                                    <option value="team">Team Project</option>
                                                )}
                                            </select>
                                            {!isTeamLeader && (
                                                <p className="mt-2 text-sm text-gray-500 flex items-center">
                                                    <span className="material-symbols-outlined text-sm mr-1">info</span>
                                                    You need to be a team leader to create team projects.
                                                </p>
                                            )}
                                            <InputError message={errors.type} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="priority" value="Priority Level" />
                                            <select
                                                id="priority"
                                                name="priority"
                                                value={data.priority}
                                                className="mt-1 block w-full border-gray-300 focus:border-[#F37022] focus:ring-[#F37022] rounded-lg shadow-sm"
                                                onChange={(e) => setData('priority', e.target.value)}
                                            >
                                                <option value="low">Low Priority</option>
                                                <option value="medium">Medium Priority</option>
                                                <option value="high">High Priority</option>
                                                <option value="critical">Critical Priority</option>
                                            </select>
                                            <InputError message={errors.priority} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Project Timeline */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <span className="material-symbols-outlined text-[#F37022] mr-2">schedule</span>
                                        Project Timeline
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="start_date" value="Start Date" />
                                            <TextInput
                                                id="start_date"
                                                type="date"
                                                name="start_date"
                                                value={data.start_date}
                                                className="mt-1 block w-full border-gray-300 focus:border-[#F37022] focus:ring-[#F37022] rounded-lg"
                                                onChange={(e) => setData('start_date', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.start_date} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="expected_end_date" value="Expected End Date" />
                                            <TextInput
                                                id="expected_end_date"
                                                type="date"
                                                name="expected_end_date"
                                                value={data.expected_end_date}
                                                className="mt-1 block w-full border-gray-300 focus:border-[#F37022] focus:ring-[#F37022] rounded-lg"
                                                onChange={(e) => setData('expected_end_date', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.expected_end_date} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {data.type === 'team' && isTeamLeader && (
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <span className="material-symbols-outlined text-[#F37022] mr-2">group</span>
                                            Team Selection
                                        </h3>
                                        <div>
                                            <InputLabel htmlFor="team_id" value="Select Team" />
                                            <select
                                                id="team_id"
                                                name="team_id"
                                                value={data.team_id}
                                                className="mt-1 block w-full border-gray-300 focus:border-[#F37022] focus:ring-[#F37022] rounded-lg shadow-sm"
                                                onChange={(e) => setData('team_id', e.target.value)}
                                                required
                                            >
                                                <option value="">Select a team</option>
                                                {teams.map((team) => (
                                                    <option key={team.id} value={team.id}>
                                                        {team.name} ({team.member_count} members)
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.team_id} className="mt-2" />
                                        </div>
                                    </div>
                                )}

                                {/* Supervisor Selection */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <span className="material-symbols-outlined text-[#F37022] mr-2">school</span>
                                        Project Supervisor
                                    </h3>
                                    
                                    {hasMentors ? (
                                        canSelectSupervisor ? (
                                            <div>
                                                <InputLabel htmlFor="supervisor_id" value="Select Supervisor (Required)" />
                                                <select
                                                    id="supervisor_id"
                                                    name="supervisor_id"
                                                    value={data.supervisor_id}
                                                    className="mt-1 block w-full border-gray-300 focus:border-[#F37022] focus:ring-[#F37022] rounded-lg shadow-sm pr-10"
                                                    onChange={(e) => setData('supervisor_id', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select a supervisor from your mentors</option>
                                                    {supervisors.map((supervisor) => (
                                                        <option key={supervisor.id} value={supervisor.id}>
                                                            {supervisor.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <p className="mt-2 text-sm text-gray-600 flex items-center">
                                                    <span className="material-symbols-outlined text-sm mr-1">info</span>
                                                    You must select one of your mentors as a supervisor to create a project.
                                                </p>
                                                <InputError message={errors.supervisor_id} className="mt-2" />
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                                                    <span className="material-symbols-outlined text-2xl text-yellow-600">warning</span>
                                                </div>
                                                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Available Supervisors</h4>
                                                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                                                    You have mentors, but none are available as supervisors at the moment. 
                                                    You cannot create a project without a supervisor.
                                                </p>
                                            </div>
                                        )
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                                <span className="material-symbols-outlined text-2xl text-blue-600">group_add</span>
                                            </div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Find Your Mentors First</h4>
                                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                                You need mentors to create a project. Connect with experienced professionals 
                                                who can guide you through your project journey.
                                            </p>
                                            <Link
                                                href={route('friends.list', { tab: 'mentors' })}
                                                className="inline-flex items-center px-6 py-3 bg-[#F37022] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
                                            >
                                                <span className="material-symbols-outlined mr-2">search</span>
                                                Find Mentors
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Section */}
                                <div className="flex items-center justify-end pt-6 border-t border-gray-200">
                                    <PrimaryButton 
                                        disabled={processing || (data.type === 'team' && !data.team_id) || !data.supervisor_id}
                                        className="px-8 py-3 bg-[#F37022] hover:bg-orange-600 border-[#F37022] hover:border-orange-600 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        {processing ? (
                                            <span className="flex items-center">
                                                <span className="material-symbols-outlined animate-spin mr-2">sync</span>
                                                Creating Project...
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                <span className="material-symbols-outlined mr-2">add_task</span>
                                                Create Project
                                            </span>
                                        )}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 