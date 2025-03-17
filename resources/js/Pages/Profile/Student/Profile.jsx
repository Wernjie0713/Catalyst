import BaseProfile from '@/Components/Profile/Common/BaseProfile';
import PersonalInformation from '@/Components/Profile/Student/PersonalInformation';
import Events from '@/Components/Profile/Events';
import Teams from '@/Components/Profile/Teams';
import Certificates from '@/Components/Profile/Certificates';
import Badges from '@/Components/Profile/Badges';
import More from '@/Components/Profile/More';

export default function StudentProfile({ auth }) {
    const components = {
        PersonalInformation,
        Events,
        Teams,
        Certificates,
        Badges,
        More
    };

    return <BaseProfile auth={auth} components={components} />;
} 