import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import UpdateProfilePhoto from '@/Components/Profile/Common/UpdateProfilePhoto';

export default function ProfileLayout({ user, children, activeTab, onTabChange, components }) {
    // Check if user has only profile tab
    const hasOnlyProfileTab = !components?.Events && !components?.Teams && 
                            !components?.Certificates && !components?.Badges && 
                            !components?.More;

    const tabs = [
        { name: 'Profiles', key: 'profiles' },
        components?.Events && { name: 'Events', key: 'events' },
        components?.Teams && { name: 'Teams', key: 'teams' },
        components?.Certificates && { name: 'Certificates', key: 'certificates' },
        components?.Badges && { name: 'Badges', key: 'badges' },
        components?.More && { name: 'More', key: 'more' }
    ].filter(Boolean);

    return (
        <AuthenticatedLayout user={user}>
            <Head title="Profile" />

            <div className="min-h-screen bg-[#18122B]">
                <div className="relative">
                    {/* Decorative Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#635985]/20 to-transparent h-[500px]" />
                    
                    {/* Main Content */}
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                        {/* Navigation Tabs - Only show if there are multiple tabs */}
                        {!hasOnlyProfileTab && (
                            <div className="flex justify-center mb-8">
                                <div className="bg-[#242031]/90 backdrop-blur-md rounded-2xl p-1.5 shadow-xl border border-white/5">
                                    <nav className="flex gap-1">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.key}
                                                onClick={() => onTabChange(tab.key)}
                                                className={`
                                                    px-8 py-3 rounded-xl text-sm font-medium
                                                    transition-all duration-200
                                                    ${activeTab === tab.key 
                                                        ? 'bg-[#635985] text-white shadow-lg transform scale-105' 
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

                        {/* Main Content Area - Adjusted spacing for single tab */}
                        <div className={`${hasOnlyProfileTab ? 'mt-4' : 'mt-8'} pb-12`}>
                            <div className={`
                                bg-gradient-to-r from-[#18122B] to-[#635985]
                                relative rounded-[2.5rem] overflow-hidden
                                ${hasOnlyProfileTab ? 'shadow-2xl' : ''}
                            `}>
                                {/* Decorative Pattern */}
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute inset-0" style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                    }} />
                                </div>

                                {/* Single Tab Header - Only show for single tab */}
                                {hasOnlyProfileTab && (
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#635985] via-[#18122B] to-[#635985] opacity-50" />
                                )}

                                <div className="relative p-8">
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
