import Input from '../Input';
import { useForm } from '@inertiajs/react';
import UpdateProfilePhoto from '@/Components/Profile/Common/UpdateProfilePhoto';
import DisplayProfilePhoto from '@/Components/Profile/Common/DisplayProfilePhoto';
import FriendRequestButton from '@/Components/Profile/Common/FriendRequestButton';
import { useState } from 'react';

const FACULTIES = [
    'Faculty of Computing',
    'Faculty of Civil Engineering',
    'Faculty of Electrical Engineering',
    'Faculty of Chemical Engineering',
    'Faculty of Mechanical Engineering',
    'Faculty of Industrial Sciences & Technology',
    'Faculty of Manufacturing Engineering',
    'Faculty of Technology Engineering',
    'Faculty of Business & Communication',
    'Faculty of Industrial Management',
    'Faculty of Applied Sciences',
    'Faculty of Science & Technology',
    'Faculty of Medicine',
    'Faculty of Pharmacy',
    'Faculty of Dentistry',
    'Faculty of Arts & Social Sciences',
    'Faculty of Education',
    'Faculty of Economics & Administration',
    'Faculty of Law',
    'Faculty of Built Environment',
    'Faculty of Agriculture',
    'Faculty of Forestry',
    'Faculty of Veterinary Medicine',
    'Faculty of Islamic Studies',
    'Faculty of Sports Science',
    'Faculty of Creative Technology',
    'Faculty of Music',
    'Faculty of Architecture & Design',
    'Faculty of Hotel & Tourism Management',
    'Faculty of Health Sciences',
    'Faculty of Defence Studies & Management'
];

const UNIVERSITIES = [
    'UMP', 'UMS', 'UMT', 'UKM', 'UM', 'USM', 'UPM', 'UTM', 'UUM', 'UIAM',
    'UPSI', 'USIM', 'UiTM', 'UNIMAS', 'UTeM', 'UniMAP', 'UTHM', 'UniSZA', 'UPNM', 'UMK'
];

const LEVELS = ['Undergraduate', 'Postgraduate'];

export default function StudentPersonalInformation({ 
    user, 
    viewOnly = false,
    showFriendButton = false,
    friendStatus,
    friendRequestId 
}) {
    const [isEditing, setIsEditing] = useState(false);

    if (!user) {
        return <div>Loading...</div>;
    }

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        matric_no: user?.student?.matric_no || '',
        year: user?.student?.year || '',
        level: user?.student?.level || '',
        contact_number: user?.student?.contact_number || '',
        bio: user?.student?.bio || '',
        faculty: user?.student?.faculty || '',
        university: user?.student?.university || '',
        expected_graduate: user?.student?.expected_graduate || ''
    });

    if (!user?.student) {
        console.warn('No student data available');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data being submitted:', data);
        
        patch(route('profile.update'), data, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
                console.log('Success: Form submitted');
            },
            onError: (errors) => {
                console.error('Submission errors:', errors);
            }
        });
    };

    return (
        <div className="space-y-8">
            <div className="relative rounded-[2.5rem] overflow-hidden">
                <div className="relative px-8 py-12">
                    <div className="flex flex-col items-center">
                        {/* Profile Photo */}
                        <div className="mb-6">
                            {!viewOnly ? (
                                <UpdateProfilePhoto user={user} />
                            ) : (
                                <DisplayProfilePhoto 
                                    profilePhotoPath={user?.student?.profile_photo_path}
                                />
                            )}
                        </div>
                        
                        {/* User Info */}
                        <h1 className="text-3xl font-bold text-white mb-2">{user?.name || 'User'}</h1>
                        <p className="text-gray-300 mb-4">{user?.email || 'No email provided'}</p>

                        {/* Friend Request Button */}
                        {showFriendButton && (
                            <div className="mb-8">
                                <FriendRequestButton
                                    userId={user.id}
                                    friendStatus={friendStatus}
                                    friendRequestId={friendRequestId}
                                />
                            </div>
                        )}

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mb-12">
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                                <p className="text-gray-400 text-sm">Year</p>
                                <p className="text-white font-medium">{data.year || 'Not Set'}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                                <p className="text-gray-400 text-sm">Level</p>
                                <p className="text-white font-medium">{data.level || 'Not Set'}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                                <p className="text-gray-400 text-sm">Contact</p>
                                <p className="text-white font-medium">{data.contact_number || 'Not Set'}</p>
                            </div>
                        </div>

                        {/* Student Information Section */}
                        <div className="w-full max-w-4xl">
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-white">
                                        Student Information
                                    </h2>
                                    {!viewOnly && (
                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            className="text-white/70 hover:text-white transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {(isEditing && !viewOnly) ? (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input
                                                label="Matric Number"
                                                value={data.matric_no}
                                                onChange={(e) => setData('matric_no', e.target.value)}
                                                error={errors.matric_no}
                                                className="bg-white/5 border-white/10 text-white"
                                            />
                                            <Input
                                                label="Year"
                                                type="number"
                                                value={data.year}
                                                onChange={(e) => setData('year', e.target.value)}
                                                error={errors.year}
                                                className="bg-white/5 border-white/10 text-white"
                                            />
                                            <Input
                                                label="Level"
                                                type="select"
                                                value={data.level}
                                                onChange={(e) => setData('level', e.target.value)}
                                                error={errors.level}
                                                options={LEVELS}
                                                className="bg-white/5 border-white/10 text-white"
                                            />
                                            <Input
                                                label="Contact Number"
                                                type="tel"
                                                value={data.contact_number}
                                                onChange={(e) => setData('contact_number', e.target.value)}
                                                error={errors.contact_number}
                                                className="bg-white/5 border-white/10 text-white"
                                            />
                                            <Input
                                                label="Faculty"
                                                type="select"
                                                value={data.faculty}
                                                onChange={(e) => setData('faculty', e.target.value)}
                                                error={errors.faculty}
                                                options={FACULTIES}
                                                className="bg-white/5 border-white/10 text-white"
                                            />
                                            <Input
                                                label="University"
                                                type="select"
                                                value={data.university}
                                                onChange={(e) => setData('university', e.target.value)}
                                                error={errors.university}
                                                options={UNIVERSITIES}
                                                className="bg-white/5 border-white/10 text-white"
                                            />
                                            <Input
                                                label="Expected Graduate Year"
                                                type="number"
                                                value={data.expected_graduate}
                                                onChange={(e) => setData('expected_graduate', e.target.value)}
                                                error={errors.expected_graduate}
                                                className="bg-white/5 border-white/10 text-white"
                                            />
                                        </div>

                                        <div className="mt-6">
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Bio
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={data.bio}
                                                onChange={(e) => setData('bio', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl 
                                                    text-white placeholder-gray-500 focus:border-[#635985] focus:ring-1 
                                                    focus:ring-[#635985] transition-colors duration-200"
                                            />
                                            {errors.bio && (
                                                <p className="mt-1 text-sm text-red-400">{errors.bio}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-end gap-4 mt-6">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="px-6 py-2.5 text-white/70 hover:text-white"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-6 py-2.5 bg-[#635985] text-white rounded-xl 
                                                    hover:bg-[#635985]/80 transform transition-all duration-200 
                                                    hover:scale-105 disabled:opacity-75 flex items-center gap-2"
                                            >
                                                {processing ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InfoItem label="Matric Number" value={data.matric_no} />
                                        <InfoItem label="Year" value={data.year} />
                                        <InfoItem label="Level" value={data.level} />
                                        <InfoItem label="Contact Number" value={data.contact_number} />
                                        <InfoItem label="Faculty" value={data.faculty} />
                                        <InfoItem label="University" value={data.university} />
                                        <div className="col-span-2">
                                            <InfoItem label="Bio" value={data.bio} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper component for displaying information
function InfoItem({ label, value }) {
    return (
        <div className="space-y-1">
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-white">{value || 'Not set'}</p>
        </div>
    );
} 