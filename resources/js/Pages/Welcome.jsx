import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Welcome({ auth }) {
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all cards
        const cards = document.querySelectorAll('.scroll-fade-up');
        cards.forEach(card => observer.observe(card));

        return () => observer.disconnect();
    }, []);
    return (
        <>
            <Head title="Welcome to Catalyst" />
            <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-orange-100 relative overflow-hidden overflow-x-hidden">
                {/* Enhanced Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Floating orbs with gentle animations */}
                    <div className="hidden sm:block absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-blue-300/30 rounded-full blur-3xl animate-float"></div>
                    <div className="hidden sm:block absolute top-40 right-32 w-96 h-96 bg-gradient-to-bl from-orange-200/30 to-orange-300/30 rounded-full blur-3xl animate-float-delayed"></div>
                    <div className="hidden sm:block absolute bottom-40 left-1/3 w-72 h-72 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-float-slow"></div>
                    <div className="hidden sm:block absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-tl from-orange-200/30 to-yellow-200/30 rounded-full blur-3xl animate-float-fast"></div>
                    
                    {/* Subtle gradient overlays */}
                    <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/20 to-transparent animate-pulse"></div>
                    <div className="hidden sm:block absolute inset-0 bg-gradient-to-b from-transparent via-orange-50/20 to-transparent animate-pulse delay-1000"></div>
                    
                    {/* Floating particles */}
                    <div className="hidden sm:block absolute top-1/4 left-1/4 w-2 h-2 bg-blue-300/40 rounded-full animate-ping"></div>
                    <div className="hidden sm:block absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-orange-300/40 rounded-full animate-ping delay-500"></div>
                    <div className="hidden sm:block absolute bottom-1/3 left-1/2 w-1 h-1 bg-blue-400/40 rounded-full animate-ping delay-1000"></div>
                    <div className="hidden sm:block absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-orange-400/40 rounded-full animate-ping delay-1500"></div>
                </div>

                {/* Enhanced Header with better styling */}
                <header className="absolute top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 border-b border-orange-200/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex justify-between items-center">
                            {/* Enhanced Logo with animation */}
                            <div className="flex items-center group">
                                <img 
                                    src="/images/Catalyst.png" 
                                    alt="Catalyst Logo" 
                                    className="h-12 w-auto transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                            
                            {/* Enhanced Auth Buttons */}
                            <nav className="flex space-x-2 sm:space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#F37022] to-orange-500 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-semibold text-[#F37022] bg-white hover:bg-orange-50 transition-all duration-300 border-2 border-[#F37022] hover:border-orange-600 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#F37022] to-orange-500 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                            </svg>
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Enhanced Main Content */}
                <main className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        {/* Enhanced Hero Section */}
                        <div className="text-center mb-12 sm:mb-20">
                            <div className="inline-block mb-6">
                                <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-4 sm:mb-6 animate-fade-in-up text-[#F37022] leading-tight">
                                    Catalyst
                                </h1>
                            </div>
                            <p className="hidden sm:block text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 leading-relaxed px-2">
                                <span className="typing-animation">
                                    Empowering Students to Become 
                                    <span className="text-[#F37022]"> Successful Technopreneurs</span>
                                </span>
                            </p>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
                                <span className="fade-up-after-typing">
                                    Launch your startup, join professional programs, or become a successful freelancer. 
                                    Join thousands of students who have already transformed their careers.
                                </span>
                            </p>
                            
                            {/* Enhanced CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center fade-up-after-typing px-4">
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold text-white bg-gradient-to-r from-[#F37022] to-orange-500 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 jumping-button"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Start Your Journey
                                </Link>
                            </div>
                        </div>

                        {/* Paper Plane Animation */}
                        <div className="relative h-32 mb-16">
                            <div className="paper-plane">
                                <svg fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                </svg>
                            </div>
                        </div>

                        {/* Enhanced Cards Section */}
                        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto px-4 sm:px-0">
                            {/* Card 1 - Professional Programs */}
                            <div className="group relative scroll-fade-up flex flex-col">
                                {/* Glowing border effect */}
                                <div className="absolute -inset-[3px] bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 
                                    rounded-3xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-700"></div>

                                <div className="relative bg-white/80 backdrop-blur-md p-6 sm:p-10 rounded-3xl shadow-2xl hover:shadow-gray-500/25
                                    border border-gray-200/50 hover:border-gray-300/80 
                                    transition-all duration-700 animate-fade-in-up animation-delay-400
                                    hover:transform hover:scale-[1.03] hover:-translate-y-3 flex-1 flex flex-col">
                                    
                                    {/* Enhanced Icon with glassmorphism */}
                                    <div className="mb-6 sm:mb-10 p-6 sm:p-8 w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-gray-100/80 to-gray-200/80 
                                        backdrop-blur-sm border border-gray-200/50
                                        group-hover:from-gray-200/90 group-hover:to-gray-300/90 transition-all duration-500
                                        group-hover:rotate-12 group-hover:scale-110 group-hover:shadow-lg flex-shrink-0">
                                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 transform transition-all duration-500 
                                            group-hover:scale-110 group-hover:text-gray-700" 
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 
                                        transition-colors duration-300 group-hover:text-gray-600">
                                        Professional Programs
                                    </h2>
                                    <p className="text-gray-600 mb-10 transition-colors duration-300 
                                        group-hover:text-gray-700 leading-relaxed text-sm flex-1">
                                        Access industry-led training programs and certifications for career growth. 
                                        Learn from experts and get certified in high-demand skills.
                                    </p>

                                    {/* Enhanced Link with glassmorphism */}
                                    <Link 
                                        href={route('register')} 
                                        className="inline-flex items-center px-5 py-3 rounded-2xl text-gray-600 hover:text-white
                                            bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-500 hover:to-gray-600
                                            transition-all duration-500 group-hover:translate-x-2 font-semibold shadow-lg hover:shadow-xl
                                            border border-gray-200/50 hover:border-gray-500 mt-auto"
                                    >
                                        <span>Start building</span>
                                        <svg className="w-5 h-5 ml-2 transition-transform duration-500 
                                            group-hover:translate-x-1" 
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>

                            {/* Card 2 - Startup Journey */}
                            <div className="group relative scroll-fade-up flex flex-col">
                                {/* Glowing border effect */}
                                <div className="absolute -inset-[3px] bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 
                                    rounded-3xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-700"></div>

                                <div className="relative bg-white/80 backdrop-blur-md p-6 sm:p-10 rounded-3xl shadow-2xl hover:shadow-blue-500/25
                                    border border-blue-200/50 hover:border-blue-300/80 
                                    transition-all duration-700 animate-fade-in-up animation-delay-500
                                    hover:transform hover:scale-[1.03] hover:-translate-y-3 flex-1 flex flex-col">
                                    
                                    {/* Enhanced Icon with glassmorphism */}
                                    <div className="mb-6 sm:mb-10 p-6 sm:p-8 w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-blue-100/80 to-blue-200/80 
                                        backdrop-blur-sm border border-blue-200/50
                                        group-hover:from-blue-200/90 group-hover:to-blue-300/90 transition-all duration-500
                                        group-hover:rotate-12 group-hover:scale-110 group-hover:shadow-lg flex-shrink-0">
                                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 transform transition-all duration-500 
                                            group-hover:scale-110 group-hover:text-blue-700" 
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 
                                        transition-colors duration-300 group-hover:text-blue-600">
                                        Startup Journey
                                    </h2>
                                    <p className="text-gray-600 mb-10 transition-colors duration-300 
                                        group-hover:text-gray-700 leading-relaxed text-sm flex-1">
                                        Get the skills, resources, and mentorship needed to launch and grow your startup. 
                                        From ideation to market launch, we've got you covered.
                                    </p>

                                    {/* Enhanced Link with glassmorphism */}
                                    <Link 
                                        href={route('register')} 
                                        className="inline-flex items-center px-5 py-3 rounded-2xl text-blue-600 hover:text-white
                                            bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-500 hover:to-blue-600
                                            transition-all duration-500 group-hover:translate-x-2 font-semibold shadow-lg hover:shadow-xl
                                            border border-blue-200/50 hover:border-blue-500 mt-auto"
                                    >
                                        <span>Explore programs</span>
                                        <svg className="w-5 h-5 ml-2 transition-transform duration-500 
                                            group-hover:translate-x-1" 
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>

                            {/* Card 3 - Freelance Success */}
                            <div className="group relative scroll-fade-up flex flex-col">
                                {/* Glowing border effect */}
                                <div className="absolute -inset-[3px] bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 
                                    rounded-3xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-700"></div>

                                <div className="relative bg-white/80 backdrop-blur-md p-6 sm:p-10 rounded-3xl shadow-2xl hover:shadow-gray-500/25
                                    border border-gray-200/50 hover:border-gray-300/80 
                                    transition-all duration-700 animate-fade-in-up animation-delay-600
                                    hover:transform hover:scale-[1.03] hover:-translate-y-3 flex-1 flex flex-col">
                                    
                                    {/* Enhanced Icon with glassmorphism */}
                                    <div className="mb-6 sm:mb-10 p-6 sm:p-8 w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-gray-100/80 to-gray-200/80 
                                        backdrop-blur-sm border border-gray-200/50
                                        group-hover:from-gray-200/90 group-hover:to-gray-300/90 transition-all duration-500
                                        group-hover:rotate-12 group-hover:scale-110 group-hover:shadow-lg flex-shrink-0">
                                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 transform transition-all duration-500 
                                            group-hover:scale-110 group-hover:text-gray-700" 
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 
                                        transition-colors duration-300 group-hover:text-gray-600">
                                        Freelance Success
                                    </h2>
                                    <p className="text-gray-600 mb-10 transition-colors duration-300 
                                        group-hover:text-gray-700 leading-relaxed text-sm flex-1">
                                        Develop your skills and build your portfolio to thrive in the freelance market. 
                                        Connect with clients and build a successful freelance career.
                                    </p>

                                    {/* Enhanced Link with glassmorphism */}
                                    <Link 
                                        href={route('register')} 
                                        className="inline-flex items-center px-5 py-3 rounded-2xl text-gray-600 hover:text-white
                                            bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-500 hover:to-gray-600
                                            transition-all duration-500 group-hover:translate-x-2 font-semibold shadow-xl hover:shadow-2xl
                                            border border-gray-200/50 hover:border-gray-500 mt-auto"
                                    >
                                        <span>Begin journey</span>
                                        <svg className="w-5 h-5 ml-2 transition-transform duration-500 
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

                {/* Enhanced Footer */}
                <footer className="relative z-10 py-12 mt-20 border-t border-orange-200/50 bg-gradient-to-b from-orange-100/80 to-orange-200/80">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                <p className="text-sm text-gray-600">© {new Date().getFullYear()} Catalyst. All rights reserved.</p>
                            </div>
                            <div className="flex space-x-6">
                                <a href="#" className="text-sm text-gray-600 hover:text-[#F37022] transition-colors duration-200">Privacy Policy</a>
                                <a href="#" className="text-sm text-gray-600 hover:text-[#F37022] transition-colors duration-200">Terms of Service</a>
                                <a href="#" className="text-sm text-gray-600 hover:text-[#F37022] transition-colors duration-200">Contact</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}