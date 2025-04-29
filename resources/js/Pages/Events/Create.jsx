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

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12"
            >
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-[#1E1E2E] overflow-hidden shadow-xl rounded-2xl p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-[#635985]/20 rounded-xl">
                                <span className="material-symbols-outlined text-3xl text-[#635985]">event</span>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white">Create New Event</h2>
                                <p className="text-gray-400 mt-1">Fill in the details below to create your event</p>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Event Type Selector */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Event Source Dropdown */}
                                <div className="space-y-2">
                                    <label htmlFor="event_source" className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#635985] text-lg">source</span>
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
                                            className="w-full bg-[#2A2A3A] border border-gray-600 text-white rounded-lg px-4 py-2.5 focus:border-[#635985] focus:ring-[#635985] transition-colors"
                                        >
                                            <option value="false">Internal Event</option>
                                            <option value="true">External Event</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Participation Type Dropdown - Only show for internal events */}
                                {!data.is_external && (
                                    <div className="space-y-2">
                                        <label htmlFor="participation_type" className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#635985] text-lg">groups</span>
                                            Participation Type
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="participation_type"
                                                name="is_team_event"
                                                value={data.is_team_event}
                                                onChange={(e) => setData('is_team_event', e.target.value === 'true')}
                                                className="w-full bg-[#2A2A3A] border border-gray-600 text-white rounded-lg px-4 py-2.5 focus:border-[#635985] focus:ring-[#635985] transition-colors"
                                            >
                                                <option value="false">Individual Participation</option>
                                                <option value="true">Team-based Participation</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Current Selection Display */}
                            <div className="flex items-center gap-3 text-white bg-[#2A2A3A] rounded-lg px-4 py-2.5 border border-[#635985]/20">
                                <span className="material-symbols-outlined text-[#635985]">info</span>
                                <p className="text-sm">
                                    You are creating a{' '}
                                    <span className="font-semibold text-[#635985]">
                                        {data.is_external ? 'External' : 'Internal'} {data.event_type || 'Event'}
                                    </span>
                                    {!data.is_external && (
                                        <>
                                            {' '}with{' '}
                                            <span className="font-semibold text-[#635985]">
                                                {data.is_team_event ? 'Team-based' : 'Individual'} Participation
                                            </span>
                                        </>
                                    )}
                                </p>
                            </div>

                            {/* Explanatory Text for Team-based and External Events */}
                            {(data.is_team_event || data.is_external) && (
                                <div className="space-y-3">
                                    {data.is_team_event && !data.is_external && (
                                        <div className="flex items-start gap-3 bg-[#2A2A3A]/50 rounded-lg p-4 border border-[#635985]/20">
                                            <span className="material-symbols-outlined text-[#635985] mt-0.5">groups</span>
                                            <div className="space-y-2">
                                                <h4 className="text-white font-medium">Team-based Participation</h4>
                                                <p className="text-sm text-gray-400">
                                                    In team-based events, participants must form teams to compete. You'll need to specify:
                                                </p>
                                                <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
                                                    <li>Minimum number of members per team (at least 2)</li>
                                                    <li>Maximum number of members allowed per team</li>
                                                    <li>Maximum number of teams that can participate</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {data.is_external && (
                                        <div className="flex items-start gap-3 bg-[#2A2A3A]/50 rounded-lg p-4 border border-[#635985]/20">
                                            <span className="material-symbols-outlined text-[#635985] mt-0.5">link</span>
                                            <div className="space-y-2">
                                                <h4 className="text-white font-medium">External Event</h4>
                                                <p className="text-sm text-gray-400">
                                                    External events are managed outside of our platform. You'll need to provide:
                                                </p>
                                                <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
                                                    <li>Registration URL where participants can sign up</li>
                                                    <li>Optional: Organizer's website for more information</li>
                                                </ul>
                                                <p className="text-sm text-gray-400">
                                                    Participants will be redirected to the external registration page to complete their registration.
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    Certificate and feedback are not provided❗
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Main Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="title" value="Title" className="text-white text-base font-semibold mb-1.5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#635985] text-lg">title</span>
                                        Title
                                    </InputLabel>
                                    <TextInput
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={data.title}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-[#635985] focus:ring-[#635985] rounded-lg text-white transition-colors"
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="event_type" value="Event Type" className="text-white text-base font-semibold mb-1.5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#635985] text-lg">category</span>
                                        Event Type
                                    </InputLabel>
                                    <select
                                        id="event_type"
                                        name="event_type"
                                        value={data.event_type}
                                        onChange={handleChange}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 text-white rounded-lg focus:border-[#635985] focus:ring-[#635985] transition-colors"
                                    >
                                        <option value="">Select event type</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Competition">Competition</option>
                                        <option value="Seminar">Seminar</option>
                                    </select>
                                    <InputError message={errors.event_type} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="date" value="Date" className="text-white text-base font-semibold mb-1.5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#635985] text-lg">calendar_today</span>
                                        Date
                                    </InputLabel>
                                    <TextInput
                                        id="date"
                                        type="date"
                                        name="date"
                                        value={data.date}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-[#635985] focus:ring-[#635985] rounded-lg text-white [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert transition-colors"
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.date} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="time" value="Time" className="text-white text-base font-semibold mb-1.5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#635985] text-lg">schedule</span>
                                        Time
                                    </InputLabel>
                                    <TextInput
                                        id="time"
                                        type="time"
                                        name="time"
                                        value={data.time}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-[#635985] focus:ring-[#635985] rounded-lg text-white [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert transition-colors"
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.time} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="location" value="Location" className="text-white text-base font-semibold mb-1.5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#635985] text-lg">location_on</span>
                                        Location
                                    </InputLabel>
                                    <TextInput
                                        id="location"
                                        type="text"
                                        name="location"
                                        value={data.location}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-[#635985] focus:ring-[#635985] rounded-lg text-white transition-colors"
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.location} className="mt-2" />
                                </div>

                                {!data.is_external ? (
                                    <div>
                                        <InputLabel 
                                            htmlFor="max_participants" 
                                            value={data.is_team_event ? "Maximum Teams" : "Maximum Participants"} 
                                            className="text-white text-base font-semibold mb-1.5 flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-[#635985] text-lg">group</span>
                                            {data.is_team_event ? "Maximum Teams" : "Maximum Participants"}
                                        </InputLabel>
                                        <TextInput
                                            id="max_participants"
                                            type="number"
                                            name="max_participants"
                                            value={data.max_participants}
                                            className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-[#635985] focus:ring-[#635985] rounded-lg text-white transition-colors"
                                            onChange={handleChange}
                                        />
                                        <InputError message={errors.max_participants} className="mt-2" />
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <InputLabel htmlFor="registration_url" value="Registration URL" className="text-white text-base font-semibold mb-1.5 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[#635985] text-lg">link</span>
                                                Registration URL
                                            </InputLabel>
                                            <TextInput
                                                id="registration_url"
                                                type="url"
                                                name="registration_url"
                                                value={data.registration_url}
                                                className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-[#635985] focus:ring-[#635985] rounded-lg text-white transition-colors"
                                                onChange={handleChange}
                                                placeholder="https://..."
                                            />
                                            <InputError message={errors.registration_url} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="organizer_name" value="Organizer Name" className="text-white text-base font-semibold mb-1.5 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[#635985] text-lg">business</span>
                                                Organizer Name
                                            </InputLabel>
                                            <TextInput
                                                id="organizer_name"
                                                type="text"
                                                name="organizer_name"
                                                value={data.organizer_name}
                                                className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-[#635985] focus:ring-[#635985] rounded-lg text-white transition-colors"
                                                onChange={handleChange}
                                            />
                                            <InputError message={errors.organizer_name} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="organizer_website" value="Organizer Website (Optional)" className="text-white text-base font-semibold mb-1.5 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[#635985] text-lg">language</span>
                                                Organizer Website (Optional)
                                            </InputLabel>
                                            <TextInput
                                                id="organizer_website"
                                                type="url"
                                                name="organizer_website"
                                                value={data.organizer_website}
                                                className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-[#635985] focus:ring-[#635985] rounded-lg text-white transition-colors"
                                                onChange={handleChange}
                                                placeholder="https://..."
                                            />
                                            <InputError message={errors.organizer_website} className="mt-2" />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Team-specific fields for non-external events */}
                            {!data.is_external && data.is_team_event && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="min_team_members" value="Minimum Team Size" className="text-white text-base font-semibold mb-1.5 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#635985] text-lg">group_add</span>
                                            Minimum Team Size
                                        </InputLabel>
                                        <TextInput
                                            id="min_team_members"
                                            type="number"
                                            name="min_team_members"
                                            min="2"
                                            value={data.min_team_members}
                                            className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-[#635985] focus:ring-[#635985] rounded-lg text-white transition-colors"
                                            onChange={handleChange}
                                        />
                                        <InputError message={errors.min_team_members} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="max_team_members" value="Maximum Team Size" className="text-white text-base font-semibold mb-1.5 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#635985] text-lg">group_remove</span>
                                            Maximum Team Size
                                        </InputLabel>
                                        <TextInput
                                            id="max_team_members"
                                            type="number"
                                            name="max_team_members"
                                            min={data.min_team_members || 2}
                                            value={data.max_team_members}
                                            className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-[#635985] focus:ring-[#635985] rounded-lg text-white transition-colors"
                                            onChange={handleChange}
                                        />
                                        <InputError message={errors.max_team_members} className="mt-2" />
                                    </div>
                                </div>
                            )}

                            {/* Description field */}
                            <div>
                                <InputLabel htmlFor="description" value="Description" className="text-white text-base font-semibold mb-1.5 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#635985] text-lg">description</span>
                                    Description
                                </InputLabel>
                                <TextArea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-[#635985] focus:ring-[#635985] rounded-lg text-white transition-colors"
                                    rows="4"
                                    onChange={handleChange}
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            {/* Cover Image Upload */}
                            <div className="relative group">
                                <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-[#635985] transition-colors">
                                    <input
                                        type="file"
                                        id="cover_image"
                                        name="cover_image"
                                        onChange={handleChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept="image/*"
                                    />
                                    {!imagePreview ? (
                                        <div className="space-y-2">
                                            <span className="material-symbols-outlined text-4xl text-[#635985]">upload</span>
                                            <p className="text-gray-400">Drop your event cover image here or click to browse</p>
                                        </div>
                                    ) : (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-h-48 mx-auto rounded-lg"
                                        />
                                    )}
                                </div>
                                <InputError message={errors.cover_image} className="mt-2" />
                            </div>

                            {/* Submit button */}
                            <div className="flex items-center justify-end pt-4 space-x-4">
                                <BackButton href={route('events.index')}>
                                    Cancel
                                </BackButton>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={processing}
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-[#635985] to-[#4B3B6E] text-white rounded-lg hover:from-[#4B3B6E] hover:to-[#635985] disabled:opacity-50 font-medium shadow-lg shadow-[#635985]/20 transition-all duration-200"
                                >
                                    {processing ? 'Creating...' : 'Create Event'}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
};

export default Create; 
