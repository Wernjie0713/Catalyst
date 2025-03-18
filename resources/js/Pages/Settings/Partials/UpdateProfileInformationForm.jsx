import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useState } from 'react';

export default function UpdateProfileInformationForm({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('settings.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-white">Profile Information</h2>
                <p className="mt-1 text-sm text-gray-400">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Name</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-700 bg-[#242031] text-white shadow-sm focus:border-[#635985] focus:ring-[#635985]"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        required
                    />
                    {errors.name && <div className="mt-2 text-sm text-red-400">{errors.name}</div>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300">Email</label>
                    <input
                        type="email"
                        className="mt-1 block w-full rounded-md border-gray-700 bg-[#242031] text-white shadow-sm focus:border-[#635985] focus:ring-[#635985]"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        required
                    />
                    {errors.email && <div className="mt-2 text-sm text-red-400">{errors.email}</div>}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-400">
                            Your email address is unverified.
                            <Link
                                href={route('settings.verification.send')}
                                method="post"
                                as="button"
                                className="underline text-sm text-[#635985] hover:text-[#635985]/80 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#635985]"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-[#635985] text-white rounded-md hover:bg-[#635985]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#635985] disabled:opacity-50"
                        disabled={processing}
                    >
                        Save
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-400">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
