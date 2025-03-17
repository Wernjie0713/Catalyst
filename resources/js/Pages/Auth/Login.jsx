import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import AuthInput from '@/Components/Auth/AuthInput';
import SocialButton from '@/Components/Auth/SocialButton';
import SubmitButton from '@/Components/Auth/SubmitButton';
import { FaApple, FaGoogle, FaEnvelope, FaLock } from 'react-icons/fa';
import LoginAuroraLayout from '@/Layouts/LoginAuroraLayout';

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
        <LoginAuroraLayout>
            <Head title="Log in" />

            {/* Logo */}
            <div className="text-center mb-8 animate-fade-in-up">
                <span className="text-2xl px-4 py-2 rounded-full 
                bg-black/30 border border-gray-700/50 
                text-white font-space font-bold tracking-wide">
                    Catalyst
                </span>
            </div>

            {/* Header */}
            <h1 className="text-3xl font-outfit font-semibold mb-2 text-white tracking-tight text-center
                animate-fade-in-up-slow">
                Welcome back
            </h1>
            <p className="text-gray-400 mb-8 font-outfit text-center animate-fade-in-up-slow">
                Please enter your details to sign in
            </p>

            {status && (
                <div className="mb-4 text-sm font-medium text-[#8B7FD3] text-center animate-fade-in">
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
                            className="rounded border-[#635985] bg-white/10 text-[#8B7FD3] 
                            focus:ring-[#8B7FD3] focus:ring-offset-0"
                        />
                        <span className="ms-2 text-sm text-gray-300">Remember me</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-[#8B7FD3] hover:text-[#9D93DD] text-sm 
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

                <div className="relative flex items-center gap-3 my-8">
                    <div className="h-[1px] flex-1 bg-gray-600/50"></div>
                    <span className="text-gray-300 text-sm">or continue with</span>
                    <div className="h-[1px] flex-1 bg-gray-600/50"></div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <SocialButton 
                        icon={<FaApple className="w-5 h-5" />}
                        className="bg-black/30 border-gray-700/50 hover:bg-black/40"
                    >
                        Apple
                    </SocialButton>
                    <SocialButton 
                        icon={<FaGoogle className="w-5 h-5" />}
                        className="bg-black/30 border-gray-700/50 hover:bg-black/40"
                    >
                        Google
                    </SocialButton>
                </div>

                <div className="text-center text-sm text-gray-300">
                    Don't have an account?{' '}
                    <Link
                        href={route('register')}
                        className="text-[#8B7FD3] hover:text-[#9D93DD] font-medium 
                        transition-colors duration-200 
                        hover:underline decoration-2 underline-offset-4"
                    >
                        Sign up
                    </Link>
                </div>
            </form>
        </LoginAuroraLayout>
    );
}
