import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import TextArea from '@/Components/TextArea';
import { motion } from 'framer-motion';
import { BackButton } from '@/Components/BackButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Edit({ event, auth }) {
    const [imagePreview, setImagePreview] = useState(event.cover_image ? `/${event.cover_image}` : null);
    
    const { data, setData, post, errors, processing } = useForm({
        title: event.title || '',
        date: event.date || '',
        time: new Date(event.time).toTimeString().slice(0, 5) || '',
        location: event.location || '',
        description: event.description || '',
        event_type: event.event_type || '',
        status: event.status || 'Upcoming',
        cover_image: null,
        is_external: event.is_external || false,
        max_participants: event.max_participants || '',
        registration_url: event.registration_url || '',
        organizer_name: event.organizer_name || '',
        organizer_website: event.organizer_website || '',
        is_team_event: event.is_team_event || false,
        min_team_members: event.min_team_members || '2',
        max_team_members: event.max_team_members || '',
        _method: 'put',
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
        
        post(route('events.update', event.event_id), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Event updated successfully!');
            },
            onError: (errors) => {
                if (errors.is_team_event) {
                    toast.error(errors.is_team_event);
                } else {
                    toast.error('Failed to update event. Please check the form for errors.');
                }
            }
        });
    };

    const hasEnrollments = event.enrolled_count > 0;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Edit Event: {event.title}
                    </h2>
                    <BackButton href={route('events.my-events')}>Back to My Events</BackButton>
                </div>
            }
        >
            <Head title={`Edit Event: ${event.title}`} />
            <ToastContainer position="top-right" autoClose={5000} />

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12"
            >
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-[#1E1E2E] overflow-hidden shadow-xl rounded-2xl p-8">
                        <h2 className="text-3xl font-bold text-white mb-8">Edit Event</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Event Type Selector */}
                            <div className="flex justify-between p-6 bg-[#2A2A3A] rounded-lg mb-6">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="is_external"
                                        name="is_external"
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                        checked={data.is_external}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="is_external" className="text-white">
                                        This is an external event
                                    </label>
                                </div>

                                {!data.is_external && (
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="is_team_event"
                                            name="is_team_event"
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                            checked={data.is_team_event}
                                            onChange={handleChange}
                                            disabled={hasEnrollments}
                                        />
                                        <label htmlFor="is_team_event" className={`text-white ${hasEnrollments ? 'opacity-60' : ''}`}>
                                            Team-based event
                                            {hasEnrollments && <span className="ml-2 text-xs text-yellow-400">(Cannot change after enrollments)</span>}
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Cover Image Upload */}
                            <div className="relative group">
                                <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
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
                                            <span className="material-symbols-outlined text-4xl text-gray-400">upload</span>
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

                            {/* Event Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="title" value="Event Title" className="text-white text-base font-semibold mb-1.5" />
                                    <TextInput
                                        id="title"
                                        name="title"
                                        value={data.title}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                        onChange={handleChange}
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="event_type" value="Event Type" className="text-white text-base font-semibold mb-1.5" />
                                    <select
                                        id="event_type"
                                        name="event_type"
                                        value={data.event_type}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 text-white rounded-lg focus:border-blue-500 focus:ring-blue-500"
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select event type</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Competition">Competition</option>
                                        <option value="Seminar">Seminar</option>
                                    </select>
                                    <InputError message={errors.event_type} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="date" value="Event Date" className="text-white text-base font-semibold mb-1.5" />
                                    <TextInput
                                        id="date"
                                        type="date"
                                        name="date"
                                        value={data.date}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                        onChange={handleChange}
                                        required
                                    />
                                    <InputError message={errors.date} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="time" value="Event Time" className="text-white text-base font-semibold mb-1.5" />
                                    <TextInput
                                        id="time"
                                        type="time"
                                        name="time"
                                        value={data.time}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                        onChange={handleChange}
                                        required
                                    />
                                    <InputError message={errors.time} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="location" value="Event Location" className="text-white text-base font-semibold mb-1.5" />
                                    <TextInput
                                        id="location"
                                        name="location"
                                        value={data.location}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                        onChange={handleChange}
                                        required
                                    />
                                    <InputError message={errors.location} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="status" value="Event Status" className="text-white text-base font-semibold mb-1.5" />
                                    <select
                                        id="status"
                                        name="status"
                                        value={data.status}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 text-white rounded-lg focus:border-blue-500 focus:ring-blue-500"
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="Upcoming">Upcoming</option>
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                {/* Conditional fields based on event type */}
                                {!data.is_external ? (
                                    <div>
                                        <InputLabel 
                                            htmlFor="max_participants" 
                                            value={data.is_team_event ? "Maximum Teams" : "Maximum Participants"} 
                                            className="text-white text-base font-semibold mb-1.5" 
                                        />
                                        <TextInput
                                            id="max_participants"
                                            name="max_participants"
                                            type="number"
                                            min="1"
                                            value={data.max_participants}
                                            className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                            onChange={handleChange}
                                            required
                                        />
                                        <InputError message={errors.max_participants} className="mt-2" />
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <InputLabel htmlFor="registration_url" value="Registration URL" className="text-white text-base font-semibold mb-1.5" />
                                            <TextInput
                                                id="registration_url"
                                                name="registration_url"
                                                type="url"
                                                value={data.registration_url}
                                                className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                                onChange={handleChange}
                                                placeholder="https://..."
                                                required
                                            />
                                            <InputError message={errors.registration_url} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="organizer_name" value="Organizer Name" className="text-white text-base font-semibold mb-1.5" />
                                            <TextInput
                                                id="organizer_name"
                                                name="organizer_name"
                                                value={data.organizer_name}
                                                className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                                onChange={handleChange}
                                                required
                                            />
                                            <InputError message={errors.organizer_name} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="organizer_website" value="Organizer Website (Optional)" className="text-white text-base font-semibold mb-1.5" />
                                            <TextInput
                                                id="organizer_website"
                                                name="organizer_website"
                                                type="url"
                                                value={data.organizer_website}
                                                className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                                onChange={handleChange}
                                                placeholder="https://..."
                                            />
                                            <InputError message={errors.organizer_website} className="mt-2" />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Description field */}
                                <div>
                                <InputLabel htmlFor="description" value="Description" className="text-white text-base font-semibold mb-1.5" />
                                <TextArea
                                        id="description"
                                    name="description"
                                        value={data.description}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                        rows="4"
                                    onChange={handleChange}
                                    required
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                            </div>

                            {/* Team-specific fields if needed */}
                            {!data.is_external && data.is_team_event && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-700">
                                    <div>
                                        <InputLabel htmlFor="min_team_members" value="Minimum Team Size" className="text-white text-base font-semibold mb-1.5" />
                                        <TextInput
                                            id="min_team_members"
                                            name="min_team_members"
                                            type="number"
                                            min="2"
                                            value={data.min_team_members}
                                            className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                            onChange={handleChange}
                                            required
                                        />
                                        <InputError message={errors.min_team_members} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="max_team_members" value="Maximum Team Size" className="text-white text-base font-semibold mb-1.5" />
                                        <TextInput
                                            id="max_team_members"
                                            name="max_team_members"
                                            type="number"
                                            min={data.min_team_members || 2}
                                            value={data.max_team_members}
                                            className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                            onChange={handleChange}
                                            required
                                        />
                                        <InputError message={errors.max_team_members} className="mt-2" />
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex items-center justify-end mt-6 pt-4 border-t border-gray-700">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 font-medium shadow-lg shadow-blue-500/20 transition-all duration-200"
                                >
                                    {processing ? 'Updating...' : 'Update Event'}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
} 