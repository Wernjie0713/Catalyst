import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import { motion } from 'framer-motion';
import { BackButton } from '@/Components/BackButton';
import PrimaryButton from '@/Components/PrimaryButton';
import LabelTagsSelector from '@/Components/LabelTagsSelector';

const Create = ({ auth }) => {
    const [imagePreview, setImagePreview] = useState(null);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        max_participants: '',
        event_type: '',
        cover_image: null,
        is_external: false,
        registration_url: '',
        organizer_name: '',
        organizer_website: '',
        is_team_event: false,
        min_team_members: '2',
        max_team_members: '',
        label_tags: [],
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'file') {
            setData(name, files[0]);
            
            // Create image preview
            if (files[0]) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(files[0]);
            } else {
                setImagePreview(null);
            }
        } else if (type === 'checkbox') {
            setData(name, checked);
        } else {
            setData(name, value);
        }
    };

    // If event is external, clear internal fields and vice versa
    useEffect(() => {
        if (data.is_external) {
            setData({
                ...data,
                max_participants: '',
                is_team_event: false,
                min_team_members: '',
                max_team_members: '',
            });
        } else if (data.is_team_event === false) {
            setData({
                ...data,
                min_team_members: '',
                max_team_members: '',
            });
        }
    }, [data.is_external, data.is_team_event]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route('events.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setImagePreview(null);
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Create Event
                    </h2>
                    <BackButton href={route('events.index')}>Back to Events</BackButton>
                </div>
            }
        >
            <Head title="Create Event" />

            {/* Background Pattern */}
            <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-50 opacity-60 -z-10"></div>
            <div className="fixed inset-0 opacity-40 -z-10" style={{
                backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="#f97316" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></g></svg>')}")`
            }}></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative py-12"
            >
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Section with Gradient */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="mb-8 text-center"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mb-6 shadow-lg">
                            <span className="material-symbols-outlined text-white text-3xl">add_circle</span>
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-orange-600 to-gray-800 bg-clip-text text-transparent mb-2">
                            Create New Event
                        </h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Fill in the details below to create your event and start engaging with participants
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-2xl rounded-3xl border border-white/20"
                    >
                        {/* Form Container with Enhanced Styling */}
                        <div className="relative p-8 lg:p-12">
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-200 to-transparent rounded-full -mr-16 -mt-16 opacity-60"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-100 to-transparent rounded-full -ml-12 -mb-12 opacity-60"></div>

                            <form onSubmit={handleSubmit} className="relative space-y-8">
                                {/* Event Type Selector with Enhanced Styling */}
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6, duration: 0.6 }}
                                    className="relative p-8 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl border border-orange-200 shadow-lg"
                                >
                                    <div className="absolute top-4 right-4 w-16 h-16 bg-orange-200 rounded-full opacity-20"></div>
                                    <div className="relative z-10">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-3">
                                            <span className="material-symbols-outlined text-orange-600">settings</span>
                                            Event Configuration
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Event Source Dropdown */}
                                            <div className="space-y-2">
                                                <label htmlFor="event_source" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[#F37022] text-lg">source</span>
                                                    Event Source
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        id="event_source"
                                                        name="is_external"
                                                        value={data.is_external}
                                                        onChange={(e) => {
                                                            setData('is_external', e.target.value === 'true');
                                                            if (e.target.value === 'true') {
                                                                setData('is_team_event', false);
                                                            }
                                                        }}
                                                        className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-2.5 focus:border-[#F37022] focus:ring-[#F37022] transition-colors"
                                                    >
                                                        <option value="false">Internal Event</option>
                                                        <option value="true">External Event</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Participation Type Dropdown - Only show for internal events */}
                                            {!data.is_external && (
                                                <div className="space-y-2">
                                                    <label htmlFor="participation_type" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[#F37022] text-lg">groups</span>
                                                        Participation Type
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            id="participation_type"
                                                            name="is_team_event"
                                                            value={data.is_team_event}
                                                            onChange={(e) => setData('is_team_event', e.target.value === 'true')}
                                                            className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-2.5 focus:border-[#F37022] focus:ring-[#F37022] transition-colors"
                                                        >
                                                            <option value="false">Individual Participation</option>
                                                            <option value="true">Team-based Participation</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Current Selection Display */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.6 }}
                                    className="flex items-center gap-3 text-gray-800 bg-orange-50 rounded-xl px-4 py-2.5 border border-[#F37022]/20"
                                >
                                    <span className="material-symbols-outlined text-[#F37022]">info</span>
                                    <p className="text-sm">
                                        You are creating a{' '}
                                        <span className="font-semibold text-[#F37022]">
                                            {data.is_external ? 'External' : 'Internal'} {data.event_type || 'Event'}
                                        </span>
                                        {!data.is_external && (
                                            <>
                                                {' '}with{' '}
                                                <span className="font-semibold text-[#F37022]">
                                                    {data.is_team_event ? 'Team-based' : 'Individual'} Participation
                                                </span>
                                            </>
                                        )}
                                    </p>
                                </motion.div>

                                {/* Explanatory Text for Team-based and External Events */}
                                {(data.is_team_event || data.is_external) && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.0, duration: 0.6 }}
                                        className="space-y-3"
                                    >
                                        {data.is_team_event && !data.is_external && (
                                            <div className="flex items-start gap-3 bg-orange-50 rounded-xl p-4 border border-[#F37022]/20">
                                                <span className="material-symbols-outlined text-[#F37022] mt-0.5">groups</span>
                                                <div className="space-y-2">
                                                    <h4 className="text-gray-900 font-medium">Team-based Participation</h4>
                                                    <p className="text-sm text-gray-600">
                                                        In team-based events, participants must form teams to compete. You'll need to specify:
                                                    </p>
                                                    <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                                                        <li>Minimum number of members per team (at least 2)</li>
                                                        <li>Maximum number of members allowed per team</li>
                                                        <li>Maximum number of teams that can participate</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        )}

                                        {data.is_external && (
                                            <div className="flex items-start gap-3 bg-orange-50 rounded-xl p-4 border border-[#F37022]/20">
                                                <span className="material-symbols-outlined text-[#F37022] mt-0.5">link</span>
                                                <div className="space-y-2">
                                                    <h4 className="text-gray-900 font-medium">External Event</h4>
                                                    <p className="text-sm text-gray-600">
                                                        External events are managed outside of our platform. You'll need to provide:
                                                    </p>
                                                    <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                                                        <li>Registration URL where participants can sign up</li>
                                                        <li>Optional: Organizer's website for more information</li>
                                                    </ul>
                                                    <p className="text-sm text-gray-600">
                                                        Participants will be redirected to the external registration page to complete their registration.
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Certificate and feedback are not provided❗
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Main Form Fields with Enhanced Styling */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2, duration: 0.6 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center mb-6">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Event Details</h3>
                                        <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full"></div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <InputLabel htmlFor="title" value="Title" className="text-gray-800 text-base font-semibold mb-2 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-orange-500 text-sm">title</span>
                                                Title
                                            </InputLabel>
                                            <TextInput
                                                id="title"
                                                type="text"
                                                name="title"
                                                value={data.title}
                                                className="block w-full bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-gray-900 shadow-sm transition-all duration-200"
                                                onChange={handleChange}
                                            />
                                            <InputError message={errors.title} className="mt-2" />
                                        </div>

                                        <div className="space-y-2">
                                            <InputLabel htmlFor="event_type" value="Event Type" className="text-gray-800 text-base font-semibold mb-2 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-orange-500 text-sm">category</span>
                                                Event Type
                                            </InputLabel>
                                            <select
                                                id="event_type"
                                                name="event_type"
                                                value={data.event_type}
                                                onChange={handleChange}
                                                className="block w-full bg-white border-gray-300 text-gray-900 rounded-xl focus:border-orange-500 focus:ring-orange-500 shadow-sm transition-all duration-200"
                                            >
                                                <option value="">Select event type</option>
                                                <option value="Workshop">Workshop</option>
                                                <option value="Competition">Competition</option>
                                                <option value="Seminar">Seminar</option>
                                            </select>
                                            <InputError message={errors.event_type} className="mt-2" />
                                        </div>

                                        <div className="space-y-2">
                                            <InputLabel htmlFor="date" value="Date" className="text-gray-800 text-base font-semibold mb-2 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-orange-500 text-sm">calendar_today</span>
                                                Date
                                            </InputLabel>
                                            <TextInput
                                                id="date"
                                                type="date"
                                                name="date"
                                                value={data.date}
                                                className="block w-full bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-gray-900 shadow-sm transition-all duration-200"
                                                onChange={handleChange}
                                            />
                                            <InputError message={errors.date} className="mt-2" />
                                        </div>

                                        <div className="space-y-2">
                                            <InputLabel htmlFor="time" value="Time" className="text-gray-800 text-base font-semibold mb-2 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-orange-500 text-sm">schedule</span>
                                                Time
                                            </InputLabel>
                                            <TextInput
                                                id="time"
                                                type="time"
                                                name="time"
                                                value={data.time}
                                                className="block w-full bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-gray-900 shadow-sm transition-all duration-200"
                                                onChange={handleChange}
                                            />
                                            <InputError message={errors.time} className="mt-2" />
                                        </div>

                                        <div className="space-y-2">
                                            <InputLabel htmlFor="location" value="Location" className="text-gray-800 text-base font-semibold mb-2 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-orange-500 text-sm">location_on</span>
                                                Location
                                            </InputLabel>
                                            <TextInput
                                                id="location"
                                                type="text"
                                                name="location"
                                                value={data.location}
                                                className="block w-full bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-gray-900 shadow-sm transition-all duration-200"
                                                onChange={handleChange}
                                            />
                                            <InputError message={errors.location} className="mt-2" />
                                        </div>

                                        {!data.is_external ? (
                                            <div className="space-y-2">
                                                <InputLabel 
                                                    htmlFor="max_participants" 
                                                    value={data.is_team_event ? "Maximum Teams" : "Maximum Participants"} 
                                                    className="text-gray-800 text-base font-semibold mb-2 flex items-center gap-2"
                                                >
                                                    <span className="material-symbols-outlined text-orange-500 text-sm">group</span>
                                                    {data.is_team_event ? "Maximum Teams" : "Maximum Participants"}
                                                </InputLabel>
                                                <TextInput
                                                    id="max_participants"
                                                    type="number"
                                                    name="max_participants"
                                                    value={data.max_participants}
                                                    className="block w-full bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-gray-900 shadow-sm transition-all duration-200"
                                                    onChange={handleChange}
                                                />
                                                <InputError message={errors.max_participants} className="mt-2" />
                                            </div>
                                        ) : (
                                            <>
                                                <div className="space-y-2">
                                                    <InputLabel htmlFor="registration_url" value="Registration URL" className="text-gray-800 text-base font-semibold mb-2 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-orange-500 text-sm">link</span>
                                                        Registration URL
                                                    </InputLabel>
                                                    <TextInput
                                                        id="registration_url"
                                                        type="url"
                                                        name="registration_url"
                                                        value={data.registration_url}
                                                        className="block w-full bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-gray-900 shadow-sm transition-all duration-200"
                                                        onChange={handleChange}
                                                        placeholder="https://..."
                                                    />
                                                    <InputError message={errors.registration_url} className="mt-2" />
                                                </div>
                                                <div className="space-y-2">
                                                    <InputLabel htmlFor="organizer_name" value="Organizer Name" className="text-gray-800 text-base font-semibold mb-2 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-orange-500 text-sm">business</span>
                                                        Organizer Name
                                                    </InputLabel>
                                                    <TextInput
                                                        id="organizer_name"
                                                        type="text"
                                                        name="organizer_name"
                                                        value={data.organizer_name}
                                                        className="block w-full bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-gray-900 shadow-sm transition-all duration-200"
                                                        onChange={handleChange}
                                                    />
                                                    <InputError message={errors.organizer_name} className="mt-2" />
                                                </div>
                                                <div className="space-y-2">
                                                    <InputLabel htmlFor="organizer_website" value="Organizer Website (Optional)" className="text-gray-800 text-base font-semibold mb-2 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-orange-500 text-sm">language</span>
                                                        Organizer Website (Optional)
                                                    </InputLabel>
                                                    <TextInput
                                                        id="organizer_website"
                                                        type="url"
                                                        name="organizer_website"
                                                        value={data.organizer_website}
                                                        className="block w-full bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-gray-900 shadow-sm transition-all duration-200"
                                                        onChange={handleChange}
                                                        placeholder="https://..."
                                                    />
                                                    <InputError message={errors.organizer_website} className="mt-2" />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Team-specific fields for non-external events */}
                                {!data.is_external && data.is_team_event && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.4, duration: 0.6 }}
                                        className="relative p-6 bg-gradient-to-r from-blue-50 to-white rounded-2xl border border-blue-200"
                                    >
                                        <div className="absolute top-4 right-4 w-12 h-12 bg-blue-200 rounded-full opacity-30"></div>
                                        <div className="relative z-10">
                                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                                <span className="material-symbols-outlined text-blue-600">groups</span>
                                                Team Configuration
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <InputLabel htmlFor="min_team_members" value="Minimum Team Size" className="text-gray-800 text-base font-semibold mb-2 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-blue-500 text-sm">group_add</span>
                                                        Minimum Team Size
                                                    </InputLabel>
                                                    <TextInput
                                                        id="min_team_members"
                                                        type="number"
                                                        name="min_team_members"
                                                        min="2"
                                                        value={data.min_team_members}
                                                        className="block w-full bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-gray-900 shadow-sm transition-all duration-200"
                                                        onChange={handleChange}
                                                    />
                                                    <InputError message={errors.min_team_members} className="mt-2" />
                                                </div>
                                                <div className="space-y-2">
                                                    <InputLabel htmlFor="max_team_members" value="Maximum Team Size" className="text-gray-800 text-base font-semibold mb-2 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-blue-500 text-sm">group_remove</span>
                                                        Maximum Team Size
                                                    </InputLabel>
                                                    <TextInput
                                                        id="max_team_members"
                                                        type="number"
                                                        name="max_team_members"
                                                        min={data.min_team_members || 2}
                                                        value={data.max_team_members}
                                                        className="block w-full bg-white border-gray-300 focus:border-blue-500 focus:ring-orange-500 rounded-xl text-gray-900 shadow-sm transition-all duration-200"
                                                        onChange={handleChange}
                                                    />
                                                    <InputError message={errors.max_team_members} className="mt-2" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Description field with Enhanced Styling */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.6, duration: 0.6 }}
                                    className="space-y-2"
                                >
                                    <InputLabel htmlFor="description" value="Description" className="text-gray-800 text-base font-semibold mb-2 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-orange-500 text-sm">description</span>
                                        Description
                                    </InputLabel>
                                    <TextArea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="block w-full bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-gray-900 shadow-sm transition-all duration-200"
                                        rows="5"
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </motion.div>

                                {/* Label Tags Selection with Enhanced Styling */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.8, duration: 0.6 }}
                                    className="relative p-6 bg-gradient-to-r from-orange-50 to-white rounded-2xl border border-orange-200"
                                >
                                    <div className="absolute top-4 right-4 w-12 h-12 bg-orange-200 rounded-full opacity-30"></div>
                                    <div className="relative z-10">
                                        <LabelTagsSelector
                                            selectedTags={data.label_tags}
                                            onChange={(tags) => setData('label_tags', tags)}
                                            error={errors.label_tags}
                                        />
                                    </div>
                                </motion.div>

                                {/* Cover Image Upload with Enhanced Styling */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 2.0, duration: 0.6 }}
                                    className="relative group"
                                >
                                    <input
                                        type="file"
                                        id="cover_image"
                                        name="cover_image"
                                        onChange={handleChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        accept="image/*"
                                    />
                                    <div className="relative border-2 border-dashed border-orange-300 rounded-2xl p-8 text-center hover:border-orange-400 transition-all duration-300 bg-gradient-to-br from-orange-50 to-white hover:from-orange-100 hover:to-white">
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        {!imagePreview ? (
                                            <div className="relative z-10 space-y-4">
                                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full">
                                                    <span className="material-symbols-outlined text-white text-3xl">upload</span>
                                                </div>
                                                <div>
                                                    <p className="text-gray-700 text-lg font-medium">Drop your event cover image here</p>
                                                    <p className="text-gray-500">or click to browse files</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative z-10">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="max-h-56 mx-auto rounded-xl shadow-lg"
                                                />
                                                <p className="text-orange-600 text-sm mt-2 font-medium">Click to change image</p>
                                            </div>
                                        )}
                                    </div>
                                    <InputError message={errors.cover_image} className="mt-3" />
                                </motion.div>

                                {/* Submit Button Section with Enhanced Styling */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 2.2, duration: 0.6 }}
                                    className="relative flex items-center justify-end pt-8 border-t border-gray-200 space-x-4"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-50 to-transparent opacity-50"></div>
                                    <div className="relative z-10 flex items-center gap-4">
                                        <BackButton href={route('events.index')} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200">
                                            Cancel
                                        </BackButton>
                                        <motion.button
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={processing}
                                            type="submit"
                                            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 font-semibold shadow-xl shadow-orange-500/25 transition-all duration-300 flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-lg">
                                                {processing ? 'hourglass_empty' : 'add_circle'}
                                            </span>
                                            {processing ? 'Creating...' : 'Create Event'}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
};

export default Create; 
