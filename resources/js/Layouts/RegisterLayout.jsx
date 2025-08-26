import LottieAnimation from '@/Components/LottieAnimation';

export default function RegisterLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-orange-100 relative overflow-hidden">
            {/* Content Container */}
            <div className="min-h-screen flex">
                {/* Left Side - Form */}
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        {children}
                    </div>
                </div>

                {/* Right Side - Image Container (Hidden on mobile) */}
                <div className="hidden md:flex w-1/2 p-8 items-center">
                    <div className="w-full h-[640px] animate-fade-in-up flex items-center justify-center">
                        <LottieAnimation src="/images/animation/register.json" className="w-full h-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
