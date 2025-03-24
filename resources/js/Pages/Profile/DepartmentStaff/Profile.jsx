import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BaseProfile from '@/Components/Profile/Common/BaseProfile';
import DepartmentStaffPersonalInformation from '@/Components/Profile/DepartmentStaff/PersonalInformation';
import Events from '@/Components/Profile/Events';
import Teams from '@/Components/Profile/Teams';
import Certificates from '@/Components/Profile/Certificates';
import Badges from '@/Components/Profile/Badges';
import More from '@/Components/Profile/More';

export default function DepartmentStaffProfile({ auth }) {
    const components = {
        PersonalInformation: () => (
            <DepartmentStaffPersonalInformation 
                user={auth.user} 
                viewOnly={false}
            />
        ),
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <BaseProfile auth={auth} components={components} />
        </AuthenticatedLayout>
    );
} 