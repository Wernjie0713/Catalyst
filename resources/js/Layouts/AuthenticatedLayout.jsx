import { Sidebar } from '@/Components/siderbar';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import NotificationDropdown from '@/Components/NotificationDropdown';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
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
        <div className="min-h-screen bg-gradient-to-b from-white to-orange-45 relative overflow-hidden overflow-x-hidden">
            <Sidebar />
            <main className={`
                transition-all duration-300 ease-in-out
                ${isMobile 
                    ? 'flex flex-col items-center w-full' 
                    : 'ml-[84px]'
                }
            `}>
                <div className={`
                    ${isMobile 
                        ? 'w-[calc(100%-45px)] mx-auto flex justify-center' 
                        : ''
                    }
                `}>
                    {children}
                </div>
            </main>
        </div>
    );
}
