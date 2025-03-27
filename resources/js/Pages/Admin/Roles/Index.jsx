import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import React from 'react';

export default function Index({ auth, roles }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Roles" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white/10 backdrop-blur-sm overflow-hidden shadow-xl rounded-lg border border-purple-900/20">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Roles List</h2>
                            </div>

                            <div className="overflow-x-auto bg-white/5 backdrop-blur-sm rounded-xl border border-purple-900/20 shadow-lg">
                                <table className="min-w-full divide-y divide-purple-900/10">
                                    <thead>
                                        <tr className="bg-purple-900/20">
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-purple-100 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-purple-100 uppercase tracking-wider">Title</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-purple-100 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-purple-900/10">
                                        {roles.map((role) => (
                                            <tr key={role.id} className="hover:bg-purple-900/10 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-100">{role.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{role.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={route('admin.roles.edit', role.id)}
                                                        className="text-purple-300 hover:text-purple-100 bg-purple-900/30 px-4 py-2 rounded-lg hover:bg-purple-900/50 transition-all duration-200"
                                                    >
                                                        Edit
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