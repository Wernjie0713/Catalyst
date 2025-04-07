import { Head, router } from '@inertiajs/react';
import Aurora from '@/Components/Aurora';

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
        <div className="relative min-h-screen w-full bg-[#18122B] overflow-hidden">
            {/* Aurora Background */}
            <div className="absolute inset-0 w-full h-full">
                <Aurora 
                    colorStops={["#635985", "#443C68", "#393053"]}
                    amplitude={1.5}
                    blend={0.8}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <Head title="Select Your Role" />
                
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-white mb-4">Welcome to Catalyst</h2>
                        <p className="text-lg text-gray-300">Choose your role to get started</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {roles.slice(0, 3).map((role) => (
                            <button
                                key={role.name}
                                onClick={() => handleRoleSelect(role.name)}
                                className="group relative bg-[#2A2A3A]/30 backdrop-blur-sm p-6 rounded-2xl border border-[#635985]/30 
                                    hover:border-[#635985] transition-all duration-300 ease-in-out transform hover:-translate-y-1
                                    focus:outline-none focus:ring-2 focus:ring-[#635985] focus:ring-offset-2 focus:ring-offset-[#18122B]"
                            >
                                <div className="text-4xl mb-4">{role.icon}</div>
                                <h3 className="text-xl font-semibold text-white mb-2">{role.title}</h3>
                                <p className="text-gray-400 text-sm">{role.description}</p>
                                <div className="absolute inset-0 rounded-2xl bg-[#635985]/0 group-hover:bg-[#635985]/5 
                                    transition-colors duration-300 pointer-events-none" />
                            </button>
                        ))}
                        
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 md:max-w-2xl lg:mx-auto">
                            {roles.slice(3).map((role) => (
                                <button
                                    key={role.name}
                                    onClick={() => handleRoleSelect(role.name)}
                                    className="group relative bg-[#2A2A3A]/30 backdrop-blur-sm p-6 rounded-2xl border border-[#635985]/30 
                                        hover:border-[#635985] transition-all duration-300 ease-in-out transform hover:-translate-y-1
                                        focus:outline-none focus:ring-2 focus:ring-[#635985] focus:ring-offset-2 focus:ring-offset-[#18122B]"
                                >
                                    <div className="text-4xl mb-4">{role.icon}</div>
                                    <h3 className="text-xl font-semibold text-white mb-2">{role.title}</h3>
                                    <p className="text-gray-400 text-sm">{role.description}</p>
                                    <div className="absolute inset-0 rounded-2xl bg-[#635985]/0 group-hover:bg-[#635985]/5 
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
