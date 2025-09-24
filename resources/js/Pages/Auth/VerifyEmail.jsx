import { Head, Link, useForm } from '@inertiajs/react';
import SubmitButton from '@/Components/Auth/SubmitButton';
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import LoginLayout from '@/Layouts/LoginLayout';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <LoginLayout>
            <Head title="Email Verification" />

            {/* Logo */}
            <div className="text-center mb-8 animate-fade-in-up">
                <span className="text-2xl px-4 py-2 rounded-full 
                bg-black/30 border border-gray-700/50 
                text-white font-space font-bold tracking-wide">
                    KooQ
                </span>
            </div>

            {/* Header */}
            <div className="text-center mb-8 animate-fade-in-up-slow">
                <div className="mx-auto w-16 h-16 bg-[#8B7FD3]/20 rounded-full flex items-center justify-center mb-4">
                    <FaEnvelope className="text-[#8B7FD3] text-2xl" />
                </div>
                <h1 className="text-3xl font-outfit font-semibold mb-2 text-white tracking-tight">
                    Verify Your Email
                </h1>
                <p className="text-gray-400 mb-6 font-outfit max-w-md">
                    Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you?
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg animate-fade-in">
                    <div className="flex items-center text-green-400">
                        <FaCheckCircle className="mr-2" />
                        <span className="text-sm font-medium">
                            A new verification link has been sent to your email address!
                        </span>
                    </div>
                </div>
            )}

            <form onSubmit={submit} className="space-y-6 animate-fade-in-up-slower">
                <div className="text-center space-y-4">
                    <SubmitButton processing={processing}>
                        Resend Verification Email
                    </SubmitButton>

                    <div className="text-center">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                            className="text-gray-400 hover:text-gray-300 text-sm 
                            transition-colors duration-200 
                            hover:underline decoration-2 underline-offset-4"
                    >
                        Log Out
                    </Link>
                    </div>
                </div>
            </form>

            <div className="mt-8 text-center text-xs text-gray-500 animate-fade-in-up-slower">
                Didn't receive the email? Check your spam folder or try resending.
            </div>
        </LoginLayout>
    );
}
