import Aurora from '@/Components/Aurora';

export default function LoginAuroraLayout({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center relative bg-[#1e1b4b]">
            {/* Aurora Background */}
            <div className="absolute inset-0 z-0">
                <Aurora 
                    colorStops={[
                        "#000000",        // black
                        "#1E1B4B",        // deep purple/blue
                        "#000000",        // black
                        "#5E52F6"         // subtle purple glow
                    ]}
                    amplitude={1.2}
                    blend={0.7}
                />
            </div>

            {/* Content */}
            <div className="w-full max-w-md p-8 relative z-10 
                bg-black/40 backdrop-blur-md rounded-2xl
                border border-gray-800/50">
                {children}
            </div>
        </div>
    );
}
