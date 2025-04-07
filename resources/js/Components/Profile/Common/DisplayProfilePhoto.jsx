import React from 'react';

export default function DisplayProfilePhoto({ profilePhotoPath }) {
    // Add path processing here
    const getDisplayPath = () => {
        if (!profilePhotoPath) {
            return null;
        }
        // Remove any leading slash to prevent double slashes
        const cleanPath = profilePhotoPath.startsWith('/') ? profilePhotoPath.slice(1) : profilePhotoPath;
        return `/${cleanPath}`;
    };

    return (
        <div className="relative flex flex-col items-center w-32">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 relative shadow-lg">
                {profilePhotoPath ? (
                    <img
                        src={getDisplayPath()}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            console.error('Image failed to load:', e.target.src);
                            e.target.src = null; // Clear the failed image
                            e.target.onerror = null; // Prevent infinite loop
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="material-symbols-outlined text-4xl">person</span>
                    </div>
                )}
            </div>
        </div>
    );
}
