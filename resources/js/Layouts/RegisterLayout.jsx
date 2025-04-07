import Aurora from '@/Components/Aurora';

export default function RegisterLayout({ children, image = '/images/jellyfish.jpg' }) {
    return (
        <div className="min-h-screen relative overflow-hidden bg-[#1e1b4b]">
            {/* Full page Aurora Background */}
            <div className="absolute inset-0 z-0">
                <Aurora 
                    colorStops={[
                        "#000000",
                        "#1E1B4B",
                        "#000000",
                        "#5E52F6"
                    ]}
                    amplitude={1.2}
                    blend={0.7}
                />
            </div>

            {/* Content Container */}
            <div className="min-h-screen flex relative z-10">
                {/* Left Side - Form */}
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        {children}
                    </div>
                </div>

                {/* Right Side - Image Container (Hidden on mobile) */}
                <div className="hidden md:flex w-1/2 p-8 items-center">
                    <div className="w-full h-[600px] rounded-2xl overflow-hidden 
                        bg-black/20 backdrop-blur-sm border border-white/10
                        animate-fade-in-up">
                        <img
                            src={image}
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
