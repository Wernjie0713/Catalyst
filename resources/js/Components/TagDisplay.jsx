import React from 'react';

const TagDisplay = ({ tags, className = '', maxDisplay = 3, showCount = true }) => {
    if (!tags || !Array.isArray(tags) || tags.length === 0) {
        return null;
    }

    const displayTags = tags.slice(0, maxDisplay);
    const remainingCount = tags.length - maxDisplay;

    const getTagColor = (tag) => {
        // Skill Type tags
        if (['Technical Skills', 'Soft Skills', 'Critical Thinking', 'Research & Analysis', 'Creativity & Innovation', 'Business Acumen', 'Digital Literacy'].includes(tag)) {
            return 'bg-blue-100 text-blue-700 border-blue-300';
        }
        // Learning Depth tags
        if (['Introductory', 'Intermediate', 'Advanced'].includes(tag)) {
            return 'bg-green-100 text-green-700 border-green-300';
        }
        // Event Format tags
        if (['Lecture', 'Workshop', 'Hackathon', 'Group Project', 'Mentorship', 'Panel', 'Networking'].includes(tag)) {
            return 'bg-purple-100 text-purple-700 border-purple-300';
        }
        // Academic/Career tags
        if (['Career Exploration', 'Industry Exposure', 'Portfolio Development', 'Internship Pipeline', 'Capstone Prep'].includes(tag)) {
            return 'bg-orange-100 text-orange-700 border-orange-300';
        }
        // Default
        return 'bg-gray-100 text-gray-700 border-gray-300';
    };

    return (
        <div className={`flex flex-wrap gap-1.5 ${className}`}>
            {displayTags.map((tag, index) => (
                <span
                    key={index}
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getTagColor(tag)} transition-colors`}
                    title={tag}
                >
                    {tag}
                </span>
            ))}
            {remainingCount > 0 && showCount && (
                <span
                    className="px-2 py-1 text-xs font-medium rounded-full border bg-gray-600/20 text-gray-400 border-gray-600/30"
                    title={`${remainingCount} more tags: ${tags.slice(maxDisplay).join(', ')}`}
                >
                    +{remainingCount}
                </span>
            )}
        </div>
    );
};

export default TagDisplay; 