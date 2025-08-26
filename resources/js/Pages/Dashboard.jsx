import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import TiltedEventCard from '@/Components/TiltedEventCard';
import Carousel from '@/Components/carousel';
import EventModal from '@/Components/EventModal';
import DisplayProfilePhoto from '@/Components/Profile/Common/DisplayProfilePhoto';
import SearchBar from '@/Components/SearchBar';
import TrueFocus from '@/Components/truefocus';

function DigitRoll({ digit, digitHeight = 36, duration = 1000, delay = 0 }) {
    const columnRef = useRef(null);
    useEffect(() => {
        const el = columnRef.current;
        if (!el) return;
        el.style.transition = 'none';
        el.style.transform = 'translateY(0px)';
        const id = requestAnimationFrame(() => {
            el.style.transition = `transform ${duration}ms cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms`;
            el.style.transform = `translateY(${-digit * digitHeight}px)`;
        });
        return () => cancelAnimationFrame(id);
    }, [digit, digitHeight, duration, delay]);

    return (
        <span style={{ overflow: 'hidden', height: `${digitHeight}px`, display: 'inline-block' }}>
            <span ref={columnRef} style={{ display: 'inline-block' }}>
                {[0,1,2,3,4,5,6,7,8,9].map((n) => (
                    <div key={n} style={{ height: `${digitHeight}px`, lineHeight: `${digitHeight}px` }}>{n}</div>
                ))}
            </span>
        </span>
    );
}

function RollingNumber({ value, className = '', digitHeight = 36 }) {
    const digits = String(Number(value) || 0).split('');
    return (
        <span className={className} style={{ display: 'inline-flex', alignItems: 'center' }}>
            {digits.map((d, idx) => (
                <DigitRoll key={`${idx}-${d}`} digit={Number(d)} digitHeight={digitHeight} delay={idx * 120} />
            ))}
        </span>
    );
}

export default function Dashboard() {
    const { auth, stats, recentEvents } = usePage().props;
    const [welcomeAnimation, setWelcomeAnimation] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [carouselWidth, setCarouselWidth] = useState(900);
    const [carouselScale, setCarouselScale] = useState(1);

    useEffect(() => {
        fetch('/images/animation/Welcome.json')
            .then((res) => res.json())
            .then((data) => setWelcomeAnimation(data))
            .catch(() => {});
    }, []);

    useEffect(() => {
        const updateCarouselSizing = () => {
            const maxWidth = 900;
            const viewport = typeof window !== 'undefined' ? window.innerWidth : maxWidth;
            const horizontalPadding = 32; // approximate page padding on mobile
            const computedWidth = Math.min(maxWidth, Math.max(280, viewport - horizontalPadding * 2));
            setCarouselWidth(computedWidth);
            setCarouselScale(computedWidth >= 768 ? 0.85 : 1);
        };
        updateCarouselSizing();
        window.addEventListener('resize', updateCarouselSizing);
        return () => window.removeEventListener('resize', updateCarouselSizing);
    }, []);

    const defaultProfileIcon = (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="material-symbols-outlined text-4xl">person</span>
        </div>
    );

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <motion.div 
                        className="mb-8"
                        style={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    {welcomeAnimation && (
                                        <Lottie
                                            animationData={welcomeAnimation}
                                            loop={false}
                                            autoplay={true}
                                            initialSegment={[0, Math.floor((welcomeAnimation?.op || 0) / 2)]}
                                            style={{ height: 70 }}
                                        />
                                    )}
                                    <p className="text-black text-xl font-semibold mt-8">to your {auth.user.roles[0]?.title} Dashboard</p>
                                </div>
                            </div>
                            
                            {/* Search Bar in right corner */}
                            <div className="hidden md:block w-72">
                                <SearchBar />
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                        style={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.7 }}
                    >
                        <div className="relative overflow-hidden bg-[#F37022] rounded-2xl p-6 border border-gray-200 hover: border-[#F37022] transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 group">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <span className="text-white text-lg font-semibold tracking-wide">Enrolled Events</span>
                                    <h3 className="text-3xl font-extrabold text-black">
                                        <RollingNumber value={stats?.enrolledEvents || 0} digitHeight={32} />
                                    </h3>
                                </div>
                                <div className="p-3 rounded-xl bg-white text-[#F37022] ring-1 ring-[#F37022]/20 group-hover:bg-white group-hover:ring-[#F37022]/30 group-hover:shadow-sm transition-all duration-300">
                                    <span className="material-symbols-outlined">how_to_reg</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-200 hover:border-orange-200 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 group">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <span className="text-[#F37022] text-lg font-semibold tracking-wide">Upcoming Events</span>
                                    <h3 className="text-3xl font-extrabold text-black">
                                        <RollingNumber value={stats?.upcomingEvents || 0} digitHeight={32} />
                                    </h3>
                                </div>
                                <div className="p-3 rounded-xl bg-[#F37022]/10 text-[#F37022] ring-1 ring-[#F37022]/20 group-hover:bg-[#F37022]/15 group-hover:ring-[#F37022]/30 group-hover:shadow-sm transition-all duration-300">
                                    <span className="material-symbols-outlined">upcoming</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-200 hover:border-orange-200 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 group">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <span className="text-[#F37022] text-lg font-semibold tracking-wide">My Events</span>
                                    <h3 className="text-3xl font-extrabold text-black">
                                        <RollingNumber value={stats?.myEvents || 0} digitHeight={32} />
                                    </h3>
                                </div>
                                <div className="p-3 rounded-xl bg-[#F37022]/10 text-[#F37022] ring-1 ring-[#F37022]/20 group-hover:bg-[#F37022]/15 group-hover:ring-[#F37022]/30 group-hover:shadow-sm transition-all duration-300">
                                    <span className="material-symbols-outlined">work_history</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-200 hover:border-orange-200 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 group">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <span className="text-[#F37022] text-lg font-semibold tracking-wide">Total Events</span>
                                    <h3 className="text-3xl font-extrabold text-black">
                                        <RollingNumber value={stats?.totalEvents || 0} digitHeight={32} />
                                    </h3>
                                </div>
                                <div className="p-3 rounded-xl bg-[#F37022]/10 text-[#F37022] ring-1 ring-[#F37022]/20 group-hover:bg-[#F37022]/15 group-hover:ring-[#F37022]/30 group-hover:shadow-sm transition-all duration-300">
                                    <span className="material-symbols-outlined">event_available</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Recent Events Section */}
                    <motion.div
                        className="mt-20"
                        style={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                    >
                        <motion.div 
                            className="flex items-center justify-center mb-2 px-4"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                                duration: 0.8, 
                                ease: "easeOut",
                                delay: 0.3 
                            }}
                        >
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight drop-shadow-sm text-center">
                                Recent Events
                            </h2>
                        </motion.div>
                        <div className="flex items-center justify-center mb-6">
                            <motion.a
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                href={route('events.index')}
                                className="text-[#F37022] hover:text-orange-600 transition-colors duration-200 flex items-center space-x-1"
                            >
                                <span>View All</span>
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </motion.a>
                        </div>

                        <div className="mt-4 flex justify-center px-2">
                            <div 
                                className="relative rounded-[16px] sm:rounded-[24px] p-4 sm:p-8"
                                style={{
                                    backgroundImage: 'url(/images/gradientTexture.jpg)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    transform: `scale(${carouselScale})`,
                                    transformOrigin: 'center',
                                }}
                            >
                                <Carousel
                                    baseWidth={carouselWidth}
                                    autoplay={true}
                                    pauseOnHover={true}
                                    loop={true}
                                    showImageOverlay={false}
                                    items={(() => {
                                        const fromEvents = (recentEvents || []).map(e => ({
                                            title: e.title,
                                            description: `${e.location} • ${new Date(e.date).toLocaleDateString()}`,
                                            id: e.event_id,
                                            icon: (<span className="h-[28px] w-[28px] rounded-full bg-[#F37022] inline-block" />),
                                            cover: e.cover_image ? `/${e.cover_image}` : '/default-event-image.jpg',
                                            _event: e,
                                        }));
                                        // Fallback to news images if no events
                                        if (fromEvents.length === 0) {
                                            return [
                                                { id: 'news-1', title: 'Latest News', description: 'Highlights', cover: '/images/news/ASEAN-AI-Malaysia-SUmmit-2025-scaled.jpg' },
                                                { id: 'news-2', title: 'AI Summit', description: 'Malaysia 2025', cover: '/images/news/MGF12082025-Anwar-Ai-SUMMIT-14.jpg' },
                                                { id: 'news-3', title: 'Catalyst', description: 'Updates', cover: '/images/news/1745232495368-9a3936fa-5a4c-43d0-8247-cf23eb8f986a.png' },
                                            ];
                                        }
                                        return fromEvents;
                                    })()}
                                    onItemClick={(item) => {
                                        if (item._event) {
                                            setSelectedEvent(item._event);
                                            setIsEventModalOpen(true);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <EventModal
                            event={selectedEvent}
                            isOpen={Boolean(isEventModalOpen && selectedEvent)}
                            onClose={() => setIsEventModalOpen(false)}
                            onEventUpdate={(updated) => setSelectedEvent(updated)}
                            auth={auth}
                        />
                    </motion.div>

                    {/* Friend suggestions moved to Friends page */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
