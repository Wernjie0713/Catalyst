import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome to Catalyst" />
            <div className="min-h-screen bg-gradient-to-b from-black via-[#1e1b4b] to-black relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-600/20 to-transparent rounded-full blur-3xl animate-spin-slow"></div>
                    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-600/20 to-transparent rounded-full blur-3xl animate-spin-slow-reverse"></div>
                </div>

                {/* Header - Keeping original buttons */}
                <header className="absolute top-0 left-0 right-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="flex justify-between items-center">
                            {/* Original Logo */}
                            <div className="flex items-center">
                                <img 
                                    src="/images/Catalyst.png" 
                                    alt="Catalyst Logo" 
                                    className="h-12 w-auto"
                                />
                            </div>
                            
                            {/* Original Auth Buttons */}
                            <nav className="flex space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 border border-white/10 hover:border-white/20"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 border border-white/10 hover:border-white/20"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-200"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                        </div>
                    </div>
                </header>

                {/* Main Content - New Design */}
                <main className="relative pt-32 pb-16 z-10">
                    <div className="max-w-7xl mx-auto px-6">
                        {/* Hero Section */}
                        <div className="text-center mb-16">
                            <h1 className="text-7xl font-bold mb-6 animate-fade-in-up bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-300 to-blue-300">
                                Catalyst
                            </h1>
                            <p className="text-2xl text-gray-300 mb-6 animate-fade-in-up animation-delay-200">
                                Empowering Students to Become Successful Technopreneurs
                            </p>
                            <p className="text-lg text-gray-400 max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
                                Launch your startup, join professional programs, or become a successful freelancer
                            </p>
                        </div>

                        {/* Cards Section - Enhanced but keeping your content */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* Card 1 - Startup Journey */}
                            <div className="group relative">
                                {/* Animated gradient border */}
                                <div className="absolute -inset-[2px] bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 
                                    rounded-2xl opacity-0 group-hover:opacity-100 blur-md transition-all duration-500"></div>

                                <div className="relative bg-[#24225a]/50 backdrop-blur-sm p-8 rounded-2xl 
                                    border border-purple-500/20 hover:border-purple-500/40 
                                    transition-all duration-500 animate-fade-in-up animation-delay-400
                                    hover:transform hover:scale-[1.02] hover:-translate-y-1">
                                    
                                    {/* Icon - keeping your original but adding animation */}
                                    <div className="mb-4 p-3 w-14 h-14 rounded-lg bg-purple-500/10 
                                        group-hover:bg-purple-500/20 transition-all duration-300
                                        group-hover:rotate-6">
                                        <svg className="w-8 h-8 text-purple-400 transform transition-all duration-300 
                                            group-hover:scale-110 group-hover:text-purple-300" 
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>

                                    {/* Text content - keeping your original content */}
                                    <h2 className="text-2xl font-semibold text-blue-400 mb-4 
                                        transition-colors duration-300 group-hover:text-purple-300">
                                        Startup Journey
                                    </h2>
                                    <p className="text-gray-400 mb-4 transition-colors duration-300 
                                        group-hover:text-gray-300">
                                        Get the skills, resources, and mentorship needed to launch and grow your startup
                                    </p>

                                    {/* Link - enhanced but keeping your structure */}
                                    <Link 
                                        href={route('register')} 
                                        className="inline-flex items-center text-blue-400 hover:text-blue-300 
                                            transition-all duration-300 group-hover:translate-x-1"
                                    >
                                        <span className="relative">
                                            Start building
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 
                                                transition-all duration-300 group-hover:w-full"></span>
                                        </span>
                                        <svg className="w-4 h-4 ml-2 transition-transform duration-300 
                                            group-hover:translate-x-1" 
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>

                            {/* Card 2 - Professional Programs */}
                            <div className="group relative">
                                <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 
                                    rounded-2xl opacity-0 group-hover:opacity-100 blur-md transition-all duration-500"></div>

                                <div className="relative bg-[#24225a]/50 backdrop-blur-sm p-8 rounded-2xl 
                                    border border-purple-500/20 hover:border-purple-500/40 
                                    transition-all duration-500 animate-fade-in-up animation-delay-500
                                    hover:transform hover:scale-[1.02] hover:-translate-y-1">
                                    {/* Icon - keeping your original but adding animation */}
                                    <div className="mb-4 p-3 w-14 h-14 rounded-lg bg-blue-500/10 
                                        group-hover:bg-blue-500/20 transition-all duration-300
                                        group-hover:rotate-6">
                                        <svg className="w-8 h-8 text-blue-400 transform transition-all duration-300 
                                            group-hover:scale-110 group-hover:text-blue-300" 
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>

                                    {/* Text content - keeping your original content */}
                                    <h2 className="text-2xl font-semibold text-blue-400 mb-4 
                                        transition-colors duration-300 group-hover:text-purple-300">
                                        Professional Programs
                                    </h2>
                                    <p className="text-gray-400 mb-4 transition-colors duration-300 
                                        group-hover:text-gray-300">
                                        Access industry-led training programs and certifications for career growth
                                    </p>

                                    {/* Link - enhanced but keeping your structure */}
                                    <Link 
                                        href={route('register')} 
                                        className="inline-flex items-center text-blue-400 hover:text-blue-300 
                                            transition-all duration-300 group-hover:translate-x-1"
                                    >
                                        <span className="relative">
                                            Explore programs
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 
                                                transition-all duration-300 group-hover:w-full"></span>
                                        </span>
                                        <svg className="w-4 h-4 ml-2 transition-transform duration-300 
                                            group-hover:translate-x-1" 
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>

                            {/* Card 3 - Freelance Success */}
                            <div className="group relative">
                                <div className="absolute -inset-[2px] bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 
                                    rounded-2xl opacity-0 group-hover:opacity-100 blur-md transition-all duration-500"></div>

                                <div className="relative bg-[#24225a]/50 backdrop-blur-sm p-8 rounded-2xl 
                                    border border-purple-500/20 hover:border-purple-500/40 
                                    transition-all duration-500 animate-fade-in-up animation-delay-600
                                    hover:transform hover:scale-[1.02] hover:-translate-y-1">
                                    {/* Icon - keeping your original but adding animation */}
                                    <div className="mb-4 p-3 w-14 h-14 rounded-lg bg-indigo-500/10 
                                        group-hover:bg-indigo-500/20 transition-all duration-300
                                        group-hover:rotate-6">
                                        <svg className="w-8 h-8 text-indigo-400 transform transition-all duration-300 
                                            group-hover:scale-110 group-hover:text-indigo-300" 
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>

                                    {/* Text content - keeping your original content */}
                                    <h2 className="text-2xl font-semibold text-indigo-400 mb-4 
                                        transition-colors duration-300 group-hover:text-purple-300">
                                        Freelance Success
                                    </h2>
                                    <p className="text-gray-400 mb-4 transition-colors duration-300 
                                        group-hover:text-gray-300">
                                        Develop your skills and build your portfolio to thrive in the freelance market
                                    </p>

                                    {/* Link - enhanced but keeping your structure */}
                                    <Link 
                                        href={route('register')} 
                                        className="inline-flex items-center text-indigo-400 hover:text-indigo-300 
                                            transition-all duration-300 group-hover:translate-x-1"
                                    >
                                        <span className="relative">
                                            Begin journey
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 
                                                transition-all duration-300 group-hover:w-full"></span>
                                        </span>
                                        <svg className="w-4 h-4 ml-2 transition-transform duration-300 
                                            group-hover:translate-x-1" 
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="relative z-10 py-8 mt-16 border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                <img 
                                    src="/images/Catalyst.png" 
                                    alt="Catalyst Logo" 
                                    className="h-6 w-auto"
                                />
                                <p className="text-sm text-gray-400">© {new Date().getFullYear()} Catalyst. All rights reserved.</p>
                            </div>
                            <div className="flex space-x-6">
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a>
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a>
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Contact</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
