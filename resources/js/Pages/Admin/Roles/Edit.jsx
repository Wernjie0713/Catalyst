import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ auth, role, abilities = [], roleAbilities = [] }) {
    // Debug logging to see what we're receiving
    console.log('Role:', role);
    console.log('All Abilities:', abilities);
    console.log('Current Role Abilities:', roleAbilities);
    
    const { data, setData, put, processing, errors } = useForm({
        abilities: roleAbilities,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.roles.update', role.id));
    };

    const toggleAbility = (abilityName) => {
        const newAbilities = data.abilities.includes(abilityName)
            ? data.abilities.filter(name => name !== abilityName)
            : [...data.abilities, abilityName];
        
        setData('abilities', newAbilities);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Edit Role - ${role.title}`} />

            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Enhanced Header Section */}
                    <div className="mb-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-900 mb-3">Edit Role</h1>
                            <div className="flex items-center justify-center space-x-2 text-gray-600 text-lg mb-4">
                                <span>Modifying permissions for</span>
                                <span className="font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">{role.title}</span>
                            </div>
                            {/* Current Abilities Summary */}
                            <div className="bg-white rounded-xl p-4 border border-orange-200 max-w-2xl mx-auto">
                                <div className="flex items-center justify-center space-x-2 mb-2">
                                    <span className="text-sm font-medium text-gray-700">Currently Assigned:</span>
                                    <span className="text-sm font-bold text-orange-600">{roleAbilities.length} abilities</span>
                                </div>
                                {roleAbilities.length > 0 && (
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {roleAbilities.map((abilityName, index) => (
                                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                {abilityName}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white">
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">Role Permissions</h3>
                                </div>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="p-8">
                            <form onSubmit={handleSubmit}>
                                {/* Permissions Section */}
                                <div className="mb-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {abilities && abilities.length > 0 ? (
                                            abilities.map((ability) => {
                                                const isCurrentlyAssigned = roleAbilities.includes(ability.name);
                                                const isSelected = data.abilities.includes(ability.name);
                                                
                                                return (
                                                    <div key={ability.id} className={`bg-white rounded-xl p-4 border transition-all duration-200 ${
                                                        isCurrentlyAssigned 
                                                            ? 'border-orange-300 bg-orange-50' 
                                                            : 'border-gray-100 hover:border-orange-300'
                                                    }`}>
                                                        <div className="flex items-center space-x-3">
                                                            <input
                                                                type="checkbox"
                                                                id={`ability-${ability.id}`}
                                                                checked={isSelected}
                                                                onChange={() => toggleAbility(ability.name)}
                                                                className="w-5 h-5 rounded border-orange-300 text-orange-600 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 transition-all duration-200"
                                                            />
                                                            <label
                                                                htmlFor={`ability-${ability.id}`}
                                                                className={`text-sm font-medium cursor-pointer transition-colors duration-200 ${
                                                                    isCurrentlyAssigned ? 'text-orange-700' : 'text-gray-700 hover:text-orange-600'
                                                                }`}
                                                            >
                                                                {ability.title}
                                                            </label>
                                                        </div>
                                                        <div className="mt-2 flex items-center space-x-2">
                                                            {isCurrentlyAssigned && (
                                                                <div className="flex items-center space-x-1">
                                                                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                                                    <span className="text-xs text-orange-600 font-medium">Currently Assigned</span>
                                                                </div>
                                                            )}
                                                            {isSelected && !isCurrentlyAssigned && (
                                                                <div className="flex items-center space-x-1">
                                                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                                    <span className="text-xs text-green-600 font-medium">Will Be Added</span>
                                                                </div>
                                                            )}
                                                            {!isSelected && isCurrentlyAssigned && (
                                                                <div className="flex items-center space-x-1">
                                                                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                                                    <span className="text-xs text-red-600 font-medium">Will Be Removed</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="col-span-full text-center py-8">
                                                <div className="text-gray-500">
                                                    <div className="text-4xl mb-4">🔒</div>
                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Abilities Found</h3>
                                                    <p className="text-gray-600">There are no abilities available to assign to this role.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Error Display */}
                                {errors.abilities && (
                                    <div className="mb-6">
                                        <InputError message={errors.abilities} className="mt-2" />
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between pt-6 border-t border-orange-200">
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium">{data.abilities.length}</span> permissions selected
                                    </div>
                                    <div className="flex space-x-4">
                                        <a
                                            href={route('admin.roles.index')}
                                            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200"
                                        >
                                            Cancel
                                        </a>
                                        <PrimaryButton 
                                            disabled={processing}
                                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-orange-500 text-white font-medium rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg"
                                        >
                                            {processing ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Updating...
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Update Role
                                                </span>
                                            )}
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 