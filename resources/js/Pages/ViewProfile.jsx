import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import BaseProfile from '@/Components/Profile/Common/BaseProfile';
import StudentInformation from '@/Components/Profile/Student/PersonalInformation';
import LecturerInformation from '@/Components/Profile/Lecturer/PersonalInformation';
import OrganizerInformation from '@/Components/Profile/Organizer/PersonalInformation';
import UniversityInformation from '@/Components/Profile/University/PersonalInformation';
import DepartmentStaffInformation from '@/Components/Profile/DepartmentStaff/PersonalInformation';
import Events from '@/Components/Profile/Events';
import Teams from '@/Components/Profile/Teams';
import Certificates from '@/Components/Profile/Certificates';
import Badges from '@/Components/Profile/Badges';
import More from '@/Components/Profile/More';

export default function ViewProfile({ auth, profileUser, roleType, roles, profilePhotoPath, friendStatus, friendRequestId }) {
    console.log('Profile Photo Path:', profilePhotoPath);

    const getPersonalInformationComponent = () => {
        switch (roleType) {
            case 'student':
                return (
                    <StudentInformation 
                        user={profileUser} 
                        viewOnly={true}
                        showFriendButton={auth.user.id !== profileUser.id}
                        friendStatus={friendStatus}
                        friendRequestId={friendRequestId}
                    />
                );
            case 'lecturer':
                return (
                    <LecturerInformation 
                        user={profileUser} 
                        viewOnly={true}
                        showFriendButton={auth.user.id !== profileUser.id}
                        friendStatus={friendStatus}
                        friendRequestId={friendRequestId}
                    />
                );
            case 'organizer':
                return (
                    <OrganizerInformation
                        user={profileUser}
                        viewOnly={true}
                        showFriendButton={auth.user.id !== profileUser.id}
                        friendStatus={friendStatus}
                        friendRequestId={friendRequestId}
                    />
                );
            case 'university':
                return (
                    <UniversityInformation
                        user={profileUser}
                        viewOnly={true}
                        showFriendButton={auth.user.id !== profileUser.id}
                        friendStatus={friendStatus}
                        friendRequestId={friendRequestId}
                    />
                );
            case 'department_staff':
                return (
                    <DepartmentStaffInformation
                        user={profileUser}
                        viewOnly={true}
                        showFriendButton={auth.user.id !== profileUser.id}
                        friendStatus={friendStatus}
                        friendRequestId={friendRequestId}
                    />
                );
            default:
                return null;
        }
    };

    const components = {
        PersonalInformation: () => getPersonalInformationComponent(),
        // Only include these components for student role
        ...(roleType === 'student' && {
            Events: () => <Events user={profileUser} />,
            Teams: () => <Teams user={profileUser} />,
            Certificates: () => <Certificates user={profileUser} />,
            Badges: () => <Badges user={profileUser} />,
            More: () => <More user={profileUser} />
        })
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`${profileUser.name}'s Profile`} />
            <BaseProfile 
                auth={auth}
                components={components} 
                profileUser={profileUser}
                roles={roles}
                showFriendButton={auth.user.id !== profileUser.id}
                friendStatus={friendStatus}
                friendRequestId={friendRequestId}
            />
        </AuthenticatedLayout>
    );
}
