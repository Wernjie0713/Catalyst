import Aurora from '@/Components/Aurora';

export default function LoginAuroraLayout({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center relative bg-[#18122B]">
            {/* Aurora Background */}
            <div className="absolute inset-0 z-0">
                <Aurora 
                    colorStops={["#635985", "#443C68", "#393053"]}
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
