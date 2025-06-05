import React from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const LabelTagsSelector = ({ selectedTags, onChange, error }) => {
    const tagCategories = {
        'Skill Type (Cognitive Outcome Tags)': [
            'Technical Skills',
            'Soft Skills', 
            'Critical Thinking',
            'Research & Analysis',
            'Creativity & Innovation',
            'Business Acumen',
            'Digital Literacy'
        ],
        'Learning Depth / Level': [
            'Introductory',
            'Intermediate', 
            'Advanced'
        ],
        'Event Format / Interaction Style': [
            'Lecture',
            'Workshop',
            'Hackathon',
            'Group Project',
            'Mentorship',
            'Panel',
            'Networking'
        ],
        'Academic/Career Relevance': [
            'Career Exploration',
            'Industry Exposure',
            'Portfolio Development',
            'Internship Pipeline',
            'Capstone Prep'
        ]
    };

    const handleTagChange = (tag) => {
        const updatedTags = selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag];
        onChange(updatedTags);
    };

    return (
        <div className="space-y-6">
            <InputLabel 
                htmlFor="label_tags" 
                value="Event Labels (Select all that apply)" 
                className="text-white text-base font-semibold mb-3 flex items-center gap-2"
            >
                <span className="material-symbols-outlined text-[#635985] text-lg">label</span>
                Event Labels (Select all that apply)
            </InputLabel>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(tagCategories).map(([category, tags]) => (
                    <div key={category} className="bg-[#2A2A3A]/50 rounded-lg p-4 border border-gray-600/30">
                        <h4 className="text-[#635985] font-medium text-sm mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-xs">category</span>
                            {category}
                        </h4>
                        <div className="space-y-2">
                            {tags.map((tag) => (
                                <label key={tag} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={selectedTags.includes(tag)}
                                        onChange={() => handleTagChange(tag)}
                                        className="w-4 h-4 text-[#635985] bg-[#18122B] border-gray-600 rounded focus:ring-[#635985] focus:ring-2"
                                    />
                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                        {tag}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Selected Tags Preview */}
            {selectedTags.length > 0 && (
                <div className="bg-[#18122B]/50 rounded-lg p-4 border border-[#635985]/20">
                    <h4 className="text-white font-medium text-sm mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#635985] text-sm">preview</span>
                        Selected Tags Preview ({selectedTags.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-[#635985]/20 text-[#635985] rounded-full text-xs font-medium border border-[#635985]/30"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <InputError message={error} className="mt-2" />
        </div>
    );
};

export default LabelTagsSelector; 