import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import TextArea from '@/Components/TextArea';
import PrimaryButton from '@/Components/PrimaryButton';
import { format } from 'date-fns';

export default function Create({ auth, event, existingFeedback }) {
    const { data, setData, post, processing, errors } = useForm({
        rating: existingFeedback ? existingFeedback.rating : 3,
        comment: existingFeedback ? existingFeedback.comment : '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('feedback.store', event.event_id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-200 leading-tight">Provide Feedback</h2>}
        >
            <Head title="Provide Feedback" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Event Header Card */}
                    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm overflow-hidden shadow-xl sm:rounded-xl mb-6 border border-gray-700/50">
                        <div className="p-6 sm:p-8">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <p className="text-gray-300 flex items-center">
                                            <span className="material-symbols-outlined mr-1 text-indigo-400">calendar_month</span>
                                            {format(new Date(event.date), 'MMMM dd, yyyy')}
                                        </p>
                                        <p className="text-gray-300 flex items-center">
                                            <span className="material-symbols-outlined mr-1 text-indigo-400">location_on</span>
                                            {event.location}
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href={route('events.my-events')}
                                    className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-gray-800 border border-gray-600 rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <span className="material-symbols-outlined mr-1">arrow_back</span>
                                    Back to Events
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Feedback Form Card */}
                    <div className="bg-gray-800/50 backdrop-blur-sm overflow-hidden shadow-xl sm:rounded-xl border border-gray-700/50">
                        <div className="p-6 sm:p-8">
                            <h4 className="text-xl font-semibold text-white mb-6">
                                {existingFeedback ? 'Update Your Review' : 'Share Your Experience'}
                            </h4>

                            <form onSubmit={handleSubmit}>
                                {/* Rating Section */}
                                <div className="mb-8">
                                    <InputLabel htmlFor="rating" value="How would you rate this event?" className="text-gray-300 text-lg mb-3" />
                                    
                                    <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-800/50">
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center justify-center space-x-4 mb-4">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setData('rating', star)}
                                                        className={`text-4xl focus:outline-none transition-all duration-200 transform hover:scale-110 ${
                                                            star <= data.rating ? 'text-yellow-400' : 'text-gray-600'
                                                        }`}
                                                    >
                                                        ★
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="text-center text-gray-400 mt-2">
                                                {data.rating === 1 && 'Poor'}
                                                {data.rating === 2 && 'Fair'}
                                                {data.rating === 3 && 'Good'}
                                                {data.rating === 4 && 'Very Good'}
                                                {data.rating === 5 && 'Excellent'}
                                            </div>
                                        </div>
                                    </div>
                                    <InputError message={errors.rating} className="mt-2" />
                                </div>

                                {/* Comment Section */}
                                <div className="mb-8">
                                    <InputLabel htmlFor="comment" value="Additional Comments (Optional)" className="text-gray-300 text-lg mb-3" />
                                    <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-800/50">
                                        <TextArea
                                            id="comment"
                                            className="w-full border-gray-700 bg-gray-800/50 text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.comment}
                                            onChange={(e) => setData('comment', e.target.value)}
                                            rows={5}
                                            placeholder="Share your thoughts about the event..."
                                        />
                                    </div>
                                    <InputError message={errors.comment} className="mt-2" />
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center justify-end">
                                    <PrimaryButton 
                                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg transition-all duration-200 flex items-center" 
                                        disabled={processing}
                                    >
                                        <span className="material-symbols-outlined mr-2">
                                            {existingFeedback ? 'update' : 'rate_review'}
                                        </span>
                                        {existingFeedback ? 'Update Feedback' : 'Submit Feedback'}
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