import BaseProfile from '@/Components/Profile/Common/BaseProfile';
import UniversityPersonalInformation from '@/Components/Profile/University/PersonalInformation';

export default function UniversityProfile({ auth }) {
    
    const components = {
        PersonalInformation: () => <UniversityPersonalInformation user={auth.user} isEditable={true} />
    };

    return <BaseProfile auth={auth} components={components} />;
} 