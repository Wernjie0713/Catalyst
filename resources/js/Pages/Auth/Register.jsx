import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import AuthInput from '@/Components/Auth/AuthInput';
import SubmitButton from '@/Components/Auth/SubmitButton';
import { FaApple, FaGoogle, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import RegisterLayout from '@/Layouts/RegisterLayout';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <RegisterLayout>
            <Head title="Register" />

            <div className="w-full max-w-md mx-auto">
                {/* Logo */}
                <div className="mb-8 animate-fade-in-up">
                    <span className="text-2xl px-4 py-2 rounded-full 
                    bg-orange-50 border border-orange-200 
                    text-[#F37022] font-space font-bold tracking-wide">
                        Catalyst
                    </span>
                </div>

                {/* Header */}
                <h1 className="text-3xl font-outfit font-semibold mb-2 text-gray-900 tracking-tight
                    animate-fade-in-up-slow">
                    Create an account
                </h1>
                <p className="text-gray-600 mb-8 font-outfit animate-fade-in-up-slow">
                    Please enter your details to register
                </p>

                {/* Form content */}
                <form onSubmit={submit} className="space-y-6 animate-fade-in-up-slower">
                    <div>
                        <AuthInput
                            type="text"
                            placeholder="Full name"
                            value={data.name}
                            icon={<FaUser />}
                            error={errors.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <AuthInput
                            type="email"
                            placeholder="Email"
                            value={data.email}
                            icon={<FaEnvelope />}
                            error={errors.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <AuthInput
                            type="password"
                            placeholder="Password"
                            value={data.password}
                            icon={<FaLock />}
                            error={errors.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <AuthInput
                            type="password"
                            placeholder="Confirm Password"
                            value={data.password_confirmation}
                            icon={<FaLock />}
                            error={errors.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    <SubmitButton processing={processing}>
                        Submit
                    </SubmitButton>
                    <div className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            href={route('login')}
                            className="text-[#F37022] hover:text-[#e3641a] font-medium 
                            transition-colors duration-200 
                            hover:underline decoration-2 underline-offset-4"
                        >
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </RegisterLayout>
    );
}
