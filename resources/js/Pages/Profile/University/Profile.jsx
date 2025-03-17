import BaseProfile from '@/Components/Profile/Common/BaseProfile';
import PersonalInformation from '@/Components/Profile/University/PersonalInformation';

export default function UniversityProfile({ auth }) {
    const components = {
        PersonalInformation
    };

    return <BaseProfile auth={auth} components={components} />;
} 