import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import AdminDashboard from './DashboardComponent/AdminDashboard';

export default function Dashboard( {isAdmin, users} ) {
    return (
        <AuthenticatedLayout
            isAdmin = {isAdmin}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            {!isAdmin ? 
            (
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                You're logged in! This system is still in development.
                            </div>
                        </div>
                    </div>
                </div>
            )
            :
            (
                <AdminDashboard users={users.data} links={users.links}/>
            )}
        </AuthenticatedLayout>
    );
}
