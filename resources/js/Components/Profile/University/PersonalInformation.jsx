import Input from '../Input';
import { useForm } from '@inertiajs/react';
import UpdateProfilePhoto from '@/Components/Profile/Common/UpdateProfilePhoto';
import DisplayProfilePhoto from '@/Components/Profile/Common/DisplayProfilePhoto';
import { useState } from 'react';
import FriendRequestButton from '@/Components/Profile/Common/FriendRequestButton';

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

export default function UniversityPersonalInformation({ 
    user, 
    viewOnly = false,
    showFriendButton = false,
    friendStatus,
    friendRequestId 
}) {
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, patch, processing, errors } = useForm({
        name: user?.university?.name || '',
        location: user?.university?.location || '',
        contact_email: user?.university?.contact_email || '',
        website: user?.university?.website || '',
        contact_number: user?.university?.contact_number || '',
        bio: user?.university?.bio || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => setIsEditing(false),
            onError: (errors) => console.error('Update failed:', errors)
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
                                profilePhotoPath={user?.university?.profile_photo_path}
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
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">{user?.name || 'University'}</h1>
                            <p className="text-sm sm:text-base text-gray-400">{user?.email || 'No email provided'}</p>
                            {user?.university?.bio && (
                                <p className="text-sm sm:text-base text-gray-300 mt-3">{user.university.bio}</p>
                            )}
                        </div>

                        {/* Quick Info Grid */}
                        <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-lg mx-auto md:mx-0">
                            <QuickInfo icon="location_on" label="Location" value={user?.university?.location} />
                            <QuickInfo icon="phone" label="Contact" value={user?.university?.contact_number} />
                            <QuickInfo icon="mail" label="Email" value={user?.university?.contact_email} />
                            <QuickInfo icon="language" label="Website" value={user?.university?.website} />
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
                                label="Name"
                                type="select"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                options={UNIVERSITIES}
                                className="bg-white/5 border-white/10 text-white"
                            />
                            <Input
                                label="Location"
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                error={errors.location}
                                className="bg-white/5 border-white/10 text-white"
                            />
                            <Input
                                label="Contact Email"
                                type="email"
                                value={data.contact_email}
                                onChange={(e) => setData('contact_email', e.target.value)}
                                error={errors.contact_email}
                                className="bg-white/5 border-white/10 text-white"
                            />
                            <Input
                                label="Website"
                                type="url"
                                value={data.website}
                                onChange={(e) => setData('website', e.target.value)}
                                error={errors.website}
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
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                            <textarea
                                rows={4}
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl 
                                    text-white placeholder-gray-500 focus:border-[#635985] focus:ring-1 
                                    focus:ring-[#635985] transition-colors duration-200"
                            />
                            {errors.bio && <p className="mt-1 text-sm text-red-400">{errors.bio}</p>}
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
                            icon="apartment"
                            title="University Details"
                            items={[
                                { label: "Name", value: user?.university?.name },
                                { label: "Location", value: user?.university?.location }
                            ]}
                        />
                        <DetailCard
                            icon="contact_page"
                            title="Contact Information"
                            items={[
                                { label: "Email", value: user?.university?.contact_email },
                                { label: "Phone", value: user?.university?.contact_number },
                                { label: "Website", value: user?.university?.website }
                            ]}
                        />
                        <DetailCard
                            icon="description"
                            title="Additional Information"
                            items={[
                                { label: "Bio", value: user?.university?.bio }
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