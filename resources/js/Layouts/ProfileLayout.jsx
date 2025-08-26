import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import UpdateProfilePhoto from '@/Components/Profile/Common/UpdateProfilePhoto';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileLayout({ user, children, activeTab, onTabChange, components }) {
    // Check if user has only profile tab
    const hasOnlyProfileTab = !components?.Teams && 
                            !components?.Certificates && 
                            !components?.Badges;

    const tabs = [
        { name: 'Profiles', key: 'profiles', icon: 'person' },
        components?.Teams && { name: 'Teams', key: 'teams', icon: 'groups' },
        components?.Certificates && { name: 'Certificates', key: 'certificates', icon: 'workspace_premium' },
        components?.Badges && { name: 'Badges', key: 'badges', icon: 'emoji_events' }
    ].filter(Boolean);

    // Enhanced animation variants
    const pageVariants = {
        initial: { opacity: 0 },
        animate: { 
            opacity: 1,
            transition: { 
                duration: 0.6,
                when: "beforeChildren",
                staggerChildren: 0.15
            }
        }
    };

    const tabsContainerVariants = {
        initial: { opacity: 0, y: -30, scale: 0.95 },
        animate: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: { 
                duration: 0.7,
                ease: "easeOut",
                type: "spring",
                stiffness: 100
            }
        }
    };

    const contentVariants = {
        initial: { opacity: 0, y: 30, scale: 0.98 },
        animate: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: { 
                delay: 0.3, 
                duration: 0.6,
                ease: "easeOut",
                type: "spring",
                stiffness: 80
            }
        }
    };

    const tabVariants = {
        inactive: { 
            opacity: 0.8,
            scale: 1,
            y: 0
        },
        active: { 
            opacity: 1,
            scale: 1.05,
            y: -2,
            transition: { 
                duration: 0.4,
                type: "spring",
                stiffness: 300
            }
        },
        hover: { 
            opacity: 1, 
            scale: 1.08,
            y: -3,
            transition: { 
                duration: 0.2,
                type: "spring",
                stiffness: 400
            }
        },
        tap: { 
            scale: 0.95, 
            y: 0,
            transition: { 
                duration: 0.1,
                type: "spring",
                stiffness: 500
            }
        }
    };

    const iconVariants = {
        initial: { rotate: 0, scale: 1 },
        animate: { 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
            transition: { 
                duration: 0.6,
                ease: "easeInOut"
            }
        },
        hover: { 
            rotate: [0, 15, -15, 0],
            scale: 1.2,
            transition: { 
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    // Skeleton loading animation
    const skeletonVariants = {
        initial: { opacity: 0.3 },
        animate: { 
            opacity: [0.3, 0.7, 0.3],
            transition: { 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    // Loading state for tab switching
    const [isLoading, setIsLoading] = useState(false);

    const handleTabChange = (newTab) => {
        if (newTab === activeTab) return;
        
        setIsLoading(true);
        onTabChange(newTab);
        
        // Simulate instant loading perception
        setTimeout(() => {
            setIsLoading(false);
        }, 100);
    };

    // Skeleton Loading Component
    const SkeletonLoader = () => (
        <div className="space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-6 border border-orange-100">
                <div className="flex items-center gap-6">
                    <motion.div 
                        className="w-24 h-24 bg-orange-200 rounded-full"
                        variants={skeletonVariants}
                        initial="initial"
                        animate="animate"
                    />
                    <div className="flex-1 space-y-4">
                        <motion.div 
                            className="h-8 bg-orange-200 rounded-lg w-3/4"
                            variants={skeletonVariants}
                            initial="initial"
                            animate="animate"
                        />
                        <motion.div 
                            className="h-4 bg-orange-200 rounded w-1/2"
                            variants={skeletonVariants}
                            initial="initial"
                            animate="animate"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <motion.div 
                                    key={i}
                                    className="h-6 bg-orange-200 rounded w-full"
                                    variants={skeletonVariants}
                                    initial="initial"
                                    animate="animate"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <motion.div 
                        key={i}
                        className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-6 border border-orange-100"
                        variants={skeletonVariants}
                        initial="initial"
                        animate="animate"
                    >
                        <div className="space-y-4">
                            <motion.div 
                                className="h-6 bg-orange-200 rounded w-3/4"
                                variants={skeletonVariants}
                                initial="initial"
                                animate="animate"
                            />
                            {[1, 2, 3].map((j) => (
                                <motion.div 
                                    key={j}
                                    className="space-y-2"
                                    variants={skeletonVariants}
                                    initial="initial"
                                    animate="animate"
                                >
                                    <div className="h-3 bg-orange-200 rounded w-1/2" />
                                    <div className="h-4 bg-orange-200 rounded w-full" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout user={user}>
            <Head title="Profile" />

            <motion.div 
                className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-white"
                initial="initial"
                animate="animate"
                variants={pageVariants}
            >
                <div className="relative">
                    {/* Main Content */}
                    <div className="relative max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6">
                        {/* Enhanced Navigation Tabs - Only show if there are multiple tabs */}
                        {!hasOnlyProfileTab && (
                            <motion.div 
                                className="flex justify-center mb-6 sm:mb-8 overflow-x-auto"
                                variants={tabsContainerVariants}
                            >
                                <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-2xl border border-orange-200/50 w-full max-w-[95vw] sm:max-w-fit overflow-hidden">
                                    {/* Animated background gradient */}
                                    <motion.div 
                                        className="absolute inset-0 bg-gradient-to-r from-orange-50/50 via-white to-orange-50/50"
                                        animate={{
                                            background: [
                                                "linear-gradient(90deg, rgba(254, 215, 170, 0.3) 0%, rgba(255, 255, 255, 1) 50%, rgba(254, 215, 170, 0.3) 100%)",
                                                "linear-gradient(90deg, rgba(254, 215, 170, 0.1) 0%, rgba(255, 255, 255, 1) 50%, rgba(254, 215, 170, 0.1) 100%)",
                                                "linear-gradient(90deg, rgba(254, 215, 170, 0.3) 0%, rgba(255, 255, 255, 1) 50%, rgba(254, 215, 170, 0.3) 100%)"
                                            ]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                    
                                    <nav className="relative flex gap-2 min-w-full sm:min-w-0">
                                        {tabs.map((tab, index) => (
                                            <motion.button
                                                key={tab.key}
                                                onClick={() => handleTabChange(tab.key)}
                                                className={`
                                                    relative flex items-center gap-2 flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-xl text-sm font-semibold
                                                    whitespace-nowrap transition-all duration-300 overflow-hidden
                                                    ${activeTab === tab.key 
                                                        ? 'text-white shadow-lg' 
                                                        : 'text-gray-600 hover:text-orange-600'}
                                                `}
                                                variants={tabVariants}
                                                initial="inactive"
                                                animate={activeTab === tab.key ? "active" : "inactive"}
                                                whileHover="hover"
                                                whileTap="tap"
                                                custom={index}
                                            >
                                                {/* Active tab background with animated gradient */}
                                                {activeTab === tab.key && (
                                                    <motion.div
                                                        className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 rounded-xl"
                                                        layoutId="activeTabBackground"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.4 }}
                                                    />
                                                )}
                                                
                                                {/* Hover effect background */}
                                                {activeTab !== tab.key && (
                                                    <motion.div
                                                        className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-orange-200/50 rounded-xl"
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        whileHover={{ opacity: 1, scale: 1 }}
                                                        transition={{ duration: 0.2 }}
                                                    />
                                                )}
                                                
                                                {/* Content */}
                                                <motion.span 
                                                    className="relative z-10 material-symbols-outlined text-lg"
                                                    variants={iconVariants}
                                                    initial="initial"
                                                    animate={activeTab === tab.key ? "animate" : "initial"}
                                                    whileHover="hover"
                                                >
                                                    {tab.icon}
                                                </motion.span>
                                                <span className="relative z-10">{tab.name}</span>
                                                
                                                {/* Active indicator with glow effect */}
                                                {activeTab === tab.key && (
                                                    <motion.div
                                                        className="absolute inset-0 rounded-xl ring-2 ring-orange-300/50 ring-offset-2 ring-offset-white"
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ duration: 0.4 }}
                                                    />
                                                )}
                                            </motion.button>
                                        ))}
                                    </nav>
                                </div>
                            </motion.div>
                        )}

                        {/* Main Content Area */}
                        <div className={`${hasOnlyProfileTab ? 'mt-0' : 'mt-6 sm:mb-8'}`}>
                            <motion.div 
                                className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-orange-200/50 overflow-hidden"
                                variants={contentVariants}
                                layout
                            >
                                {/* Content with Loading States */}
                                <AnimatePresence mode="wait">
                                    {isLoading ? (
                                        <motion.div 
                                            key="loading"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="p-4 sm:p-6"
                                        >
                                            <SkeletonLoader />
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key={activeTab}
                                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                            transition={{ 
                                                duration: 0.3,
                                                ease: "easeInOut",
                                                type: "spring",
                                                stiffness: 100
                                            }}
                                            className="relative p-4 sm:p-6"
                                        >
                                            {children}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
