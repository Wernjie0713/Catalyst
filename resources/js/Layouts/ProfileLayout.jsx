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
        { name: 'Profiles', key: 'profiles' },
        components?.Teams && { name: 'Teams', key: 'teams' },
        components?.Certificates && { name: 'Certificates', key: 'certificates' },
        components?.Badges && { name: 'Badges', key: 'badges' }
    ].filter(Boolean);

    // Animation variants
    const pageVariants = {
        initial: { opacity: 0 },
        animate: { 
            opacity: 1,
            transition: { 
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const tabsContainerVariants = {
        initial: { opacity: 0, y: -20 },
        animate: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const contentVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { 
            opacity: 1, 
            y: 0,
            transition: { 
                delay: 0.2, 
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const tabVariants = {
        inactive: { opacity: 0.7 },
        active: { 
            opacity: 1,
            transition: { duration: 0.3 }
        },
        hover: { 
            opacity: 1, 
            scale: 1.05,
            transition: { duration: 0.2 }
        },
        tap: { 
            scale: 0.95, 
            transition: { duration: 0.1 }
        }
    };

    return (
        <AuthenticatedLayout user={user}>
            <Head title="Profile" />

            <motion.div 
                className="min-h-screen"
                initial="initial"
                animate="animate"
                variants={pageVariants}
            >
                <div className="relative">
                    {/* Main Content */}
                    <div className="relative max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6">
                        {/* Navigation Tabs - Only show if there are multiple tabs */}
                        {!hasOnlyProfileTab && (
                            <motion.div 
                                className="flex justify-center mb-4 sm:mb-6 overflow-x-auto"
                                variants={tabsContainerVariants}
                            >
                                <div className="bg-[#24225a]/80 backdrop-blur-sm rounded-xl p-1 shadow-lg w-full max-w-[95vw] sm:max-w-fit">
                                    <nav className="flex gap-1 min-w-full sm:min-w-0">
                                        {tabs.map((tab) => (
                                            <motion.button
                                                key={tab.key}
                                                onClick={() => onTabChange(tab.key)}
                                                className={`
                                                    flex-1 sm:flex-none px-3 sm:px-6 py-2.5 rounded-lg text-sm font-medium
                                                    whitespace-nowrap transition-all duration-200
                                                    ${activeTab === tab.key 
                                                        ? 'bg-purple-600/50 text-white shadow-md' 
                                                        : 'text-gray-300 hover:text-white hover:bg-white/5'}
                                                `}
                                                variants={tabVariants}
                                                initial="inactive"
                                                animate={activeTab === tab.key ? "active" : "inactive"}
                                                whileHover="hover"
                                                whileTap="tap"
                                            >
                                                {tab.name}
                                                {activeTab === tab.key && (
                                                    <motion.div
                                                        layoutId="activeTabIndicator"
                                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400 mx-3"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                )}
                                            </motion.button>
                                        ))}
                                    </nav>
                                </div>
                            </motion.div>
                        )}

                        {/* Main Content Area */}
                        <div className={`${hasOnlyProfileTab ? 'mt-0' : 'mt-4 sm:mt-6'}`}>
                            <motion.div 
                                className="bg-[#24225a]/80 backdrop-blur-sm rounded-xl shadow-lg"
                                variants={contentVariants}
                                layout
                            >
                                {/* Content */}
                                <AnimatePresence mode="wait">
                                    <motion.div 
                                        key={activeTab}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="relative p-4 sm:p-6"
                                    >
                                        {children}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
