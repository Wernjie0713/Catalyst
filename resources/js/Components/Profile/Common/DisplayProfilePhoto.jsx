import React from 'react';

// Reusable profile photo component with size and simple-inline options.
// Defaults preserve previous layout to avoid breaking existing usage.
export default function DisplayProfilePhoto({
    profilePhotoPath,
    size = 128, // px; 128 matches previous w-32/h-32
    simple = false, // when true, render only the circle without outer wrapper
    className = '', // extra classes for the circle
    containerClassName = '', // extra classes for wrapper when simple=false
}) {
    const getDisplayPath = () => {
        if (!profilePhotoPath) {
            return null;
        }
        const cleanPath = profilePhotoPath.startsWith('/') ? profilePhotoPath.slice(1) : profilePhotoPath;
        return `/${cleanPath}`;
    };

    const circle = (
        <div
            className={`rounded-full overflow-hidden bg-gray-100 relative shadow-lg ${className}`}
            style={{ width: `${size}px`, height: `${size}px` }}
        >
            {profilePhotoPath ? (
                <img
                    src={getDisplayPath()}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        console.error('Image failed to load:', e.target.src);
                        e.target.src = null;
                        e.target.onerror = null;
                    }}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="material-symbols-outlined text-4xl">person</span>
                </div>
            )}
        </div>
    );

    if (simple) {
        return circle;
    }

    return (
        <div className={`relative flex flex-col items-center`} style={{ width: `${size}px` }}>
            {circle}
        </div>
    );
}
