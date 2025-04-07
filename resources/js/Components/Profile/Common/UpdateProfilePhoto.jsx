import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function UpdateProfilePhoto({ user }) {
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');
    const [isHovering, setIsHovering] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        photo: null,
        profile_type: getProfileType(user)
    });

    // Auto-hide error message after 5 seconds
    useEffect(() => {
        if (error || errors.photo) {
            const timer = setTimeout(() => {
                setError('');
                reset('photo');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, errors.photo]);

    // Helper function to get profile type
    function getProfileType(user) {
        if (user.department_staff) return 'department_staff';
        if (user.student) return 'student';
        if (user.lecturer) return 'lecturer';
        if (user.university) return 'university';
        if (user.organizer) return 'organizer';
        return null;
    }

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setError(''); // Clear any previous errors

        // Validate file size (2MB = 2 * 1024 * 1024 bytes)
        if (file && file.size > 2 * 1024 * 1024) {
            setError('Image size must be less than 2MB');
            e.target.value = ''; // Clear the input
            return;
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        if (file && !allowedTypes.includes(file.type)) {
            setError('Please upload a valid image file (JPEG, PNG, JPG, GIF)');
            e.target.value = ''; // Clear the input
            return;
        }

        if (file) {
            setData('photo', file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('profile.photo'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                window.location.reload();
            },
            onError: (errors) => {
                console.error('Upload failed:', errors);
                setError(errors.photo || 'Failed to upload photo. Please try again.');
                setImagePreview(null);
                reset('photo');
            }
        });
    };

    // Function to get the display image source
    const getDisplayImage = () => {
        if (imagePreview) {
            return imagePreview;
        }
        const profile = user[getProfileType(user)];
        return profile?.profile_photo_path ? `/${profile.profile_photo_path}` : null;
    };

    const displayImage = getDisplayImage();

    return (
        <div className="relative flex flex-col items-center w-32">
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col items-center relative">
                {/* Profile Image Container */}
                <div 
                    className="w-32 relative"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {/* Profile Image Circle */}
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 relative shadow-lg">
                        {displayImage ? (
                            <img
                                src={displayImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span className="material-symbols-outlined text-4xl">person</span>
                            </div>
                        )}
                        
                        {/* Hover Overlay */}
                        <div 
                            className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer
                                ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                            onClick={() => document.getElementById('photo').click()}
                        >
                            <div className="transform transition-transform duration-300 ease-in-out hover:scale-110">
                                <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                            </div>
                        </div>
                    </div>

                    <input
                        type="file"
                        id="photo"
                        onChange={handlePhotoChange}
                        className="hidden"
                        accept="image/jpeg,image/png,image/jpg,image/gif"
                    />
                </div>
                {/* Error Message - Positioned relative to form */}
                {(error || errors.photo) && (
                    <div className="ml-50">
                        <div className="bg-red-500/90 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap mt-2">
                            <span className="material-symbols-outlined text-base">error</span>
                            <span className="text-sm font-medium">{error || errors.photo}</span>
                        </div>
                    </div>
                )}
                {/* Save Button */}
                {imagePreview && (
                    <div className="mt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-0.5 text-sm font-medium text-white hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            <span className="relative flex items-center gap-1.5 rounded-full bg-blue-500 px-3 py-1.5 transition-all duration-200 ease-in group-hover:bg-opacity-0">
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-base">save</span>
                                        <span>Save</span>
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
