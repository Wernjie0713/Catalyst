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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Provide Feedback</h2>}
        >
            <Head title="Provide Feedback" />

            <div className="py-6">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    {/* Optimized Layout with Better Space Usage */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        
                        {/* Left Column - Event Info & Navigation (Optimized) */}
                        <div className="lg:col-span-1 space-y-4">
                            {/* Event Summary Card - More Compact */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5">
                                <div className="text-center mb-4">
                                    <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 rounded-full mb-3">
                                        <span className="material-symbols-outlined text-[#F37022] text-2xl">event</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">Event Details</h3>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <span className="material-symbols-outlined text-[#F37022] text-base">title</span>
                                        <span className="text-base font-medium text-gray-700">{event.title}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <span className="material-symbols-outlined text-[#F37022] text-base">calendar_month</span>
                                        <span className="text-base text-gray-600">{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <span className="material-symbols-outlined text-[#F37022] text-base">location_on</span>
                                        <span className="text-base text-gray-600">{event.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Card - More Compact */}
                            <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl border border-white p-5">
                                <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#F37022] text-base">navigation</span>
                                    Quick Actions
                                </h4>
                                <Link
                                    href={route('events.my-events')}
                                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-[#F37022] text-white rounded-xl font-medium hover:bg-[#d95f16] transition-colors text-base"
                                >
                                    <span className="material-symbols-outlined mr-2 text-base">arrow_back</span>
                                    Back to Events
                                </Link>
                            </div>
                        </div>

                        {/* Right Column - Feedback Form (Optimized) */}
                        <div className="lg:col-span-3">
                            {/* Main Feedback Form - Better Proportions */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                                {/* Form Header - More Compact */}
                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <span className="material-symbols-outlined text-white text-3xl">rate_review</span>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">
                                                {existingFeedback ? 'Update Your Review' : 'Share Your Experience'}
                                            </h2>
                                            <p className="text-orange-100 text-base mt-1">
                                                Your feedback helps us improve future events
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {/* Rating Section - Enhanced & Better Sized */}
                                        <div>
                                            <div className="mb-6">
                                                <InputLabel htmlFor="rating" value="How would you rate this event?" className="text-gray-800 text-lg font-semibold mb-3" />
                                                <p className="text-gray-600 text-base">Click on a star to rate from 1 (Poor) to 5 (Excellent)</p>
                                            </div>
                                            
                                            <div className="bg-gradient-to-r from-orange-50 to-white rounded-2xl p-10 border border-orange-200">
                                                <div className="flex flex-col items-center">
                                                    {/* Star Rating - Larger & Better Spaced */}
                                                    <div className="flex items-center justify-center space-x-4 mb-8">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setData('rating', star)}
                                                                className={`text-6xl focus:outline-none transition-all duration-300 transform hover:scale-110 ${
                                                                    star <= data.rating ? 'text-[#F37022]' : 'text-gray-300'
                                                                }`}
                                                            >
                                                                ★
                                                            </button>
                                                        ))}
                                                    </div>
                                                    
                                                    {/* Rating Description - Better Sized */}
                                                    <div className="text-center">
                                                        <div className="text-3xl font-bold text-[#F37022] mb-3">
                                                            {data.rating === 1 && 'Poor'}
                                                            {data.rating === 2 && 'Fair'}
                                                            {data.rating === 3 && 'Good'}
                                                            {data.rating === 4 && 'Very Good'}
                                                            {data.rating === 5 && 'Excellent'}
                                                        </div>
                                                        <p className="text-gray-600 text-base">
                                                            {data.rating === 1 && 'We\'re sorry to hear that'}
                                                            {data.rating === 2 && 'We\'ll work to improve'}
                                                            {data.rating === 3 && 'Thanks for your feedback'}
                                                            {data.rating === 4 && 'We\'re glad you enjoyed it'}
                                                            {data.rating === 5 && 'We\'re thrilled you loved it'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <InputError message={errors.rating} className="mt-4" />
                                        </div>

                                        {/* Comment Section - Enhanced & Better Sized */}
                                        <div>
                                            <div className="mb-6">
                                                <InputLabel htmlFor="comment" value="Additional Comments" className="text-gray-800 text-lg font-semibold mb-3" />
                                                <p className="text-gray-600 text-base">Share your thoughts, suggestions, or specific feedback (optional but appreciated)</p>
                                            </div>
                                            
                                            <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
                                                <TextArea
                                                    id="comment"
                                                    className="w-full border-gray-300 bg-white text-gray-700 focus:border-[#F37022] focus:ring-[#F37022] rounded-xl shadow-sm resize-none text-base"
                                                    value={data.comment}
                                                    onChange={(e) => setData('comment', e.target.value)}
                                                    rows={8}
                                                    placeholder="Tell us about your experience... What went well? What could be improved? Any suggestions for future events?"
                                                />
                                            </div>
                                            <InputError message={errors.comment} className="mt-4" />
                                        </div>

                                        {/* Submit Section - Better Proportions */}
                                        <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                                <div className="text-center sm:text-left">
                                                    <p className="text-base text-gray-600">
                                                        {existingFeedback ? 'Update your feedback to help us improve' : 'Submit your feedback to help us improve future events'}
                                                    </p>
                                                </div>
                                                <PrimaryButton 
                                                    className="px-10 py-4 bg-[#F37022] hover:bg-[#d95f16] focus:bg-[#d95f16] text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-3 shadow-lg text-base" 
                                                    disabled={processing}
                                                >
                                                    <span className="material-symbols-outlined text-xl">
                                                        {processing ? 'hourglass_empty' : (existingFeedback ? 'update' : 'send')}
                                                    </span>
                                                    {processing ? 'Submitting...' : (existingFeedback ? 'Update Feedback' : 'Submit Feedback')}
                                                </PrimaryButton>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 