import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BaseProfile from '@/Components/Profile/Common/BaseProfile';
import StudentPersonalInformation from '@/Components/Profile/Student/PersonalInformation';
import Teams from '@/Components/Profile/Teams';
import Certificates from '@/Components/Profile/Certificates';
import Badges from '@/Components/Profile/Badges';

export default function StudentProfile({ auth }) {
    const user = auth.user;

    const components = {
        PersonalInformation: () => (
            <StudentPersonalInformation 
                user={user} 
                viewOnly={false}
            />
        ),
        Teams: () => <Teams user={user} />,
        Certificates: () => <Certificates user={user} />,
        Badges: () => <Badges user={user} />
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <BaseProfile 
                auth={auth} 
                components={components} 
            />
        </AuthenticatedLayout>
    );
} 