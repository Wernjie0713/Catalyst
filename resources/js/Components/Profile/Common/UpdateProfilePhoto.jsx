import { useForm } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { CameraIcon } from '@heroicons/react/24/solid';

export default function UpdateProfilePhoto({ user, className = '' }) {
    console.log('UpdateProfilePhoto user:', user);

    const photoInput = useRef(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [currentPhoto, setCurrentPhoto] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [photoError, setPhotoError] = useState('');

    const { data, setData, post, progress, errors, processing: formProcessing, reset } = useForm({
        photo: null,
    });

    // Initialize current photo when component mounts
    useEffect(() => {
        const model = user.student || user.lecturer || user.organizer || user.university || user.department_staff;
        if (model?.profile_photo_path) {
            // Use the full path from public directory
            setCurrentPhoto(`/${model.profile_photo_path}`);
        }
    }, [user]);

    const handlePhotoClick = () => {
        photoInput.current?.click();
        setIsEditing(true);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        
        // Check file size (5MB = 5 * 1024 * 1024 bytes)
        if (file && file.size > 5 * 1024 * 1024) {
            setPhotoError('Photo size must be less than 5MB. Please choose a smaller file or compress the current one.');
            e.target.value = ''; // Clear the input
            return;
        }

        setPhotoError(''); // Clear any previous errors
        setData('photo', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
            setIsEditing(true);
        }
    };

    const handleSave = async () => {
        if (!photoInput.current?.files?.[0]) return;

        setProcessing(true);
        const formData = new FormData();
        formData.append('photo', photoInput.current.files[0]);

        try {
            const response = await axios.post('/profile/photo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
            });

            if (response.data.path) {
                // Use the full path with leading slash
                setCurrentPhoto(`/${response.data.path}`);
                setIsEditing(false);
                setPhotoPreview(null);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert(error.response?.data?.error || 'Failed to upload photo');
        } finally {
            setProcessing(false);
        }
    };

    const handleCancel = () => {
        setPhotoPreview(null);
        setIsEditing(false);
        if (photoInput.current) {
            photoInput.current.value = '';
        }
    };

    return (
        <div className={className}>
            <input
                type="file"
                ref={photoInput}
                className="hidden"
                onChange={handlePhotoChange}
                accept="image/*"
            />
            
            <div className="relative">
                {/* Profile Photo Container */}
                <div 
                    onClick={handlePhotoClick}
                    className="relative cursor-pointer group"
                >
                    {/* Profile Image or Placeholder */}
                    <div className="relative">
                        {(photoPreview || currentPhoto) ? (
                            <>
                                <img
                                    src={photoPreview || currentPhoto}
                                    className="rounded-full h-32 w-32 object-cover ring-4 ring-[#635985]/30 transition-all duration-300 group-hover:ring-[#635985]/50"
                                    alt="Profile"
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <CameraIcon className="h-8 w-8 text-white/90" />
                                </div>
                            </>
                        ) : (
                            <div className="rounded-full h-32 w-32 bg-[#18122B] ring-4 ring-[#635985]/30 flex items-center justify-center group-hover:ring-[#635985]/50 transition-all duration-300">
                                <span className="text-gray-400 text-4xl">
                                    {user.name?.charAt(0).toUpperCase() || '?'}
                                </span>
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <CameraIcon className="h-8 w-8 text-white/90" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Edit Controls - Slide up when editing */}
                {isEditing && (
                    <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-max">
                        <div className="flex items-center gap-2 bg-[#18122B]/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-[#635985]/20">
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={processing || !photoPreview}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 
                                    ${processing || !photoPreview 
                                        ? 'bg-[#635985]/50 text-white/50 cursor-not-allowed' 
                                        : 'bg-[#635985] text-white hover:bg-[#635985]/80'}`}
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                        </svg>
                                        <span>Saving...</span>
                                    </div>
                                ) : 'Save'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={processing}
                                className="px-4 py-1.5 rounded-full text-sm font-medium text-gray-300 hover:text-white hover:bg-[#635985]/20 transition-all duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Upload Progress Bar */}
                {processing && (
                    <div className="absolute -bottom-2 left-0 right-0">
                        <div className="h-1 bg-[#635985]/20 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-[#635985] rounded-full transition-all duration-300"
                                style={{ width: '100%', animation: 'progress 1s ease infinite' }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {errors?.photo && (
                <div className="mt-2 text-center">
                    <p className="text-sm text-red-400">{errors.photo}</p>
                </div>
            )}

            {/* Add this CSS to your stylesheet */}
            <style jsx>{`
                @keyframes progress {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
