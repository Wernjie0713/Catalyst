import { Link } from '@inertiajs/react';

export default function ModernPagination({ links }) {
    const isOnlyOnePage = links.length === 3;
    if (isOnlyOnePage) return null;

    return (
        <div className="flex items-center justify-center space-x-1.5 my-6">
            {links.map((link, key) => {
                if (link.url === null) {
                    return (
                        <span
                            key={key}
                            className="px-3 py-1.5 text-xs text-gray-400 bg-gray-800/50 rounded-md cursor-not-allowed"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={key}
                        href={link.url}
                        className={`px-3 py-1.5 text-xs rounded-md transition-all duration-200 ${
                            link.active
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'text-gray-300 hover:bg-gray-800/50'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
} 