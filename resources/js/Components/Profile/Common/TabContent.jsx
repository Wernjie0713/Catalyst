import React from 'react';

export default function TabContent({ activeTab, components, user }) {
    // Only try to render components that exist
    const renderContent = () => {
        switch (activeTab) {
            case 'profiles':
                return components.PersonalInformation ? <components.PersonalInformation user={user} /> : null;
            case 'teams':
                return components.Teams ? <components.Teams user={user} /> : null;
            case 'certificates':
                return components.Certificates ? <components.Certificates user={user} /> : null;
            case 'badges':
                return components.Badges ? <components.Badges user={user} /> : null;
            default:
                return components.PersonalInformation ? <components.PersonalInformation user={user} /> : null;
        }
    };

    return renderContent();
} 