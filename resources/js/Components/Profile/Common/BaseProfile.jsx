import React, { useState } from 'react';
import ProfileLayout from '@/Layouts/ProfileLayout';
import TabContent from './TabContent';

export default function BaseProfile({ auth, components }) {
    const [activeTab, setActiveTab] = useState('profiles');

    return (
        <ProfileLayout 
            user={auth.user} 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            components={components}
        >
            <TabContent
                activeTab={activeTab}
                components={components}
                user={auth.user}
            />
        </ProfileLayout>
    );
} 