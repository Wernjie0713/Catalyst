import React from 'react';
import { Link } from '@inertiajs/react';

export const BackButton = ({ href, children }) => {
    return (
        <Link
            href={href}
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 font-medium shadow-lg shadow-gray-500/20 transition-all duration-200"
        >
            {children}
        </Link>
    );
}; 