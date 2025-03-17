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
        
        router.post(route('events.update', event.event_id), {
            _method: 'PUT',
            title: data.title,
            date: data.date,
            time: data.time,
            location: data.location,
            description: data.description,
            max_participants: data.max_participants,
            event_type: data.event_type,
            status: data.status,
            cover_image: data.cover_image,
        }, {
            forceFormData: true,
            preserveScroll: true,
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
                            {/* Event Details Section */}
                            <div className="border-t border-gray-700 pt-6">
                                <h3 className="text-xl font-semibold text-blue-400 mb-4">Event Details</h3>
                            </div>

                            {/* Two columns grid for form fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel 
                                        htmlFor="title" 
                                        value="Title *" 
                                        className="text-white text-base font-semibold mb-1.5"
                                    />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                    />
                                </div>

                                <div>
                                    <InputLabel 
                                        htmlFor="event_type" 
                                        value="Event Type *" 
                                        className="text-white text-base font-semibold mb-1.5"
                                    />
                                    <select
                                        id="event_type"
                                        value={data.event_type}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 text-white rounded-lg focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Select Event Type</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Competition">Competition</option>
                                        <option value="Seminar">Seminar</option>
                                    </select>
                                </div>

                                <div>
                                    <InputLabel 
                                        htmlFor="date" 
                                        value="Date" 
                                        className="text-white text-base font-semibold mb-1.5"
                                    />
                                    <TextInput
                                        id="date"
                                        type="date"
                                        value={data.date}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                    />
                                </div>

                                <div>
                                    <InputLabel 
                                        htmlFor="time" 
                                        value="Time" 
                                        className="text-white text-base font-semibold mb-1.5"
                                    />
                                    <TextInput
                                        id="time"
                                        type="time"
                                        value={data.time}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                    />
                                </div>

                                <div>
                                    <InputLabel 
                                        htmlFor="location" 
                                        value="Location" 
                                        className="text-white text-base font-semibold mb-1.5"
                                    />
                                    <TextInput
                                        id="location"
                                        type="text"
                                        value={data.location}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                    />
                                </div>

                                <div>
                                    <InputLabel 
                                        htmlFor="max_participants" 
                                        value="Maximum Participants" 
                                        className="text-white text-base font-semibold mb-1.5"
                                    />
                                    <TextInput
                                        id="max_participants"
                                        type="number"
                                        value={data.max_participants}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                    />
                                </div>
                            </div>

                            {/* Status Section */}
                            <div className="border-t border-gray-700 pt-6">
                                <h3 className="text-xl font-semibold text-blue-400 mb-4">Event Status</h3>
                                <div>
                                    <InputLabel 
                                        htmlFor="status" 
                                        value="Status" 
                                        className="text-white text-base font-semibold mb-1.5"
                                    />
                                    <select
                                        id="status"
                                        value={data.status}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 text-white rounded-lg focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="Upcoming">Upcoming</option>
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
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
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                        rows="4"
                                    />
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
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
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