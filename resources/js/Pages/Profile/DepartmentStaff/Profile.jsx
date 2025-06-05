import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BaseProfile from '@/Components/Profile/Common/BaseProfile';
import DepartmentStaffPersonalInformation from '@/Components/Profile/DepartmentStaff/PersonalInformation';
import Teams from '@/Components/Profile/Teams';
import Certificates from '@/Components/Profile/Certificates';
import Badges from '@/Components/Profile/Badges';
import { usePage } from '@inertiajs/react';

export default function DepartmentStaffProfile({ userProfile }) {
    const { auth } = usePage().props;
    const user = userProfile || auth.user;

    const components = {
        PersonalInformation: () => (
            <DepartmentStaffPersonalInformation 
                user={user} 
                viewOnly={false}
            />
        ),
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <BaseProfile auth={auth} components={components} />
        </AuthenticatedLayout>
    );
} 