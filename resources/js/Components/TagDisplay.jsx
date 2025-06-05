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
            return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
        }
        // Learning Depth tags
        if (['Introductory', 'Intermediate', 'Advanced'].includes(tag)) {
            return 'bg-green-500/20 text-green-300 border-green-500/30';
        }
        // Event Format tags
        if (['Lecture', 'Workshop', 'Hackathon', 'Group Project', 'Mentorship', 'Panel', 'Networking'].includes(tag)) {
            return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
        }
        // Academic/Career tags
        if (['Career Exploration', 'Industry Exposure', 'Portfolio Development', 'Internship Pipeline', 'Capstone Prep'].includes(tag)) {
            return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
        }
        // Default
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
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