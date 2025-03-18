import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BaseProfile from '@/Components/Profile/Common/BaseProfile';
import PersonalInformation from '@/Components/Profile/Student/PersonalInformation';
import Events from '@/Components/Profile/Events';
import Teams from '@/Components/Profile/Teams';
import Certificates from '@/Components/Profile/Certificates';
import Badges from '@/Components/Profile/Badges';
import More from '@/Components/Profile/More';

export default function StudentProfile({ auth }) {
    const components = {
        PersonalInformation: () => <PersonalInformation user={auth.user} />,
        Events: () => <Events user={auth.user} />,
        Teams: () => <Teams user={auth.user} />,
        Certificates: () => <Certificates user={auth.user} />,
        Badges: () => <Badges user={auth.user} />,
        More: () => <More user={auth.user} />
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <BaseProfile auth={auth} components={components} />
        </AuthenticatedLayout>
    );
} 