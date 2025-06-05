import BaseProfile from '@/Components/Profile/Common/BaseProfile';
import PersonalInformation from '@/Components/Profile/Organizer/PersonalInformation';
import OrganizerPersonalInformation from '@/Components/Profile/Organizer/PersonalInformation';
import { usePage } from '@inertiajs/react';

export default function OrganizerProfile({ userProfile }) {
    const { auth } = usePage().props;
    const user = userProfile || auth.user;

    const components = {
        PersonalInformation: () => <OrganizerPersonalInformation user={user} isEditable={true} />
    };

    return <BaseProfile auth={auth} components={components} />;
} 