import React, { useState } from 'react';
import ProfileLayout from '@/Layouts/ProfileLayout';
import TabContent from './TabContent';

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
            <TabContent
                activeTab={activeTab}
                components={components}
                user={auth.user}
            />
        </ProfileLayout>
    );
} 