import BaseProfile from '@/Components/Profile/Common/BaseProfile';
import PersonalInformation from '@/Components/Profile/Organizer/PersonalInformation';

export default function OrganizerProfile({ auth }) {
    const components = {
        PersonalInformation
    };

    return <BaseProfile auth={auth} components={components} />;
} 