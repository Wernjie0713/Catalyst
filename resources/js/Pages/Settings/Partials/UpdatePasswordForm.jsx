import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setRecentlySuccessful(true);
                // Hide success message after 2 seconds
                setTimeout(() => {
                    setRecentlySuccessful(false);
                }, 2500);
            },
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Update Password
                </h2>
                <p className="text-gray-600 mb-6">
                    Ensure your account is using a long, random password to stay secure.
                </p>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                        </label>
                        <input
                            type="password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            className="w-full px-4 py-2.5 bg-orange-50 border border-orange-300 rounded-xl 
                                text-gray-800 placeholder-gray-500 focus:border-orange-500 focus:ring-1 
                                focus:ring-orange-500 transition-colors duration-200"
                        />
                        {errors.current_password && (
                            <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full px-4 py-2.5 bg-orange-50 border border-orange-300 rounded-xl 
                                text-gray-800 placeholder-gray-500 focus:border-orange-500 focus:ring-1 
                                focus:ring-orange-500 transition-colors duration-200"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="w-full px-4 py-2.5 bg-orange-50 border border-orange-300 rounded-xl 
                                text-gray-800 placeholder-gray-500 focus:border-orange-500 focus:ring-1 
                                focus:ring-orange-500 transition-colors duration-200"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={updatePassword}
                            className="px-6 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 
                                transform transition-all duration-200 hover:scale-[1.02]"
                            disabled={processing}
                        >
                            Save
                        </button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in-out duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="flex items-center gap-2 text-sm text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Password updated successfully
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>
        </section>
    );
}
