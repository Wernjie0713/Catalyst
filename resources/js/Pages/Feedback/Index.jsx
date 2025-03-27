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
            header={<h2 className="font-semibold text-xl text-gray-200 leading-tight">Event Feedback</h2>}
        >
            <Head title="Event Feedback" />

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

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Rating Summary Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-800/50 backdrop-blur-sm overflow-hidden shadow-xl sm:rounded-xl border border-gray-700/50 h-full">
                                <div className="p-6">
                                    <h4 className="text-xl font-semibold text-white mb-6">Rating Summary</h4>
                                    
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-yellow-400 mb-1">
                                                {averageRating ? averageRating.toFixed(1) : '-'}
                                            </div>
                                            <div className="flex justify-center mb-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span 
                                                        key={star} 
                                                        className={`text-xl ${
                                                            star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-600'
                                                        }`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                                {feedback.length} {feedback.length === 1 ? 'review' : 'reviews'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Rating Distribution */}
                                    <div className="space-y-3">
                                        {[5, 4, 3, 2, 1].map((rating) => {
                                            const count = ratingCounts[rating - 1];
                                            const percentage = feedback.length > 0 
                                                ? Math.round((count / feedback.length) * 100) 
                                                : 0;
                                                
                                            return (
                                                <div key={rating} className="flex items-center">
                                                    <div className="flex items-center w-12">
                                                        <span className="text-sm text-gray-300">{rating}</span>
                                                        <span className="text-yellow-400 ml-1">★</span>
                                                    </div>
                                                    <div className="w-full bg-gray-700 rounded-full h-2.5 mx-2 dark:bg-gray-700">
                                                        <div 
                                                            className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500 ease-out" 
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-400 w-10 text-right">{count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews List */}
                        <div className="lg:col-span-2">
                            <div className="bg-gray-800/50 backdrop-blur-sm overflow-hidden shadow-xl sm:rounded-xl border border-gray-700/50">
                                <div className="p-6">
                                    <h4 className="text-xl font-semibold text-white mb-6">Participant Reviews</h4>
                                    
                                    {feedback.length === 0 ? (
                                        <div className="text-center py-12 bg-gray-900/30 rounded-xl border border-gray-800/50">
                                            <div className="text-gray-400 text-5xl mb-4">★</div>
                                            <p className="text-gray-300 text-lg font-medium">No feedback yet</p>
                                            <p className="text-gray-400 mt-2">Participants haven't submitted any reviews for this event.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {feedback.map((item) => (
                                                <div 
                                                    key={item.feedback_id} 
                                                    className="bg-gray-900/30 rounded-xl p-5 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-200"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-medium mr-3">
                                                                {item.user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <h5 className="text-white font-medium">{item.user.name}</h5>
                                                                <p className="text-gray-400 text-sm">
                                                                    {format(new Date(item.created_at), 'MMM dd, yyyy')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex bg-gray-800/50 px-3 py-1.5 rounded-lg">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <span 
                                                                    key={star} 
                                                                    className={`text-lg ${
                                                                        star <= item.rating ? 'text-yellow-400' : 'text-gray-600'
                                                                    }`}
                                                                >
                                                                    ★
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {item.comment ? (
                                                        <div className="bg-gray-800/30 rounded-lg p-4 border-l-4 border-indigo-500/50">
                                                            <p className="text-gray-300">{item.comment}</p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500 italic">No additional comments</p>
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