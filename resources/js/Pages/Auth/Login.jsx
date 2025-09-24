import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import AuthInput from '@/Components/Auth/AuthInput';
import SubmitButton from '@/Components/Auth/SubmitButton';
import { FaApple, FaGoogle, FaEnvelope, FaLock } from 'react-icons/fa';
import LoginLayout from '@/Layouts/LoginLayout';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <LoginLayout>
            <Head title="Log in" />

            {/* Logo */}
            <div className="text-center mb-8 animate-fade-in-up">
                <span className="text-2xl px-4 py-2 rounded-full 
                bg-orange-50 border border-orange-200 
                text-[#F37022] font-space font-bold tracking-wide">
                    KooQ
                </span>
            </div>

            {/* Header */}
            <h1 className="text-3xl font-outfit font-semibold mb-2 text-gray-900 tracking-tight text-center
                animate-fade-in-up-slow">
                Welcome back
            </h1>
            <p className="text-gray-600 mb-8 font-outfit text-center animate-fade-in-up-slow">
                Please enter your details to sign in
            </p>

            {status && (
                <div className="mb-4 text-sm font-medium text-[#F37022] text-center animate-fade-in">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6 animate-fade-in-up-slower">
                <div>
                    <AuthInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="Email"
                        icon={<FaEnvelope />}
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <AuthInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="Password"
                        icon={<FaLock />}
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-orange-300 bg-white text-[#F37022] 
                            focus:ring-[#F37022] focus:ring-offset-0"
                        />
                        <span className="ms-2 text-sm text-gray-600">Remember me</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-[#F37022] hover:text-[#e3641a] text-sm 
                            transition-colors duration-200 
                            hover:underline decoration-2 underline-offset-4"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <SubmitButton processing={processing}>
                    Sign in
                </SubmitButton>

                <div className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link
                        href={route('register')}
                        className="text-[#F37022] hover:text-[#e3641a] font-medium 
                        transition-colors duration-200 
                        hover:underline decoration-2 underline-offset-4"
                    >
                        Sign up
                    </Link>
                </div>
            </form>
        </LoginLayout>
    );
}
