import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { format } from 'date-fns';
import { useState } from 'react';
import EventModal from '@/Components/EventModal';
import ParticipantsModal from '@/Components/ParticipantsModal';

const TabButton = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`
            relative px-6 py-3 text-sm font-medium transition-all duration-200 ease-in-out
            ${active 
                ? 'text-white' 
                : 'text-gray-400 hover:text-gray-200'
            }
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md
        `}
    >
        {children}
        {active && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full" />
        )}
    </button>
);

const MyEvents = ({ organizedEvents, enrolledEvents }) => {
    const { can } = usePage().props;
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('organized');

    const handleViewEvent = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const EventTable = ({ events, showEditButton = false }) => (
        <div className="bg-white/5 backdrop-blur-sm border border-gray-800 shadow-xl rounded-xl overflow-hidden">
            {events.length === 0 ? (
                <div className="p-8 text-gray-400 text-center">
                    <p className="text-lg">No events found.</p>
                </div>
            ) : (
                <table className="min-w-full divide-y divide-gray-700/50">
                    <thead className="bg-gray-900/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Event
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Date & Time
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                {activeTab === 'organized' ? 'Participants' : 'Type'}
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                        {events.map((event) => (
                            <tr key={event.event_id} className="hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <div>
                                            <div className="text-sm font-medium text-gray-100">
                                                {event.title}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {event.event_type}
                                                {event.is_external && (
                                                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-400">
                                                        External
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-100">
                                        {format(new Date(event.date), 'MMM dd, yyyy')}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {event.formatted_time}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        event.status === 'Upcoming' ? 'bg-green-500/10 text-green-400' :
                                        event.status === 'Ongoing' ? 'bg-blue-500/10 text-blue-400' :
                                        'bg-gray-500/10 text-gray-400'
                                    }`}>
                                        {event.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {activeTab === 'organized' ? (
                                        <div className="flex items-center">
                                            {!event.is_external && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedEvent(event);
                                                        setIsParticipantsModalOpen(true);
                                                    }}
                                                    className="text-gray-400 hover:text-gray-300 transition-colors mr-2"
                                                    title="View Participants"
                                                >
                                                    <span className="material-symbols-outlined text-base">group</span>
                                                </button>
                                            )}
                                            <span className="text-sm text-gray-400">
                                                {event.is_external ? 'External Registration' : `${event.enrolled_count}/${event.max_participants}`}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-400">
                                            {event.is_external ? 'External Event' : 'Internal Event'}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleViewEvent(event)}
                                        className="text-blue-400 hover:text-blue-300 transition-colors mr-4"
                                    >
                                        View
                                    </button>
                                    {showEditButton && can.event_edit && (
                                        <a
                                            href={route('events.edit', event.event_id)}
                                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                        >
                                            Edit
                                        </a>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );

    return (
        <AuthenticatedLayout>
            <Head title="My Events" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-col space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-semibold text-white">My Events</h2>
                        </div>

                        {/* Tab Navigation */}
                        <div className="bg-gray-800/50 rounded-lg p-1 inline-flex items-center justify-center space-x-1 mx-auto">
                            <button
                                onClick={() => setActiveTab('organized')}
                                className={`
                                    px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                                    ${activeTab === 'organized'
                                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                    }
                                `}
                            >
                                <div className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                                        <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                                    </svg>
                                    <span>Organized Events</span>
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('enrolled')}
                                className={`
                                    px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                                    ${activeTab === 'enrolled'
                                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                    }
                                `}
                            >
                                <div className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Enrolled Events</span>
                                </div>
                            </button>
                        </div>

                        {/* Event Table */}
                        <div className="mt-6">
                            {activeTab === 'organized' ? (
                                <EventTable events={organizedEvents} showEditButton={true} />
                            ) : (
                                <EventTable events={enrolledEvents} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {selectedEvent && (
                <>
                    <EventModal
                        event={selectedEvent}
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedEvent(null);
                        }}
                    />
                    {!selectedEvent.is_external && (
                        <ParticipantsModal
                            event={selectedEvent}
                            isOpen={isParticipantsModalOpen}
                            onClose={() => {
                                setIsParticipantsModalOpen(false);
                                setSelectedEvent(null);
                            }}
                        />
                    )}
                </>
            )}
        </AuthenticatedLayout>
    );
};

export default MyEvents; 