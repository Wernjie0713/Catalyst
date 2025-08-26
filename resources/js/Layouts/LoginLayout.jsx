import LottieAnimation from '@/Components/LottieAnimation';

export default function LoginLayout({ children }) {
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-orange-50 to-orange-100 overflow-hidden">
            <div className="absolute left-4 top-4 w-40 h-40 md:w-52 md:h-52 pointer-events-none opacity-90">
                <LottieAnimation src="/images/animation/Paper%20plane.json" />
            </div>
            <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-md rounded-2xl border border-orange-200 shadow-lg relative z-10">
                {children}
            </div>
        </div>
    );
}


