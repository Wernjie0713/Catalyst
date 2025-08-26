import Input from '../Input';
import { useForm } from '@inertiajs/react';
import UpdateProfilePhoto from '@/Components/Profile/Common/UpdateProfilePhoto';
import DisplayProfilePhoto from '@/Components/Profile/Common/DisplayProfilePhoto';
import FriendRequestButton from '@/Components/Profile/Common/FriendRequestButton';
import { useState } from 'react';

const ORGANIZER_STATUS = ['Pending', 'Verified', 'Rejected'];

export default function OrganizerPersonalInformation({ 
    user, 
    viewOnly = false,
    showFriendButton = false,
    friendStatus,
    friendRequestId 
}) {
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, patch, processing, errors } = useForm({
        organization_name: user?.organizer?.organization_name || '',
        contact_number: user?.organizer?.contact_number || '',
        official_email: user?.organizer?.official_email || '',
        website: user?.organizer?.website || '',
        linkedin: user?.organizer?.linkedin || '',
        bio: user?.organizer?.bio || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
            },
            onError: (errors) => {
                console.error('Update failed:', errors);
            }
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Profile Header Section */}
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-4 sm:p-6 border border-orange-100 shadow-sm">
                <div className="flex flex-col items-center md:flex-row md:items-start gap-6 md:gap-8">
                    {/* Profile Picture and Friend Button Column */}
                    <div className="flex flex-col items-center flex-shrink-0">
                        {!viewOnly ? (
                            <UpdateProfilePhoto user={user} />
                        ) : (
                            <DisplayProfilePhoto 
                                profilePhotoPath={user?.organizer?.profile_photo_path}
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
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">{user?.name || 'User'}</h1>
                            <p className="text-sm sm:text-base text-gray-400">{user?.email || 'No email provided'}</p>
                            {user?.organizer?.bio && (
                                <p className="text-sm sm:text-base text-gray-300 mt-3">{user.organizer.bio}</p>
                            )}
                        </div>

                        {/* Quick Info Grid */}
                        <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-lg mx-auto md:mx-0">
                            <QuickInfo icon="business" label="Organization" value={user?.organizer?.organization_name} />
                            <QuickInfo icon="phone" label="Contact" value={user?.organizer?.contact_number} />
                            <QuickInfo icon="mail" label="Official Email" value={user?.organizer?.official_email} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Information Section */}
            <div className="mt-6 sm:mt-8">
                <div className="flex items-center justify-between mb-4 sm:mb-6 px-1">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-orange-500">info</span>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Detailed Information</h2>
                    </div>
                    {!viewOnly && (
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined text-orange-500">edit</span>
                        </button>
                    )}
                </div>

                {(isEditing && !viewOnly) ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Organization Name"
                                value={data.organization_name}
                                onChange={(e) => setData('organization_name', e.target.value)}
                                error={errors.organization_name}
                                className="bg-white border border-orange-200 text-gray-800 placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                            />
                            <Input
                                label="Contact Number"
                                type="tel"
                                value={data.contact_number}
                                onChange={(e) => setData('contact_number', e.target.value)}
                                error={errors.contact_number}
                                className="bg-white border border-orange-200 text-gray-800 placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                            />
                            <Input
                                label="Official Email"
                                type="email"
                                value={data.official_email}
                                onChange={(e) => setData('official_email', e.target.value)}
                                error={errors.official_email}
                                className="bg-white border border-orange-200 text-gray-800 placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                            />
                            <Input
                                label="Website"
                                type="url"
                                value={data.website}
                                onChange={(e) => setData('website', e.target.value)}
                                error={errors.website}
                                className="bg-white border border-orange-200 text-gray-800 placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                                placeholder="https://example.com"
                            />
                            <Input
                                label="LinkedIn"
                                type="url"
                                value={data.linkedin}
                                onChange={(e) => setData('linkedin', e.target.value)}
                                error={errors.linkedin}
                                className="bg-white border border-orange-200 text-gray-800 placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                                placeholder="https://linkedin.com/company/name"
                            />
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bio
                            </label>
                            <textarea
                                rows={4}
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-orange-200 rounded-xl 
                                    text-gray-800 placeholder-gray-500 focus:border-orange-500 focus:ring-2 
                                    focus:ring-orange-200 transition-colors duration-200"
                            />
                            {errors.bio && (
                                <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2.5 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-orange-500 text-white rounded-xl 
                                    hover:bg-orange-600 transform transition-all duration-200 
                                    hover:scale-105 disabled:opacity-75 flex items-center gap-2"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <DetailCard
                            icon="business"
                            title="Organization Details"
                            items={[
                                { label: "Organization Name", value: user?.organizer?.organization_name },
                                { label: "Status", value: user?.organizer?.status || 'Pending' }
                            ]}
                        />
                        <DetailCard
                            icon="contact_page"
                            title="Contact Information"
                            items={[
                                { label: "Email", value: user?.email },
                                { label: "Official Email", value: user?.organizer?.official_email },
                                { label: "Phone", value: user?.organizer?.contact_number }
                            ]}
                        />
                        <DetailCard
                            icon="public"
                            title="Online Presence"
                            items={[
                                { label: "Website", value: user?.organizer?.website, isLink: true },
                                { label: "LinkedIn", value: user?.organizer?.linkedin, isLink: true }
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
                <span className="material-symbols-outlined text-orange-500">{icon}</span>
                <span className="text-xs sm:text-sm text-gray-600">{label}</span>
            </div>
            {isLink && value ? (
                <a 
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm sm:text-base text-orange-500 hover:text-orange-600"
                >
                    {value}
                </a>
            ) : (
                <p className="text-sm sm:text-base text-gray-800">{value || 'Not set'}</p>
            )}
        </div>
    );
}

function DetailCard({ icon, title, items }) {
    return (
        <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-6 border border-orange-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-orange-500">{icon}</span>
                <h3 className="text-lg font-medium text-gray-800">{title}</h3>
            </div>
            <div className="space-y-4">
                {items.map((item, index) => (
                    <div key={index}>
                        <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                        {item.isLink && item.value ? (
                            <a 
                                href={item.value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-500 hover:text-orange-600"
                            >
                                {item.value}
                            </a>
                        ) : (
                            <p className="text-gray-800">{item.value || 'Not set'}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
} 
