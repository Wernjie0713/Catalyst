import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';

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

const LEVELS = ['Undergraduate', 'Postgraduate'];

export default function StudentForm({ data, onChange, visibleFields = [] }) {
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear + i);
    
    // Form fields with initial values
    const [form, setForm] = useState({
        matric_no: data.matric_no || '',
        year: data.year || '',
        level: data.level || '',
        contact_number: data.contact_number || '',
        bio: data.bio || '',
        faculty: data.faculty || '',
        university: data.university || '',
        expected_graduate: data.expected_graduate || ''
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
        if (visibleFields.includes('matric_no')) {
            return {
                title: "Student Identification",
                description: "Tell us about your academic status"
            };
        } else if (visibleFields.includes('faculty')) {
            return {
                title: "Academic Information",
                description: "Tell us about your institution"
            };
        } else {
            return {
                title: "Contact Information",
                description: "How can others reach you?"
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
                {/* Matric Number */}
                {isVisible('matric_no') && (
                    <div>
                        <label htmlFor="matric_no" className="block text-sm font-medium text-gray-300 mb-1">
                            Matric Number
                        </label>
                        <input
                            type="text"
                            id="matric_no"
                            name="matric_no"
                            value={form.matric_no}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                                text-white placeholder-gray-500 focus:border-[#635985] focus:ring-1 
                                focus:ring-[#635985] transition-colors"
                            placeholder="Enter your matric number"
                        />
                    </div>
                )}
                
                {/* Year */}
                {isVisible('year') && (
                    <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-1">
                            Current Year
                        </label>
                        <select
                            id="year"
                            name="year"
                            value={form.year}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                                text-white placeholder-gray-500 focus:border-[#635985] focus:ring-1 
                                focus:ring-[#635985] transition-colors appearance-none"
                            style={{ colorScheme: 'dark' }}
                        >
                            <option value="">Select year</option>
                            {[1, 2, 3, 4, 5, 6].map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                )}
                
                {/* Level */}
                {isVisible('level') && (
                    <div>
                        <label htmlFor="level" className="block text-sm font-medium text-gray-300 mb-1">
                            Level
                        </label>
                        <select
                            id="level"
                            name="level"
                            value={form.level}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                                text-white placeholder-gray-500 focus:border-[#635985] focus:ring-1 
                                focus:ring-[#635985] transition-colors appearance-none"
                            style={{ colorScheme: 'dark' }}
                        >
                            <option value="">Select level</option>
                            {LEVELS.map(level => (
                                <option key={level} value={level}>{level}</option>
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
                
                {/* University */}
                {isVisible('university') && (
                    <div>
                        <label htmlFor="university" className="block text-sm font-medium text-gray-300 mb-1">
                            University
                        </label>
                        <select
                            id="university"
                            name="university"
                            value={form.university}
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
                
                {/* Expected Graduate Year */}
                {isVisible('expected_graduate') && (
                    <div>
                        <label htmlFor="expected_graduate" className="block text-sm font-medium text-gray-300 mb-1">
                            Expected Graduation Year
                        </label>
                        <select
                            id="expected_graduate"
                            name="expected_graduate"
                            value={form.expected_graduate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                                text-white placeholder-gray-500 focus:border-[#635985] focus:ring-1 
                                focus:ring-[#635985] transition-colors appearance-none"
                            style={{ colorScheme: 'dark' }}
                        >
                            <option value="">Select year</option>
                            {yearOptions.map(year => (
                                <option key={year} value={year}>{year}</option>
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
                            placeholder="Tell us a bit about yourself"
                        ></textarea>
                    </div>
                )}
            </div>
        </div>
    );
} 