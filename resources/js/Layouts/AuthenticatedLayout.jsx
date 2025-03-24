import { Sidebar } from '@/Components/siderbar';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import NotificationDropdown from '@/Components/NotificationDropdown';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    console.log("Notifications:", auth.user?.notifications);
    const user = usePage().props.auth.user;
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#1E1B3A' }}>
            <Sidebar />
            <main className={`${isMobile ? 'ml-[45px]' : 'ml-[84px]'}`}>
                {children}
            </main>
        </div>
    );
}
