import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BaseProfile from '@/Components/Profile/Common/BaseProfile';
import DepartmentStaffPersonalInformation from '@/Components/Profile/DepartmentStaff/PersonalInformation';
import Teams from '@/Components/Profile/Teams';
import Certificates from '@/Components/Profile/Certificates';
import Badges from '@/Components/Profile/Badges';

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