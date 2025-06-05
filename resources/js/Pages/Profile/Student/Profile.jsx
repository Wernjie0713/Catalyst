import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BaseProfile from '@/Components/Profile/Common/BaseProfile';
import StudentPersonalInformation from '@/Components/Profile/Student/PersonalInformation';
import Teams from '@/Components/Profile/Teams';
import Certificates from '@/Components/Profile/Certificates';
import Badges from '@/Components/Profile/Badges';
import { usePage } from '@inertiajs/react';

export default function StudentProfile({ userProfile }) {
    const { auth } = usePage().props;
    const user = userProfile || auth.user;

    const components = {
        PersonalInformation: () => (
            <StudentPersonalInformation 
                user={user} 
                viewOnly={false}
            />
        ),
        Teams: () => <Teams user={user} />,
        Certificates: () => <Certificates user={user} authUserId={auth.user.id} />,
        Badges: () => <Badges user={user} />
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <BaseProfile 
                auth={auth} 
                components={components} 
            />
        </AuthenticatedLayout>
    );
} 