import BaseProfile from '@/Components/Profile/Common/BaseProfile';
import LecturerPersonalInformation from '@/Components/Profile/Lecturer/PersonalInformation';
import { usePage } from '@inertiajs/react';

export default function LecturerProfile({ userProfile }) {
    const { auth } = usePage().props;
    const user = userProfile || auth.user;

    const components = {
        PersonalInformation: () => (
            <LecturerPersonalInformation 
                user={user} 
                viewOnly={false}
            />
        )
    };

    return <BaseProfile auth={auth} components={components} />;
} 