import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import UpdateProfilePhoto from '@/Components/Profile/Common/UpdateProfilePhoto';

export default function ProfileLayout({ user, children, activeTab, onTabChange, components }) {
    // Check if user has only profile tab
    const hasOnlyProfileTab = !components?.Teams && 
                            !components?.Certificates && 
                            !components?.Badges;

    const tabs = [
        { name: 'Profiles', key: 'profiles' },
        components?.Teams && { name: 'Teams', key: 'teams' },
        components?.Certificates && { name: 'Certificates', key: 'certificates' },
        components?.Badges && { name: 'Badges', key: 'badges' }
    ].filter(Boolean);

    return (
        <AuthenticatedLayout user={user}>
            <Head title="Profile" />

            <div className="min-h-screen">
                <div className="relative">
                    {/* Main Content */}
                    <div className="relative max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6">
                        {/* Navigation Tabs - Only show if there are multiple tabs */}
                        {!hasOnlyProfileTab && (
                            <div className="flex justify-center mb-4 sm:mb-6 overflow-x-auto">
                                <div className="bg-[#24225a]/80 backdrop-blur-sm rounded-xl p-1 shadow-lg w-full max-w-[95vw] sm:max-w-fit">
                                    <nav className="flex gap-1 min-w-full sm:min-w-0">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.key}
                                                onClick={() => onTabChange(tab.key)}
                                                className={`
                                                    flex-1 sm:flex-none px-3 sm:px-6 py-2.5 rounded-lg text-sm font-medium
                                                    whitespace-nowrap transition-all duration-200
                                                    ${activeTab === tab.key 
                                                        ? 'bg-purple-600/50 text-white shadow-md' 
                                                        : 'text-gray-300 hover:text-white hover:bg-white/5'}
                                                `}
                                            >
                                                {tab.name}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        )}

                        {/* Main Content Area */}
                        <div className={`${hasOnlyProfileTab ? 'mt-0' : 'mt-4 sm:mt-6'}`}>
                            <div className="bg-[#24225a]/80 backdrop-blur-sm rounded-xl shadow-lg">
                                {/* Content */}
                                <div className="relative p-4 sm:p-6">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
