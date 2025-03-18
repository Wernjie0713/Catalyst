import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import DeleteUserForm from './Partials/DeleteUserForm';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Account Settings" />

            <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Account Settings
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Manage your account settings and preferences.
                    </p>
                </div>

                {/* Forms Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Profile Information */}
                        <div className="bg-[#1a1625] rounded-2xl p-8 border border-gray-800/50 backdrop-blur-xl">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>

                        {/* Delete Account */}
                        <div className="bg-[#1a1625] rounded-2xl p-8 border border-gray-800/50 backdrop-blur-xl">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="bg-[#1a1625] rounded-2xl p-8 border border-gray-800/50 backdrop-blur-xl">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
