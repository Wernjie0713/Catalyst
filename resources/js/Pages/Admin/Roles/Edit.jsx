import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ auth, role, abilities, roleAbilities }) {
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
            <Head title={`Edit Role - ${role.name}`} />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg relative">
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold mb-6">Edit Role: {role.name}</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-4">Permissions</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {abilities.map((ability) => (
                                            <div key={ability.id} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`ability-${ability.id}`}
                                                    checked={data.abilities.includes(ability.name)}
                                                    onChange={() => toggleAbility(ability.name)}
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                />
                                                <label
                                                    htmlFor={`ability-${ability.id}`}
                                                    className="ml-2 text-sm text-gray-600"
                                                >
                                                    {ability.title}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <InputError message={errors.abilities} className="mt-2" />

                                <div className="flex items-center justify-end mt-6">
                                    <PrimaryButton disabled={processing}>
                                        Update Role
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 