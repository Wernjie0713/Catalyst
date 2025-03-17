import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { motion } from 'framer-motion';

const Create = () => {
    const [imagePreview, setImagePreview] = useState(null);
    
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        max_participants: '',
        event_type: '',
        cover_image: null,
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('cover_image', file);
        
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('events.store'), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Event" />

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12"
            >
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-[#1E1E2E] overflow-hidden shadow-xl rounded-2xl p-8">
                        <h2 className="text-3xl font-bold text-white mb-8">Create New Event</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Cover Image Upload */}
                            <div className="relative group">
                                <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                                    <input
                                        type="file"
                                        id="cover_image"
                                        onChange={handleImageChange}
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

                            {/* Two columns grid for form fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel 
                                        htmlFor="title" 
                                        value="Title" 
                                        className="text-white text-base font-semibold mb-1.5"
                                    />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-white"
                                        onChange={e => setData('title', e.target.value)}
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel 
                                        htmlFor="event_type" 
                                        value="Event Type" 
                                        className="text-white text-base font-semibold mb-1.5"
                                    />
                                    <select
                                        id="event_type"
                                        value={data.event_type}
                                        className="mt-1 block w-full bg-[#2A2A3A] border-gray-600 text-white rounded-lg focus:border-blue-500 focus:ring-blue-500"
                                        onChange={e => setData('event_type', e.target.value)}
                                    >
                                        <option value="">Select event type</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Competition">Competition</option>
                                        <option value="Seminar">Seminar</option>
                                    </select>
                                    <InputError message={errors.event_type} className="mt-2" />
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
                                        onChange={e => setData('date', e.target.value)}
                                    />
                                    <InputError message={errors.date} className="mt-2" />
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
                                        onChange={e => setData('time', e.target.value)}
                                    />
                                    <InputError message={errors.time} className="mt-2" />
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
                                        onChange={e => setData('location', e.target.value)}
                                    />
                                    <InputError message={errors.location} className="mt-2" />
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
                                        onChange={e => setData('max_participants', e.target.value)}
                                    />
                                    <InputError message={errors.max_participants} className="mt-2" />
                                </div>
                            </div>

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
                                    onChange={e => setData('description', e.target.value)}
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={processing}
                                    type="submit"
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1E1E2E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    Create Event
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