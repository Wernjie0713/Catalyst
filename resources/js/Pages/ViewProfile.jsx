import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
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

    const handleBackClick = () => {
        window.history.back();
    };

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
            
            {/* Back Button */}
            <div className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-white">
                <div className="relative max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <button
                        type="button"
                        onClick={handleBackClick}
                        className="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-base sm:text-lg font-semibold border-4 border-white group shadow mb-4"
                    >
                        <div className="bg-green-400 rounded-xl h-12 w-1/4 grid place-items-center absolute left-0 top-0 group-hover:w-full z-10 duration-500 pointer-events-none">
                            <svg width="25px" height="25px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                              <path fill="#000000" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" />
                              <path fill="#000000" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" />
                            </svg>
                        </div>
                        <p className="translate-x-4 relative z-20 pointer-events-none group-hover:opacity-0 duration-300">Go Back</p>
                    </button>
                    
                    <BaseProfile 
                        auth={auth}
                        components={components} 
                        profileUser={profileUser}
                        roles={roles}
                        showFriendButton={false} // Connection buttons are now handled in individual components
                        friendStatus={friendStatus}
                        friendRequestId={friendRequestId}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
