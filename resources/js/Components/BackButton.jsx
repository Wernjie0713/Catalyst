import React from 'react';
import { Link } from '@inertiajs/react';

export const BackButton = ({ href, children }) => {
    return (
        <Link
            href={href}
            className="inline-flex items-center justify-center px-6 py-3 bg-white-500 text-black rounded-lg hover:bg-gray-100 font-medium shadow-lg shadow-gray-500/20 transition-all duration-200"
        >
            {children}
        </Link>
    );
}; 