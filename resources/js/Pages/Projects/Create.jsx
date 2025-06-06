import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
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

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {Object.keys(errors).length > 0 && (
                                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                    <strong className="font-bold">Error!</strong>
                                    <span className="block sm:inline"> Please check the form for errors.</span>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="title" value="Project Title" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={data.title}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <TextArea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('description', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="type" value="Project Type" />
                                        <select
                                            id="type"
                                            name="type"
                                            value={data.type}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            onChange={handleTypeChange}
                                        >
                                            <option value="individual">Individual</option>
                                            {isTeamLeader && (
                                                <option value="team">Team</option>
                                            )}
                                        </select>
                                        {!isTeamLeader && (
                                            <p className="mt-2 text-sm text-gray-500">
                                                You need to be a team leader to create team projects.
                                            </p>
                                        )}
                                        <InputError message={errors.type} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="priority" value="Priority" />
                                        <select
                                            id="priority"
                                            name="priority"
                                            value={data.priority}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            onChange={(e) => setData('priority', e.target.value)}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="critical">Critical</option>
                                        </select>
                                        <InputError message={errors.priority} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="start_date" value="Start Date" />
                                        <TextInput
                                            id="start_date"
                                            type="date"
                                            name="start_date"
                                            value={data.start_date}
                                            className="mt-1 block w-full"
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
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('expected_end_date', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.expected_end_date} className="mt-2" />
                                    </div>
                                </div>

                                {data.type === 'team' && isTeamLeader && (
                                    <div>
                                        <InputLabel htmlFor="team_id" value="Select Team" />
                                        <select
                                            id="team_id"
                                            name="team_id"
                                            value={data.team_id}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
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
                                )}

                                <div>
                                    <InputLabel htmlFor="supervisor_id" value="Project Supervisor (Required)" />
                                    {hasMentors ? (
                                        canSelectSupervisor ? (
                                            <>
                                                <select
                                                    id="supervisor_id"
                                                    name="supervisor_id"
                                                    value={data.supervisor_id}
                                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm pr-10"
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
                                                <p className="mt-2 text-sm text-gray-600">
                                                    You must select one of your mentors as a supervisor to create a project.
                                                </p>
                                            </>
                                        ) : (
                                            <div className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                                <p className="text-sm text-yellow-800">
                                                    <strong>No available supervisors.</strong> You have mentors, but none are available as supervisors at the moment.
                                                    You cannot create a project without a supervisor.
                                                </p>
                                            </div>
                                        )
                                    ) : (
                                        <div className="mt-1 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                            <p className="text-sm text-blue-800">
                                                <strong>No mentors found.</strong> You must have mentors to create a project. 
                                                Please establish mentor relationships first by visiting the{' '}
                                                <a href={route('friends.list', { tab: 'mentors' })} className="text-blue-600 hover:text-blue-800 underline">
                                                    Find Mentors
                                                </a>{' '}
                                                page.
                                            </p>
                                        </div>
                                    )}
                                    <InputError message={errors.supervisor_id} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end">
                                    <PrimaryButton 
                                        disabled={processing || (data.type === 'team' && !data.team_id) || !data.supervisor_id}
                                        className="ml-4"
                                    >
                                        {processing ? 'Creating...' : 'Create Project'}
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