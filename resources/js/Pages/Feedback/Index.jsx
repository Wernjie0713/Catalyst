import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { format } from 'date-fns';
import { Link } from '@inertiajs/react';

export default function Index({ auth, event, feedback, averageRating }) {
    // Calculate rating distribution
    const ratingCounts = [0, 0, 0, 0, 0]; // For 1-5 stars
    feedback.forEach(item => {
        if (item.rating >= 1 && item.rating <= 5) {
            ratingCounts[item.rating - 1]++;
        }
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Event Feedback</h2>}
        >
            <Head title="Event Feedback" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Clean Page Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-400"></div>
                            <h1 className="text-2xl font-bold text-gray-800">Feedback & Reviews</h1>
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-400"></div>
                        </div>
                        <p className="text-center text-gray-600">Event feedback from participants</p>
                    </div>

                    {/* Enhanced Event Header Card */}
                    <div className="bg-gradient-to-br from-orange-50 via-white to-orange-50 overflow-hidden shadow-xl rounded-2xl mb-8 border border-white">
                        <div className="p-8">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white text-2xl">event</span>
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-bold text-gray-800">{event.title}</h3>
                                            <p className="text-gray-500 text-sm">Event Details</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-orange-100 shadow-sm">
                                            <span className="material-symbols-outlined text-[#F37022] text-xl">calendar_month</span>
                                            <div>
                                                <p className="text-sm text-gray-500 font-medium">Event Date</p>
                                                <p className="text-gray-800 font-semibold">{format(new Date(event.date), 'MMMM dd, yyyy')}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-orange-100 shadow-sm">
                                            <span className="material-symbols-outlined text-[#F37022] text-xl">location_on</span>
                                            <div>
                                                <p className="text-sm text-gray-500 font-medium">Location</p>
                                                <p className="text-gray-800 font-semibold">{event.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-center lg:items-end gap-4">
                                    <div className="text-center lg:text-right">
                                        <p className="text-sm text-gray-500 mb-1">Total Reviews</p>
                                        <p className="text-2xl font-bold text-[#F37022]">{feedback.length}</p>
                                    </div>
                                    <Link
                                        href={route('events.my-events')}
                                        className="inline-flex items-center px-6 py-3 bg-[#F37022] text-white rounded-xl font-semibold hover:bg-[#d95f16] transition-colors shadow-lg"
                                    >
                                        <span className="material-symbols-outlined mr-2">arrow_back</span>
                                        Back to Events
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Rating Summary Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-200 h-full">
                                <div className="p-6">
                                    <h4 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#F37022]">analytics</span>
                                        Rating Summary
                                    </h4>
                                    
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="text-center">
                                            <div className="text-5xl font-bold text-[#F37022] mb-2">
                                                {averageRating ? averageRating.toFixed(1) : '-'}
                                            </div>
                                            <div className="flex justify-center mb-3">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span 
                                                        key={star} 
                                                        className={`text-2xl ${
                                                            star <= Math.round(averageRating) ? 'text-[#F37022]' : 'text-gray-300'
                                                        }`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-gray-500 text-sm">
                                                {feedback.length} {feedback.length === 1 ? 'review' : 'reviews'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Rating Distribution */}
                                    <div className="space-y-4">
                                        <h5 className="text-sm font-semibold text-gray-700 mb-3">Rating Breakdown</h5>
                                        {[5, 4, 3, 2, 1].map((rating) => {
                                            const count = ratingCounts[rating - 1];
                                            const percentage = feedback.length > 0 
                                                ? Math.round((count / feedback.length) * 100) 
                                                : 0;
                                                
                                            return (
                                                <div key={rating} className="flex items-center">
                                                    <div className="flex items-center w-16">
                                                        <span className="text-sm text-gray-600 font-medium">{rating}</span>
                                                        <span className="text-[#F37022] ml-2">★</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-3 mx-3">
                                                        <div 
                                                            className="bg-[#F37022] h-3 rounded-full transition-all duration-500 ease-out" 
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-600 w-12 text-right font-medium">{count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews List */}
                        <div className="lg:col-span-2">
                            <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-200">
                                <div className="p-6">
                                    <h4 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#F37022]">forum</span>
                                        Participant Reviews
                                    </h4>
                                    
                                    {feedback.length === 0 ? (
                                        <div className="text-center py-16 bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-200">
                                            <div className="text-[#F37022] text-6xl mb-4">★</div>
                                            <p className="text-gray-700 text-xl font-medium mb-2">No feedback yet</p>
                                            <p className="text-gray-500">Participants haven't submitted any reviews for this event.</p>
                                            <p className="text-gray-400 text-sm mt-2">Be the first to share your experience!</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {feedback.map((item) => (
                                                <div 
                                                    key={item.feedback_id} 
                                                    className="bg-gradient-to-r from-orange-50 to-white rounded-2xl p-6 border border-orange-200 hover:border-[#F37022]/50 transition-all duration-200 shadow-sm"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                                        <div className="flex items-center">
                                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F37022]/20 to-[#F37022]/10 flex items-center justify-center text-[#F37022] font-bold mr-4 text-lg">
                                                                {item.user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <h5 className="text-gray-800 font-semibold text-lg">{item.user.name}</h5>
                                                                <p className="text-gray-500 text-sm">
                                                                    {format(new Date(item.created_at), 'MMM dd, yyyy')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex bg-white px-4 py-2 rounded-xl border border-orange-200 shadow-sm">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <span 
                                                                    key={star} 
                                                                    className={`text-xl ${
                                                                        star <= item.rating ? 'text-[#F37022]' : 'text-gray-300'
                                                                    }`}
                                                                >
                                                                    ★
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {item.comment ? (
                                                        <div className="bg-white rounded-xl p-5 border-l-4 border-[#F37022]/50 shadow-sm">
                                                            <p className="text-gray-700 text-base leading-relaxed">{item.comment}</p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500 italic text-center py-4">No additional comments</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 