import BaseProfile from '@/Components/Profile/Common/BaseProfile';
import UniversityPersonalInformation from '@/Components/Profile/University/PersonalInformation';
import { usePage } from '@inertiajs/react';

export default function UniversityProfile({ userProfile }) {
    const { auth } = usePage().props;
    const user = userProfile || auth.user;
    
    const components = {
        PersonalInformation: () => <UniversityPersonalInformation user={user} isEditable={true} />
    };

    return <BaseProfile auth={auth} components={components} />;
} 