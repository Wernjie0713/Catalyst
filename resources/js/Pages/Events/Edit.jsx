import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useState } from 'react';

const Edit = ({ event }) => {
    const formattedDate = format(new Date(event.date), 'yyyy-MM-dd');
    const formattedTime = format(new Date(event.time), 'HH:mm');

    const { data, setData, processing, errors } = useForm({
        title: event.title,
        date: formattedDate,
        time: formattedTime,
        location: event.location,
        description: event.description,
        max_participants: event.max_participants,
        event_type: event.event_type,
        status: event.status,
        cover_image: null,
        is_external: event.is_external,
        registration_url: event.registration_url || '',
        organizer_name: event.organizer_name || '',
        organizer_website: event.organizer_website || '',
    });

    const [imagePreview, setImagePreview] = useState(
        event.cover_image ? `/${event.cover_image}` : null
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('cover_image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Create form data based on event type
        const formData = {
            _method: 'PUT',
            title: data.title,
            date: data.date,
            time: data.time,
            location: data.location,
            description: data.description,
            event_type: data.event_type,
            status: data.status,
            cover_image: data.cover_image,
            is_external: data.is_external,
        };

        // Add fields specific to event type
        if (data.is_external) {
            Object.assign(formData, {
                registration_url: data.registration_url,
                organizer_name: data.organizer_name,
                organizer_website: data.organizer_website,
                // Set max_participants to null for external events
                max_participants: null
            });
        } else {
            Object.assign(formData, {
                max_participants: data.max_participants,
                // Set external fields to null for internal events
                registration_url: null,
                organizer_name: null,
                organizer_website: null
            });
        }

        router.post(route('events.update', event.event_id), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                // Optional: Add success notification or redirect
            },
            onError: (errors) => {
                console.error('Update failed:', errors);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Event" />

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12"
            >
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-[#1E1E2E] overflow-hidden shadow-xl rounded-2xl p-8">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white">Edit Event</h2>
                            <p className="mt-2 text-blue-400 text-lg">Update your event details below</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                            {/* Event Type Toggle */}
                            <div className="flex items-center justify-end space-x-4 mb-6">
                                <span className="text-gray-400">External Event</span>
                                <div className={`px-3 py-1 rounded-full text-sm ${
                                    data.is_external 
                                        ? 'bg-purple-500/20 text-purple-400' 
                                        : 'bg-blue-500/20 text-blue-400'
                                }`}>
                                    {data.is_external ? 'External' : 'Internal'}
                                </div>
                            </div>

                            {/* Event Details Section */}
                            <div className="border-t border-gray-700 pt-6">
                                <h3 className="text-xl font-semibold text-blue-400 mb-4">Event Details</h3>
                            </div>

                            {/* Two columns grid for form fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="title" value="Title * " className="text-white" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="event_type" value="Event Type *" className="text-white" />
                                    <select
                                        id="event_type"
                                        value={data.event_type}
                                        onChange={e => setData('event_type', e.target.value)}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                    >
                                        <option value="">Select Event Type</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Competition">Competition</option>
                                        <option value="Seminar">Seminar</option>
                                    </select>
                                    <InputError message={errors.event_type} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="date" value="Date" className="text-white" />
                                    <TextInput
                                        id="date"
                                        type="date"
                                        value={data.date}
                                        onChange={e => setData('date', e.target.value)}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                    />
                                    <InputError message={errors.date} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="time" value="Time" className="text-white" />
                                    <TextInput
                                        id="time"
                                        type="time"
                                        value={data.time}
                                        onChange={e => setData('time', e.target.value)}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                    />
                                    <InputError message={errors.time} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="location" value="Location" className="text-white" />
                                    <TextInput
                                        id="location"
                                        type="text"
                                        value={data.location}
                                        onChange={e => setData('location', e.target.value)}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                    />
                                    <InputError message={errors.location} className="mt-2" />
                                </div>

                                {data.is_external ? (
                                    <>
                                        <div>
                                            <InputLabel htmlFor="registration_url" value="Registration URL *" className="text-white" />
                                            <TextInput
                                                id="registration_url"
                                                type="url"
                                                value={data.registration_url}
                                                onChange={e => setData('registration_url', e.target.value)}
                                                className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                            />
                                            <InputError message={errors.registration_url} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="organizer_name" value="Organizer Name *" className="text-white" />
                                            <TextInput
                                                id="organizer_name"
                                                type="text"
                                                value={data.organizer_name}
                                                onChange={e => setData('organizer_name', e.target.value)}
                                                className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                            />
                                            <InputError message={errors.organizer_name} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="organizer_website" value="Organizer Website" className="text-white" />
                                            <TextInput
                                                id="organizer_website"
                                                type="url"
                                                value={data.organizer_website}
                                                onChange={e => setData('organizer_website', e.target.value)}
                                                className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                            />
                                            <InputError message={errors.organizer_website} className="mt-2" />
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <InputLabel htmlFor="max_participants" value="Maximum Participants *" className="text-white" />
                                        <TextInput
                                            id="max_participants"
                                            type="number"
                                            value={data.max_participants}
                                            onChange={e => setData('max_participants', e.target.value)}
                                            className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                        />
                                        <InputError message={errors.max_participants} className="mt-2" />
                                    </div>
                                )}
                            </div>

                            {/* Description Section */}
                            <div className="border-t border-gray-700 pt-6">
                                <h3 className="text-xl font-semibold text-blue-400 mb-4">Additional Information</h3>
                                <div>
                                    <InputLabel 
                                        htmlFor="description" 
                                        value="Description" 
                                        className="text-white text-base font-semibold mb-1.5"
                                    />
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                        rows="4"
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>
                            </div>

                            {/* Event Cover Section */}
                            <div className="border-t border-gray-700 pt-6">
                                <h3 className="text-xl font-semibold text-blue-400 mb-4">Event Cover</h3>
                                <div className="space-y-4">
                                    {imagePreview && (
                                        <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-800">
                                            <img 
                                                src={imagePreview}
                                                alt="Event cover preview" 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <InputLabel 
                                            htmlFor="cover_image" 
                                            value="Cover Image" 
                                            className="text-white text-base font-semibold mb-1.5"
                                        />
                                        <input
                                            type="file"
                                            id="cover_image"
                                            onChange={handleImageChange}
                                            className="mt-1 block w-full text-white
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-lg file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-500 file:text-white
                                                hover:file:bg-blue-600
                                                cursor-pointer"
                                            accept="image/*"
                                        />
                                        <p className="mt-1 text-sm text-gray-400">
                                            Recommended size: 1920x1080px. Max file size: 2MB
                                        </p>
                                        <InputError message={errors.cover_image} className="mt-2" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 font-medium shadow-lg shadow-blue-500/20 transition-all duration-200"
                                >
                                    {processing ? 'Updating...' : 'Update Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
};

export default Edit; 