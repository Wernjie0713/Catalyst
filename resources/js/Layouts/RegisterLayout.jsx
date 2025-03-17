import Aurora from '@/Components/Aurora';

export default function RegisterLayout({ children, image = '/images/register.jpg' }) {
    return (
        <div className="min-h-screen flex relative bg-[#18122B]">
            {/* Full page Aurora Background */}
            <div className="absolute inset-0 z-0 animate-fade-in">
                <Aurora 
                    colorStops={["#635985", "#443C68", "#393053"]}
                    amplitude={1.2}
                    blend={0.7}
                />
            </div>

            {/* Content Container */}
            <div className="min-h-screen flex fixed w-full relative z-10">
                {/* Left Side - Form */}
                <div className="w-1/2 p-8 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        {children}
                    </div>
                </div>

                {/* Right Side - Fixed Image Container */}
                <div className="w-1/2 fixed right-0 top-0 bottom-0 flex items-center p-8">
                    <div className="w-full h-[600px] rounded-2xl overflow-hidden 
                        bg-black/40 backdrop-blur-md border border-gray-800/50
                        animate-fade-in-up">
                        <img
                            src={image}
                            alt="Team collaboration"
                            className="w-full h-full object-cover opacity-90"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
