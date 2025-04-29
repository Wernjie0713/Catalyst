import { useState } from 'react';

export default function OrganizerForm({ data, onChange, visibleFields = [] }) {
    // Form fields with initial values
    const [form, setForm] = useState({
        organization_name: data.organization_name || '',
        official_email: data.official_email || '',
        website: data.website || '',
        contact_number: data.contact_number || '',
        bio: data.bio || '',
        linkedin: data.linkedin || ''
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
        if (visibleFields.includes('organization_name')) {
            return {
                title: "Organization Basics",
                description: "Tell us about your organization"
            };
        } else if (visibleFields.includes('website')) {
            return {
                title: "Contact Details",
                description: "How can people reach your organization?"
            };
        } else {
            return {
                title: "Organization Description",
                description: "Tell us more about what your organization does"
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
                {/* Organization Name */}
                {isVisible('organization_name') && (
                    <div>
                        <label htmlFor="organization_name" className="block text-sm font-medium text-gray-300 mb-1">
                            Organization Name
                        </label>
                        <input
                            type="text"
                            id="organization_name"
                            name="organization_name"
                            value={form.organization_name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                                text-white placeholder-gray-500 focus:border-[#635985] focus:ring-1 
                                focus:ring-[#635985] transition-colors"
                            placeholder="Enter your organization name"
                        />
                    </div>
                )}
                
                {/* Official Email */}
                {isVisible('official_email') && (
                    <div>
                        <label htmlFor="official_email" className="block text-sm font-medium text-gray-300 mb-1">
                            Official Email
                        </label>
                        <input
                            type="email"
                            id="official_email"
                            name="official_email"
                            value={form.official_email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                                text-white placeholder-gray-500 focus:border-[#635985] focus:ring-1 
                                focus:ring-[#635985] transition-colors"
                            placeholder="organization@example.com"
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
                            placeholder="https://yourorganization.com"
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
                
                {/* LinkedIn */}
                {isVisible('linkedin') && (
                    <div>
                        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-300 mb-1">
                            LinkedIn Profile
                        </label>
                        <input
                            type="url"
                            id="linkedin"
                            name="linkedin"
                            value={form.linkedin}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                                text-white placeholder-gray-500 focus:border-[#635985] focus:ring-1 
                                focus:ring-[#635985] transition-colors"
                            placeholder="https://linkedin.com/company/yourcompany"
                        />
                    </div>
                )}
            
                {/* Bio/Description */}
                {isVisible('bio') && (
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
                            Organization Description
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
                            placeholder="Tell us about your organization and its mission"
                        ></textarea>
                    </div>
                )}
            </div>
        </div>
    );
} 