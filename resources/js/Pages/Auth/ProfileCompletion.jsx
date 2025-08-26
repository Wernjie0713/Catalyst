import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import StudentForm from './ProfileForms/StudentForm';
import LecturerForm from './ProfileForms/LecturerForm';
import OrganizerForm from './ProfileForms/OrganizerForm';
import UniversityForm from './ProfileForms/UniversityForm';
import DepartmentStaffForm from './ProfileForms/DepartmentStaffForm';

// Step components for each role
const roleSteps = {
    student: [
        { 
            id: 'basics', 
            title: 'Basic Information',
            fields: ['matric_no', 'year', 'level']
        },
        { 
            id: 'academic', 
            title: 'Academic Details',
            fields: ['faculty', 'university', 'programme', 'expected_graduate']
        },
        { 
            id: 'personal', 
            title: 'Personal Details',
            fields: ['contact_number', 'bio']
        }
    ],
    lecturer: [
        { 
            id: 'basics', 
            title: 'Basic Information',
            fields: ['specialization']
        },
        { 
            id: 'academic', 
            title: 'Academic Details',
            fields: ['faculty', 'university']
        },
        { 
            id: 'personal', 
            title: 'Personal Details',
            fields: ['contact_number', 'bio', 'linkedin']
        }
    ],
    department_staff: [
        { 
            id: 'basics', 
            title: 'Basic Information',
            fields: ['department', 'position'] 
        },
        { 
            id: 'academic', 
            title: 'Academic Details',
            fields: ['faculty', 'university']
        },
        { 
            id: 'personal', 
            title: 'Personal Details',
            fields: ['contact_number', 'bio', 'linkedin']
        }
    ],
    organizer: [
        { 
            id: 'basics', 
            title: 'Organization Information',
            fields: ['organization_name', 'official_email']
        },
        { 
            id: 'details', 
            title: 'Contact Details',
            fields: ['website', 'contact_number', 'linkedin']
        },
        { 
            id: 'about', 
            title: 'About Organization',
            fields: ['bio']
        }
    ],
    university: [
        { 
            id: 'basics', 
            title: 'Basic Information',
            fields: ['name', 'location']
        },
        { 
            id: 'contact', 
            title: 'Contact Information',
            fields: ['contact_email', 'website', 'contact_number']
        },
        { 
            id: 'about', 
            title: 'About University',
            fields: ['bio']
        }
    ]
};

export default function ProfileCompletion({ auth, role }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const steps = roleSteps[role] || [];
    const totalSteps = steps.length;
    const [error, setError] = useState('');
    
    // Handle form data changes
    const handleChange = (data) => {
        setFormData(prev => ({ ...prev, ...data }));
    };
    
    // Go to next step
    const nextStep = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // On final step, submit the form
            handleSubmit();
        }
    };
    
    // Go to previous step
    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    // Skipping is disabled; users must complete required steps
    
    const onSuccess = (role) => {
        if (role === 'lecturer' || role === 'university') {
            // Use direct window.location for reliable redirect
            window.location.href = route('dashboard');
            return;
        }

        // For other roles, use the standard redirection
        router.visit(route('dashboard'));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        if (e) {
            e.preventDefault();
        }
        
        // Validate required fields based on role
        if (auth.user.role === 'lecturer') {
            const requiredFields = ['first_name', 'last_name', 'specialization', 'institute', 'qualification', 'bio'];
            const missingFields = requiredFields.filter(field => !formData[field]);
            
            if (missingFields.length > 0) {
                setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
                return;
            }
        }
        
        if (auth.user.role === 'university') {
            const requiredFields = ['name', 'location', 'contact_email', 'website', 'contact_number', 'bio'];
            const missingFields = requiredFields.filter(field => !formData[field]);
            
            if (missingFields.length > 0) {
                setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
                return;
            }
        }

        // Use Inertia router instead of axios
        router.post(route('profile.completion.save'), {
            ...formData,
            role: auth.user.role,
        }, {
            onSuccess: () => onSuccess(auth.user.role),
            onError: (errors) => {
                setError(errors.message || 'An error occurred while saving your profile.');
                console.error('Error saving profile:', errors);
            }
        });
    };

    // Get current step fields
    const getCurrentStepFields = () => {
        if (!steps[currentStep]) return [];
        return steps[currentStep].fields;
    };

    // Render form component with current step fields only
    const renderForm = () => {
        const fields = getCurrentStepFields();
        
        const FormComponent = {
            'student': StudentForm,
            'lecturer': LecturerForm,
            'university': UniversityForm,
            'department_staff': DepartmentStaffForm,
            'organizer': OrganizerForm
        }[role];
        
        if (!FormComponent) return <div>Unknown role</div>;
        
        return (
            <FormComponent 
                data={formData} 
                onChange={handleChange} 
                visibleFields={fields}
            />
        );
    };

    // Remove legacy select color overrides to align with light theme

    return (
        <div className="relative min-h-screen w-full bg-gradient-to-b from-white via-orange-50 to-orange-100 overflow-hidden">
            {/* Content */}
            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <Head title="Complete Your Profile" />
                
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
                        <p className="text-lg text-gray-600">
                            Step {currentStep + 1} of {totalSteps}: {steps[currentStep]?.title}
                        </p>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="w-full bg-orange-200/50 rounded-full h-2.5">
                            <div 
                                className="bg-[#F37022] h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                            ></div>
                        </div>
                        
                        <div className="flex justify-between mt-2">
                            {steps.map((step, index) => (
                                <div 
                                    key={step.id}
                                    className={`text-xs ${
                                        index < currentStep
                                            ? 'text-orange-600'
                                            : index === currentStep
                                                ? 'text-gray-800 font-medium'
                                                : 'text-gray-500'
                                    }`}
                                >
                                    {step.title}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-orange-200/50">
                        {renderForm()}
                        
                        <div className="flex justify-between mt-8">
                            <div>
                                {currentStep > 0 ? (
                                    <button 
                                        onClick={prevStep}
                                        className="px-4 py-2 text-gray-900 border border-orange-300 rounded-lg
                                            hover:bg-orange-50 transition-colors"
                                    >
                                        Previous
                                    </button>
                                ) : (
                                    <span className="px-4 py-2 text-transparent">placeholder</span>
                                )}
                            </div>
                            
                            <button 
                                onClick={nextStep}
                                className="px-6 py-2 bg-[#F37022] hover:bg-[#e3641a] text-white rounded-lg 
                                    transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#F37022]"
                            >
                                {currentStep === totalSteps - 1 ? 'Complete' : 'Next'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 