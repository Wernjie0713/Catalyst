import Input from '../Input';
import { useForm } from '@inertiajs/react';
import UpdateProfilePhoto from '@/Components/Profile/Common/UpdateProfilePhoto';
import DisplayProfilePhoto from '@/Components/Profile/Common/DisplayProfilePhoto';
import FriendRequestButton from '@/Components/Profile/Common/FriendRequestButton';
import { useState } from 'react';

export default function LecturerPersonalInformation({ 
    user, 
    viewOnly = false,
    showFriendButton = false,
    friendStatus,
    friendRequestId 
}) {
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, patch, processing, errors } = useForm({    
        department: user?.lecturer?.department || '',
        specialization: user?.lecturer?.specialization || '',
        contact_number: user?.lecturer?.contact_number || '',
        bio: user?.lecturer?.bio || '',
        linkedin: user?.lecturer?.linkedin || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        patch(route('profile.update'), {
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
                                profilePhotoPath={user?.lecturer?.profile_photo_path}
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
                            {user?.lecturer?.bio && (
                                <p className="text-sm sm:text-base text-gray-300 mt-3">{user.lecturer.bio}</p>
                            )}
                        </div>

                        {/* Quick Info Grid */}
                        <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-lg mx-auto md:mx-0">
                            <QuickInfo icon="school" label="Department" value={user?.lecturer?.department} />
                            <QuickInfo icon="psychology" label="Specialization" value={user?.lecturer?.specialization} />
                            <QuickInfo icon="phone" label="Contact" value={user?.lecturer?.contact_number} />
                            <QuickInfo icon="link" label="LinkedIn" value={user?.lecturer?.linkedin} isLink={true} />
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
                                label="Department"
                                value={data.department}
                                onChange={(e) => setData('department', e.target.value)}
                                error={errors.department}
                                className="bg-white/5 border-white/10 text-white"
                            />
                            <Input
                                label="Specialization"
                                value={data.specialization}
                                onChange={(e) => setData('specialization', e.target.value)}
                                error={errors.specialization}
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
                                label="LinkedIn"
                                type="url"
                                value={data.linkedin}
                                onChange={(e) => setData('linkedin', e.target.value)}
                                error={errors.linkedin}
                                className="bg-white/5 border-white/10 text-white"
                                placeholder="https://linkedin.com/in/username"
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
                            title="Academic Information"
                            items={[
                                { label: "Department", value: user?.lecturer?.department },
                                { label: "Specialization", value: user?.lecturer?.specialization }
                            ]}
                        />
                        <DetailCard
                            icon="contact_page"
                            title="Contact Information"
                            items={[
                                { label: "Email", value: user?.email },
                                { label: "Phone", value: user?.lecturer?.contact_number }
                            ]}
                        />
                        <DetailCard
                            icon="person"
                            title="Professional Details"
                            items={[
                                { label: "LinkedIn", value: user?.lecturer?.linkedin, isLink: true },
                                { label: "Bio", value: user?.lecturer?.bio }
                            ]}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

function QuickInfo({ icon, label, value, isLink }) {
    return (
        <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <span className="material-symbols-outlined text-[#635985]">{icon}</span>
                <span className="text-xs sm:text-sm text-gray-400">{label}</span>
            </div>
            {isLink && value ? (
                <a 
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm sm:text-base text-[#635985] hover:text-[#635985]/80"
                >
                    {value}
                </a>
            ) : (
                <p className="text-sm sm:text-base text-white">{value || 'Not set'}</p>
            )}
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
                        {item.isLink && item.value ? (
                            <a 
                                href={item.value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#635985] hover:text-[#635985]/80"
                            >
                                {item.value}
                            </a>
                        ) : (
                            <p className="text-white">{item.value || 'Not set'}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
} 
