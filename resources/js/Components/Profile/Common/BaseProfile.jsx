import React, { useState } from 'react';
import ProfileLayout from '@/Layouts/ProfileLayout';
import TabContent from './TabContent';
import { motion } from 'framer-motion';

export default function BaseProfile({ 
    auth, 
    components, 
    profileUser,
    roles,
    showFriendButton,
    friendStatus,
    friendRequestId 
}) {
    const [activeTab, setActiveTab] = useState('profiles');

    // Animation variants for tab transitions
    const tabChangeVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            y: -10,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <ProfileLayout 
            user={auth.user} 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            components={components}
            showFriendButton={showFriendButton}
            friendStatus={friendStatus}
            friendRequestId={friendRequestId}
            profileUser={profileUser}
        >
            <motion.div
                key={activeTab}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={tabChangeVariants}
            >
                <TabContent
                    activeTab={activeTab}
                    components={components}
                    user={auth.user}
                />
            </motion.div>
        </ProfileLayout>
    );
} 