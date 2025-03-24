import BaseProfile from '@/Components/Profile/Common/BaseProfile';
import LecturerPersonalInformation from '@/Components/Profile/Lecturer/PersonalInformation';

export default function LecturerProfile({ auth }) {
    const components = {
        PersonalInformation: () => (
            <LecturerPersonalInformation 
                user={auth.user} 
                viewOnly={false}
            />
        )
    };

    return <BaseProfile auth={auth} components={components} />;
} 