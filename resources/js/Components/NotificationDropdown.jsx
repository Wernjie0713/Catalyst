import { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { auth } = usePage().props;
    const notifications = auth.user?.notifications || [];
    const unreadCount = notifications.filter(n => !n.read_at).length;
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
                
                {/* Notification Badge - show unread count */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Backdrop for focus */}
            {isOpen && (
                <div className="fixed inset-0 z-[9998] bg-black/10 backdrop-blur-[2px]"></div>
            )}

            {/* Dropdown - Responsive positioning */}
            {isOpen && (
                <div 
                    className="fixed top-16 left-1/2 -translate-x-1/2 w-[92vw] max-w-sm sm:left-auto sm:right-4 sm:translate-x-0 sm:w-80 bg-white rounded-xl shadow-2xl ring-1 ring-black/5 overflow-hidden z-[9999]"
                    style={{maxHeight: '80vh', overflowY: 'auto'}}
                >
                    <div className="py-2">
                        <div className="px-4 py-3 font-medium border-b border-gray-100 bg-gray-50 flex justify-between items-center sticky top-0">
                            <div className="flex items-center gap-2 text-gray-900">
                                <span className="material-symbols-outlined text-[#F37022]">notifications</span>
                                <span>Notifications</span>
                            </div>
                            {notifications.length > 0 && (
                                <button 
                                    onClick={() => router.post('/notifications/mark-all-as-read')}
                                    className="text-xs text-[#F37022] hover:text-orange-600"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>
                        
                        {notifications.length === 0 ? (
                            <div className="px-6 py-12 text-gray-500 text-center">
                                <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#F37022]">notifications_off</span>
                                </div>
                                <div className="text-sm">No new notifications</div>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div 
                                    key={notification.id} 
                                    className={`px-4 py-3 hover:bg-orange-50/40 border-b border-gray-100 cursor-pointer flex items-start ${
                                        !notification.read_at ? 'bg-blue-50' : ''
                                    }`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex-1">
                                        <div className={`text-sm ${!notification.read_at ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'}`}>
                                            {notification.data.message || "New notification"}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {notification.created_at}
                                        </div>
                                    </div>
                                    {!notification.read_at && (
                                        <div className="ml-2 w-2 h-2 bg-[#F37022] rounded-full mt-2"></div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
} 