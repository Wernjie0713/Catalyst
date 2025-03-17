import BaseProfile from '@/Components/Profile/Common/BaseProfile';
import PersonalInformation from '@/Components/Profile/Lecturer/PersonalInformation';

export default function LecturerProfile({ auth }) {
    const components = {
        PersonalInformation
    };

    return <BaseProfile auth={auth} components={components} />;
} 