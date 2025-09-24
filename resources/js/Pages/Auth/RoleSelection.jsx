import { Head, router } from '@inertiajs/react';

const roles = [
    {
        name: 'student',
        description: 'Access learning resources, join events, and track your academic journey',
        icon: '👨‍🎓',
        title: 'Student'
    },
    {
        name: 'lecturer',
        description: 'Organize events, and guide students in their academic pursuits',
        icon: '👨‍🏫',
        title: 'Lecturer'
    },
    {
        name: 'university',
        description: 'Oversee institutional activities and manage university-wide events',
        icon: '🏛️',
        title: 'University'
    },
    {
        name: 'department_staff',
        description: 'Coordinate department activities and support academic operations',
        icon: '👨‍💼',
        title: 'Department Staff'
    },
    {
        name: 'organizer',
        description: 'Create and manage events, workshops, and competitions',
        icon: '📋',
        title: 'Organizer'
    },
];

export default function RoleSelection() {
    const handleRoleSelect = (selectedRole) => {
        router.post(route('user.assign.role'), {
            role: selectedRole.toLowerCase().replace(' ', '_')
        }, {
            preserveState: false,
            onSuccess: (page) => {
                window.location.href = route('dashboard');
            },
            onError: (errors) => {
                console.error('Role assignment failed:', errors);
            }
        });
    };

    return (
        <div className="relative min-h-screen w-full bg-gradient-to-b from-white via-orange-50 to-orange-100 overflow-hidden">
            {/* Content */}
            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <Head title="Select Your Role" />
                
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to KooQ</h2>
                        <p className="text-lg text-gray-600">Choose your role to get started</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {roles.slice(0, 3).map((role) => (
                            <button
                                key={role.name}
                                onClick={() => handleRoleSelect(role.name)}
                                className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-orange-200/50 
                                    hover:border-orange-300 transition-all duration-300 ease-in-out transform hover:-translate-y-1
                                    focus:outline-none focus:ring-2 focus:ring-[#F37022] focus:ring-offset-2"
                            >
                                <div className="text-4xl mb-4">{role.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{role.title}</h3>
                                <p className="text-gray-600 text-sm">{role.description}</p>
                                <div className="absolute inset-0 rounded-2xl bg-[#F37022]/0 group-hover:bg-[#F37022]/5 
                                    transition-colors duration-300 pointer-events-none" />
                            </button>
                        ))}
                        
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 md:max-w-2xl lg:mx-auto">
                            {roles.slice(3).map((role) => (
                                <button
                                    key={role.name}
                                    onClick={() => handleRoleSelect(role.name)}
                                    className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-orange-200/50 
                                        hover:border-orange-300 transition-all duration-300 ease-in-out transform hover:-translate-y-1
                                        focus:outline-none focus:ring-2 focus:ring-[#F37022] focus:ring-offset-2"
                                >
                                    <div className="text-4xl mb-4">{role.icon}</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{role.title}</h3>
                                    <p className="text-gray-600 text-sm">{role.description}</p>
                                    <div className="absolute inset-0 rounded-2xl bg-[#F37022]/0 group-hover:bg-[#F37022]/5 
                                        transition-colors duration-300 pointer-events-none" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
