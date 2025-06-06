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
        // Check current user role
        const isCurrentUserStudent = auth.user.student !== null;
        const isCurrentUserLecturer = auth.user.lecturer !== null;
        const isCurrentUserAdmin = auth.user.roles?.some(role => role.name === 'admin') || false;
        const isCurrentUserUniversity = auth.user.roles?.some(role => role.name === 'university') || false;
        const isCurrentUserDepartmentStaff = auth.user.roles?.some(role => role.name === 'department_staff') || false;
        
        // Check if viewing own profile
        const isViewingOwnProfile = auth.user.id === profileUser.id;
        
        // Check profile user role
        const isViewingStudent = roleType === 'student';
        const isViewingLecturer = roleType === 'lecturer';
        
        // Business Rules:
        // 1. Friend connections: ONLY between students
        // 2. Mentor connections: ONLY from students TO lecturers (not the reverse)
        // 3. Admin, University, Department Staff: NO connection abilities
        
        // Friend button: Only show for student-to-student connections
        const shouldShowFriendButton = !isViewingOwnProfile && 
                                     isCurrentUserStudent && 
                                     isViewingStudent;
        
        // Mentor button: Only show for student requesting lecturer as mentor
        const shouldShowMentorButton = !isViewingOwnProfile && 
                                     isCurrentUserStudent && 
                                     isViewingLecturer;

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
                showFriendButton={false} // Connection buttons are now handled in individual components
                friendStatus={friendStatus}
                friendRequestId={friendRequestId}
            />
        </AuthenticatedLayout>
    );
}
