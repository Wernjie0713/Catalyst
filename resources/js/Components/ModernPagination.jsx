import { Link } from '@inertiajs/react';

export default function ModernPagination({ links, onPageChange }) {
    const isOnlyOnePage = links.length === 3;
    if (isOnlyOnePage) return null;

    return (
        <div className="flex items-center justify-center space-x-1.5 my-6">
            {links.map((link, key) => {
                if (link.url === null) {
                    return (
                        <span
                            key={key}
                            className="px-3 py-1.5 text-xs text-gray-400 bg-white border border-gray-300 rounded-md cursor-not-allowed"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={key}
                        href={link.url}
                        onClick={(e) => {
                            if (onPageChange) {
                                e.preventDefault();
                                onPageChange(link.url);
                            }
                        }}
                        className={`px-3 py-1.5 text-xs rounded-md transition-all duration-200 border ${
                            link.active
                                ? 'bg-[#F37022] border-[#F37022] text-white hover:bg-orange-600'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-300 hover:text-[#F37022]'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
} 