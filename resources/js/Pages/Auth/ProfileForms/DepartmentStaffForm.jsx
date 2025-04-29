import { useState } from 'react';

// Constants for dropdown options
const FACULTIES = [
    'Faculty of Computing',
    'Faculty of Civil Engineering',
    'Faculty of Electrical Engineering',
    'Faculty of Chemical Engineering',
    'Faculty of Mechanical Engineering',
    'Faculty of Industrial Sciences & Technology',
    'Faculty of Manufacturing Engineering',
    'Faculty of Technology Engineering',
    'Faculty of Business & Communication',
    'Faculty of Industrial Management',
    'Faculty of Applied Sciences',
    'Faculty of Science & Technology',
    'Faculty of Medicine',
    'Faculty of Pharmacy',
    'Faculty of Dentistry',
    'Faculty of Arts & Social Sciences',
    'Faculty of Education',
    'Faculty of Economics & Administration',
    'Faculty of Law',
    'Faculty of Built Environment',
    'Faculty of Agriculture',
    'Faculty of Forestry',
    'Faculty of Veterinary Medicine',
    'Faculty of Islamic Studies',
    'Faculty of Sports Science',
    'Faculty of Creative Technology',
    'Faculty of Music',
    'Faculty of Architecture & Design',
    'Faculty of Hotel & Tourism Management',
    'Faculty of Health Sciences',
    'Faculty of Defence Studies & Management'
];

const POSITIONS = [
    'Administrative Assistant',
    'Department Coordinator',
    'Academic Advisor',
    'Administrative Officer',
    'Department Secretary',
    'Resource Manager',
    'Student Affairs Coordinator',
    'Curriculum Assistant',
    'Program Administrator',
    'Department Technician',
    'Lab Coordinator',
    'Records Officer',
    'Finance Assistant',
    'Events Coordinator',
    'Communications Officer',
    'Scheduling Coordinator',
    'Facilities Manager',
    'Department Assistant'
];

export default function DepartmentStaffForm({ data, onChange, visibleFields = [] }) {
    // Form fields with initial values
    const [form, setForm] = useState({
        department: data.department || '',
        position: data.position || '',
        faculty: data.faculty || '',
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
        if (visibleFields.includes('department')) {
            return {
                title: "Department Information",
                description: "Tell us about your department role"
            };
        } else if (visibleFields.includes('faculty')) {
            return {
                title: "Faculty Information",
                description: "Tell us about your faculty"
            };
        } else {
            return {
                title: "Contact Information",
                description: "How can people reach you?"
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
                {/* Department */}
                {isVisible('department') && (
                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-1">
                            Department
                        </label>
                        <input
                            type="text"
                            id="department"
                            name="department"
                            value={form.department}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                                text-white placeholder-gray-500 focus:border-[#635985] focus:ring-1 
                                focus:ring-[#635985] transition-colors"
                            placeholder="Enter your department"
                        />
                    </div>
                )}
                
                {/* Position */}
                {isVisible('position') && (
                    <div>
                        <label htmlFor="position" className="block text-sm font-medium text-gray-300 mb-1">
                            Position
                        </label>
                        <select
                            id="position"
                            name="position"
                            value={form.position}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                                text-white placeholder-gray-500 focus:border-[#635985] focus:ring-1 
                                focus:ring-[#635985] transition-colors appearance-none"
                            style={{ colorScheme: 'dark' }}
                        >
                            <option value="">Select position</option>
                            {POSITIONS.map(position => (
                                <option key={position} value={position}>{position}</option>
                            ))}
                        </select>
                    </div>
                )}
                
                {/* Faculty */}
                {isVisible('faculty') && (
                    <div>
                        <label htmlFor="faculty" className="block text-sm font-medium text-gray-300 mb-1">
                            Faculty
                        </label>
                        <select
                            id="faculty"
                            name="faculty"
                            value={form.faculty}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                                text-white placeholder-gray-500 focus:border-[#635985] focus:ring-1 
                                focus:ring-[#635985] transition-colors appearance-none"
                            style={{ colorScheme: 'dark' }}
                        >
                            <option value="">Select faculty</option>
                            {FACULTIES.map(faculty => (
                                <option key={faculty} value={faculty}>{faculty}</option>
                            ))}
                        </select>
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
                            placeholder="Enter your contact number"
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
                            placeholder="https://linkedin.com/in/yourprofile"
                        />
                    </div>
                )}
            
                {/* Bio */}
                {isVisible('bio') && (
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
                            Bio
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
                            placeholder="Tell us about your role and responsibilities"
                        ></textarea>
                    </div>
                )}
            </div>
        </div>
    );
} 