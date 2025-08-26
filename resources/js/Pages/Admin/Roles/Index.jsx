import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import React from 'react';

export default function Index({ auth, roles }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Roles" />

            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Enhanced Header Section */}
                    <div className="mb-8">
                        <div className="text-center mb-6">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Role Management
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Manage user roles and permissions for your application
                            </p>
                        </div>
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-200">
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Roles List</h2>
                                    <p className="text-orange-100 mt-1">Total Roles: {roles.length}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                </div>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="p-8">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b-2 border-orange-200">
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                                <div className="flex items-center space-x-2">
                                                    <span>ID</span>
                                                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                                <div className="flex items-center space-x-2">
                                                    <span>Role Title</span>
                                                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                                <div className="flex items-center space-x-2">
                                                    <span>Actions</span>
                                                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-orange-100">
                                        {roles.map((role, index) => (
                                            <tr key={role.id} className={`hover:bg-orange-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                                                            <span className="text-orange-600 font-semibold text-sm">{role.id}</span>
                                                        </div>
                                                        <span className="text-gray-600 font-medium">#{role.id}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 bg-orange-400 rounded-full mr-3"></div>
                                                        <span className="text-gray-800 font-semibold text-lg">{role.title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap text-right">
                                                    <Link
                                                        href={route('admin.roles.edit', role.id)}
                                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-xl hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                                                    >
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit Role
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 