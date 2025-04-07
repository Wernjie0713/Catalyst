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
    'Universiti Malaysia Pahang',
    'Universiti Malaysia Sabah',
    'Universiti Malaysia Terengganu',
    'Universiti Kebangsaan Malaysia',
    'Universiti Malaya',
    'Universiti Sains Malaysia',
    'Universiti Putra Malaysia',
    'Universiti Teknologi Malaysia',
    'Universiti Utara Malaysia',
    'Universiti Islam Antarabangsa Malaysia',
    'Universiti Pendidikan Sultan Idris',
    'Universiti Sains Islam Malaysia',
    'Universiti Teknologi MARA',
    'Universiti Malaysia Sarawak',
    'Universiti Teknikal Malaysia Melaka',
    'Universiti Malaysia Perlis',
    'Universiti Tun Hussein Onn Malaysia',
    'Universiti Sultan Zainal Abidin',
    'Universiti Pertahanan Nasional Malaysia',
    'Universiti Malaysia Kelantan'
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
        
        patch(route('profile.update'), data, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
            },
            onError: (errors) => {
                console.error('Submission errors:', errors);
            }
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Profile Header Section */}
            <div className="bg-[#1e1b4b]/50 rounded-xl p-4 sm:p-6">
                <div className="flex flex-col items-center md:flex-row md:items-start gap-6 md:gap-8">
                    {/* Profile Picture and Friend Button Column */}
                    <div className="flex flex-col items-center flex-shrink-0">
                        {!viewOnly ? (
                                <UpdateProfilePhoto user={user} />
                            ) : (
                                <DisplayProfilePhoto 
                                    profilePhotoPath={user?.student?.profile_photo_path}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        
                        {/* Add Friend Button */}
                        {showFriendButton && (
                            <div className="mt-4">
                                <FriendRequestButton
                                    userId={user.id}
                                    friendStatus={friendStatus}
                                    friendRequestId={friendRequestId}
                                />
                            </div>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="mb-4 md:mb-6">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">{user?.name || 'User'}</h1>
                            <p className="text-sm sm:text-base text-gray-400">{user?.email || 'No email provided'}</p>
                            {user?.student?.bio && (
                                <p className="text-sm sm:text-base text-gray-300 mt-3">{user.student.bio}</p>
                            )}
                        </div>

                        {/* Quick Info Grid */}
                        <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-lg mx-auto md:mx-0">
                            <QuickInfo icon="school" label="Level" value={user?.student?.level} />
                            <QuickInfo icon="apartment" label="Faculty" value={user?.student?.faculty} />
                            <QuickInfo icon="badge" label="Matric" value={user?.student?.matric_no} />
                            <QuickInfo icon="phone" label="Contact" value={user?.student?.contact_number} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Information Section */}
            <div className="mt-6 sm:mt-8">
                <div className="flex items-center justify-between mb-4 sm:mb-6 px-1">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#635985]">info</span>
                        <h2 className="text-lg sm:text-xl font-semibold text-white">Detailed Information</h2>
                    </div>
                    {!viewOnly && (
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="p-2 hover:bg-[#635985]/20 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined text-[#635985]">edit</span>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <DetailCard
                            icon="school"
                            title="Academic Status"
                            items={[
                                { label: "Level", value: user?.student?.level },
                                { label: "Year", value: user?.student?.year },
                                { label: "Matric Number", value: user?.student?.matric_no }
                            ]}
                        />
                        <DetailCard
                            icon="account_balance"
                            title="Institution"
                            items={[
                                { label: "University", value: user?.student?.university },
                                { label: "Faculty", value: user?.student?.faculty }
                            ]}
                        />
                        <DetailCard
                            icon="contact_page"
                            title="Contact Information"
                            items={[
                                { label: "Email", value: user?.email },
                                { label: "Phone", value: user?.student?.contact_number }
                            ]}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

function QuickInfo({ icon, label, value }) {
    return (
        <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <span className="material-symbols-outlined text-[#635985]">{icon}</span>
                <span className="text-xs sm:text-sm text-gray-400">{label}</span>
            </div>
            <p className="text-sm sm:text-base text-white">{value || 'Not set'}</p>
        </div>
    );
}

function DetailCard({ icon, title, items }) {
    return (
        <div className="bg-[#1e1b4b]/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[#635985]">{icon}</span>
                <h3 className="text-lg font-medium text-white">{title}</h3>
            </div>
            <div className="space-y-4">
                {items.map((item, index) => (
                    <div key={index}>
                        <p className="text-sm text-gray-400 mb-1">{item.label}</p>
                        <p className="text-white">{item.value || 'Not set'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
