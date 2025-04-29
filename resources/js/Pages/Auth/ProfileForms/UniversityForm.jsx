import { useState } from 'react';

// Constant for university options
const UNIVERSITIES = [
    'Universiti Malaysia Pahang',
    'Universiti Malaysia Sabah',
    'Universiti Malaysia Terengganu',
    'Universiti Kebangsaan Malaysia',
    'Universiti Malaya',
    'Universiti Sains Malaysia',
    'Universiti Putra Malaysia',
    'Universiti Teknologi Malaysia',
    'Universiti Utara Malaysia',
    'Universiti Islam Antarabangsa Malaysia',
    'Universiti Pendidikan Sultan Idris',
    'Universiti Sains Islam Malaysia',
    'Universiti Teknologi MARA',
    'Universiti Malaysia Sarawak',
    'Universiti Teknikal Malaysia Melaka',
    'Universiti Malaysia Perlis',
    'Universiti Tun Hussein Onn Malaysia',
    'Universiti Sultan Zainal Abidin',
    'Universiti Pertahanan Nasional Malaysia',
    'Universiti Malaysia Kelantan'
];

export default function UniversityForm({ data, onChange, visibleFields = [] }) {
    // Form fields with initial values
    const [form, setForm] = useState({
        name: data.name || '',
        location: data.location || '',
        contact_email: data.contact_email || '',
        website: data.website || '',
        contact_number: data.contact_number || '',
        bio: data.bio || ''
    });
    
    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedForm = { ...form, [name]: value };
        setForm(updatedForm);
        onChange(updatedForm);
    };
    
    // Check if a field should be visible in the current step
    const isVisible = (fieldName) => {
        // If no visibleFields provided, show all fields
        if (!visibleFields.length) return true;
        return visibleFields.includes(fieldName);
    };

    // Get step-specific title and description
    const getStepInfo = () => {
        if (visibleFields.includes('name')) {
            return {
                title: "University Basics",
                description: "Tell us about your institution"
            };
        } else if (visibleFields.includes('contact_email')) {
            return {
                title: "Contact Information",
                description: "How can people reach your university?"
            };
        } else {
            return {
                title: "University Description",
                description: "Tell us more about your institution"
            };
        }
    };

    const { title, description } = getStepInfo();
    
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
                <p className="text-gray-400 mb-6">{description}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                {/* University Name */}
                {isVisible('name') && (
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                            University Name
                        </label>
                        <select
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                                text-white placeholder-gray-500 focus:border-[#635985] focus:ring-1 
                                focus:ring-[#635985] transition-colors appearance-none"
                            style={{ colorScheme: 'dark' }}
                        >
                            <option value="">Select university</option>
                            {UNIVERSITIES.map(university => (
                                <option key={university} value={university}>{university}</option>
                            ))}
                        </select>
                    </div>
                )}
                
                {/* Location */}
                {isVisible('location') && (
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={form.location}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                                text-white placeholder-gray-500 focus:border-[#635985] focus:ring-1 
                                focus:ring-[#635985] transition-colors"
                            placeholder="City, Country"
                        />
                    </div>
                )}
                
                {/* Contact Email */}
                {isVisible('contact_email') && (
                    <div>
                        <label htmlFor="contact_email" className="block text-sm font-medium text-gray-300 mb-1">
                            Contact Email
                        </label>
                        <input
                            type="email"
                            id="contact_email"
                            name="contact_email"
                            value={form.contact_email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                                text-white placeholder-gray-500 focus:border-[#635985] focus:ring-1 
                                focus:ring-[#635985] transition-colors"
                            placeholder="contact@university.edu"
                        />
                    </div>
                )}
                
                {/* Website */}
                {isVisible('website') && (
                    <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">
                            Website
                        </label>
                        <input
                            type="url"
                            id="website"
                            name="website"
                            value={form.website}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                                text-white placeholder-gray-500 focus:border-[#635985] focus:ring-1 
                                focus:ring-[#635985] transition-colors"
                            placeholder="https://university.edu"
                        />
                    </div>
                )}
                
                {/* Contact Number */}
                {isVisible('contact_number') && (
                    <div>
                        <label htmlFor="contact_number" className="block text-sm font-medium text-gray-300 mb-1">
                            Contact Number
                        </label>
                        <input
                            type="tel"
                            id="contact_number"
                            name="contact_number"
                            value={form.contact_number}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                                text-white placeholder-gray-500 focus:border-[#635985] focus:ring-1 
                                focus:ring-[#635985] transition-colors"
                            placeholder="Enter contact number"
                        />
                    </div>
                )}
            
                {/* Bio/Description */}
                {isVisible('bio') && (
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
                            University Description
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            rows="3"
                            value={form.bio}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                                text-white placeholder-gray-500 focus:border-[#635985] focus:ring-1 
                                focus:ring-[#635985] transition-colors"
                            placeholder="Tell us about your university, its history, and its offerings"
                        ></textarea>
                    </div>
                )}
            </div>
        </div>
    );
} 