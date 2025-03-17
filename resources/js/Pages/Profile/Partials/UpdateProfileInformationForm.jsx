import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                    Profile Information
                </h2>
                <p className="text-gray-400 mb-6">
                    Update your account's profile information and email address.
                </p>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2.5 bg-[#242031] border border-gray-800 rounded-xl 
                                text-white placeholder-gray-400 focus:border-[#8B7FD3] focus:ring-1 
                                focus:ring-[#8B7FD3] transition-colors duration-200"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-2.5 bg-[#242031] border border-gray-800 rounded-xl 
                                text-white placeholder-gray-400 focus:border-[#8B7FD3] focus:ring-1 
                                focus:ring-[#8B7FD3] transition-colors duration-200"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            onClick={submit}
                            className="px-6 py-2.5 bg-[#8B7FD3] text-white rounded-xl hover:bg-[#9D93DD] 
                                transform transition-all duration-200 hover:scale-[1.02]"
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
                            <p className="text-sm text-gray-400">
                                Saved.
                            </p>
                        </Transition>
                    </div>
                </div>
            </div>

            {mustVerifyEmail && user.email_verified_at === null && (
                <div className="mt-4">
                    <p className="text-sm text-gray-400">
                        Your email address is unverified.
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="ml-2 text-[#8B7FD3] hover:text-[#9D93DD] underline focus:outline-none"
                        >
                            Click here to re-send the verification email.
                        </Link>
                    </p>

                    {status === 'verification-link-sent' && (
                        <div className="mt-2 text-sm font-medium text-green-400">
                            A new verification link has been sent to your email address.
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
