import Input from '../Input';
import { useForm } from '@inertiajs/react';
import UpdateProfilePhoto from '@/Components/Profile/Common/UpdateProfilePhoto';
import { useState } from 'react';

export default function DepartmentStaffPersonalInformation({ user }) {
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        department: user.departmentStaff?.department || '',
        position: user.departmentStaff?.position || '',
        contact_number: user.departmentStaff?.contact_number || '',
        bio: user.departmentStaff?.bio || '',
        linkedin: user.departmentStaff?.linkedin || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('profile.department-staff.update'), {
            onSuccess: () => {
                setIsEditing(false);
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
                            <UpdateProfilePhoto user={user} />
                        </div>
                        
                        {/* User Info */}
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {user.name}
                        </h1>
                        <p className="text-gray-300 mb-8">
                            {user.email}
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mb-12">
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                                <p className="text-gray-400 text-sm">Department</p>
                                <p className="text-white font-medium">{data.department || 'Not set'}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                                <p className="text-gray-400 text-sm">Position</p>
                                <p className="text-white font-medium">{data.position || 'Not set'}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                                <p className="text-gray-400 text-sm">Contact</p>
                                <p className="text-white font-medium">{data.contact_number || 'Not set'}</p>
                            </div>
                        </div>

                        {/* Department Staff Information Section */}
                        <div className="w-full max-w-4xl">
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-white">
                                        Department Staff Information
                                    </h2>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="text-white/70 hover:text-white transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                    </button>
                                </div>

                                {isEditing ? (
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
                                                label="Position"
                                                value={data.position}
                                                onChange={(e) => setData('position', e.target.value)}
                                                error={errors.position}
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InfoItem label="Department" value={data.department} />
                                        <InfoItem label="Position" value={data.position} />
                                        <InfoItem label="Contact Number" value={data.contact_number} />
                                        <InfoItem label="LinkedIn" value={data.linkedin} isLink={true} />
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

function InfoItem({ label, value, isLink }) {
    return (
        <div className="space-y-1">
            <p className="text-sm text-gray-400">{label}</p>
            {isLink && value ? (
                <a 
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#635985] transition-colors"
                >
                    {value}
                </a>
            ) : (
                <p className="text-white">{value || 'Not set'}</p>
            )}
        </div>
    );
} 