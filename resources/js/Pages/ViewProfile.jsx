import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import BaseProfile from '@/Components/Profile/Common/BaseProfile';
import StudentInformation from '@/Components/Profile/Student/PersonalInformation';
import LecturerInformation from '@/Components/Profile/Lecturer/PersonalInformation';
import OrganizerInformation from '@/Components/Profile/Organizer/PersonalInformation';
import UniversityInformation from '@/Components/Profile/University/PersonalInformation';
import DepartmentStaffInformation from '@/Components/Profile/DepartmentStaff/PersonalInformation';
import Teams from '@/Components/Profile/Teams';
import Certificates from '@/Components/Profile/Certificates';
import Badges from '@/Components/Profile/Badges';

export default function ViewProfile({ auth, profileUser, roleType, roles, profilePhotoPath, friendStatus, friendRequestId, mentorStatus, mentorRequestId }) {

    const getPersonalInformationComponent = () => {
        // Check if current user is a student
        const isCurrentUserStudent = auth.user.student !== null;
        // Check if viewing a lecturer's profile
        const isViewingLecturer = roleType === 'lecturer';
        // Check if viewing own profile
        const isViewingOwnProfile = auth.user.id === profileUser.id;
        
        // Show mentor button only if: student viewing lecturer's profile (not their own)
        const shouldShowMentorButton = isCurrentUserStudent && isViewingLecturer && !isViewingOwnProfile;
        
        // Show friend button logic: show if not viewing own profile AND either not a student OR not viewing a lecturer
        // This means: students can't send friend requests to lecturers (they should use mentor requests instead)
        const shouldShowFriendButton = !isViewingOwnProfile && (!isCurrentUserStudent || roleType !== 'lecturer');

        switch (roleType) {
            case 'student':
                return (
                    <StudentInformation 
                        user={profileUser} 
                        viewOnly={true}
                        showFriendButton={shouldShowFriendButton}
                        friendStatus={friendStatus}
                        friendRequestId={friendRequestId}
                    />
                );
            case 'lecturer':
                return (
                    <LecturerInformation 
                        user={profileUser} 
                        viewOnly={true}
                        showFriendButton={shouldShowFriendButton}
                        friendStatus={friendStatus}
                        friendRequestId={friendRequestId}
                        showMentorButton={shouldShowMentorButton}
                        mentorStatus={mentorStatus}
                        mentorRequestId={mentorRequestId}
                        auth={auth}
                    />
                );
            case 'organizer':
                return (
                    <OrganizerInformation
                        user={profileUser}
                        viewOnly={true}
                        showFriendButton={shouldShowFriendButton}
                        friendStatus={friendStatus}
                        friendRequestId={friendRequestId}
                    />
                );
            case 'university':
                return (
                    <UniversityInformation
                        user={profileUser}
                        viewOnly={true}
                        showFriendButton={shouldShowFriendButton}
                        friendStatus={friendStatus}
                        friendRequestId={friendRequestId}
                    />
                );
            case 'department_staff':
                return (
                    <DepartmentStaffInformation
                        user={profileUser}
                        viewOnly={true}
                        showFriendButton={shouldShowFriendButton}
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
            Teams: () => <Teams user={profileUser} />,
            Certificates: () => <Certificates user={profileUser} />,
            Badges: () => <Badges user={profileUser} />
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
