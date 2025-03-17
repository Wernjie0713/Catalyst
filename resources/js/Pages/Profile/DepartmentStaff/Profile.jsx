import BaseProfile from '@/Components/Profile/Common/BaseProfile';
import PersonalInformation from '@/Components/Profile/DepartmentStaff/PersonalInformation';

export default function DepartmentStaffProfile({ auth }) {
    const components = {
        PersonalInformation
    };

    return <BaseProfile auth={auth} components={components} />;
} 