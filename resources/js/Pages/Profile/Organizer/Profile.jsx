import BaseProfile from '@/Components/Profile/Common/BaseProfile';
import PersonalInformation from '@/Components/Profile/Organizer/PersonalInformation';
import OrganizerPersonalInformation from '@/Components/Profile/Organizer/PersonalInformation';

export default function OrganizerProfile({ auth }) {
    const components = {
        PersonalInformation: () => <OrganizerPersonalInformation user={auth.user} isEditable={true} />
    };

    return <BaseProfile auth={auth} components={components} />;
} 