import { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { auth } = usePage().props;
    const notifications = auth.user?.notifications || [];
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Debug - log notifications to console
    useEffect(() => {
        console.log('Notifications:', notifications);
        console.log('Dropdown open:', isOpen);
    }, [notifications, isOpen]);

    const markAsRead = (notificationId) => {
        router.post(`/notifications/${notificationId}/read`);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Bell Icon */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="relative p-2 text-white hover:text-gray-200"
                aria-label="Notifications"
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                    />
                </svg>
                
                {/* Notification Badge */}
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
                        {notifications.length}
                    </span>
                )}
            </button>

            {/* Dropdown - Fixed positioning */}
            {isOpen && (
                <div 
                    className="fixed right-4 top-16 w-80 bg-white rounded-md shadow-xl border border-gray-200 overflow-hidden z-[9999]"
                    style={{maxHeight: '80vh', overflowY: 'auto'}}
                >
                    <div className="py-2">
                        <div className="px-4 py-2 font-medium border-b border-gray-200 bg-gray-50">
                            Notifications
                        </div>
                        
                        {notifications.length === 0 ? (
                            <div className="px-4 py-6 text-gray-500 text-center">
                                No new notifications
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div 
                                    key={notification.id} 
                                    className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="text-sm font-medium text-gray-800">
                                        {notification.data.message || "New notification"}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {notification.created_at}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
} 