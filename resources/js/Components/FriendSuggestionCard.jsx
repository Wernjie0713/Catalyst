import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import DisplayProfilePhoto from '@/Components/Profile/Common/DisplayProfilePhoto';

const FriendSuggestionCard = ({ user, index }) => {
    return (
        <motion.div
            style={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: 0.2 + index * 0.1,
            }}
        >
            <Link
                href={route('profile.view', user.id)}
                className="group relative block h-[220px]"
            >
                <div className="relative h-full rounded-3xl border border-orange-100 bg-white shadow-[0_8px_30px_rgba(243,112,34,0.06)] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_36px_rgba(243,112,34,0.12)]">
                    {/* Top banner area (orange tint) with avatar centered */}
                    <div className="relative h-[110px] bg-gradient-to-br from-orange-100 to-white">
                        <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_30%_30%,rgba(243,112,34,.15),transparent_40%)]" />
                        <div className="absolute left-6 top-1/2 -translate-y-1/2">
                            <div className="transform-gpu transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">
                                <DisplayProfilePhoto profilePhotoPath={user.profile_picture} size={84} simple className="ring-2 ring-orange-200 shadow-md" />
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="min-w-0">
                            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 truncate">
                                {user.name}
                            </h3>
                            <div className="mt-2 inline-flex items-center gap-2 text-[#F37022]">
                                <span className="material-symbols-outlined text-base">person</span>
                                <span className="font-medium relative">
                                    View Profile
                                    <span className="absolute left-0 -bottom-0.5 w-0 group-hover:w-full h-[2px] bg-[#F37022] transition-all duration-300" />
                                </span>
                                <span className="material-symbols-outlined text-base translate-x-0 group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#F37022]/10 text-[#F37022] group-hover:bg-[#F37022]/15 transition-colors">
                                <span className="material-symbols-outlined">add</span>
                            </span>
                        </div>
                    </div>

                    {/* Bottom accent bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F37022]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            </Link>
        </motion.div>
    );
};

export default FriendSuggestionCard; 