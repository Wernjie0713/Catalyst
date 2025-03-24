import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import "../../css/sidebar.css";

export const Sidebar = () => {
  const { auth } = usePage().props;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef(null);
  const notifications = auth.user?.notifications || [];
  
  // Debug information
  const currentPath = window.location.pathname;
  console.log("Current page:", currentPath);
  console.log("Auth user:", auth.user);
  console.log("Total notifications:", notifications.length);
  console.log("Unread notifications:", notifications.filter(n => !n.read_at).length);
  
  // Close notifications panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const markAsRead = (notificationId) => {
    router.post(`/notifications/${notificationId}/read`);
  };

  const formatNotificationDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  // Count unread notifications - using the actual count now
  const unreadCount = notifications.filter(n => !n.read_at).length;

  // Add notifications to nav items
  const navItems = [
    {
      name: "Profile",
      icon: "person",
      route: "profile.show",
      path: "/profile"
    },
    {
      name: "Dashboard",
      icon: "dashboard",
      route: "dashboard",
      path: "/dashboard"
    },
    {
      name: "Event",
      icon: "celebration",
      route: "events.index",
      path: "/events"
    },
    {
      name: "MyEvents",
      icon: "work_history",
      route: "events.my-events",
      path: "/my-events"
    },
    {
      name: "Team Grouping",
      icon: "group",
      route: "friends.list",
      path: "/friends"
    },
    {
      name: "Notifications",
      icon: "notifications",
      badge: unreadCount > 0 ? unreadCount : null,
      action: () => setIsNotificationsOpen(!isNotificationsOpen)
    },
    {
      name: "Roles Management",
      icon: "admin_panel_settings",
      route: "admin.roles.index",
      path: "/admin/roles",
      adminOnly: true
    },
    {
      name: "Settings",
      icon: "settings",
      route: "profile.edit",
      path: "/profile/edit"
    },
    {
      name: "Logout",
      icon: "logout",
      method: "post",
      route: "logout",
      path: "/logout"
    }
  ];

  // Debug nav items
  console.log("Nav items:", navItems.map(item => ({
    name: item.name,
    badge: item.badge
  })));

  const logo = "/images/Catalyst.png";

  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly && !auth?.user?.roles?.some(role => role.name === 'admin')) {
      return false;
    }
    if (item.name === "Profile" && auth?.user?.roles?.some(role => role.name === 'admin')) {
      return false;
    }
    return true;
  });

  // Debug filtered nav items
  console.log("Filtered nav items:", filteredNavItems.map(item => ({
    name: item.name,
    badge: item.badge
  })));

  // Get active index based on current URL
  const getActiveIndex = () => {
    const currentPath = window.location.pathname;
    
    for (let i = 0; i < filteredNavItems.length; i++) {
      const item = filteredNavItems[i];
      if (!item.path) continue;
      
      // Exact match
      if (currentPath === item.path) {
        return i;
      }
      
      // Check if current path starts with item path (for nested routes)
      if (item.path !== "/" && currentPath.startsWith(item.path)) {
        return i;
      }
    }
    
    return -1;
  };

  const handleClick = (item) => {
    if (item.action) {
      item.action();
      return;
    }

    if (item.method === "post") {
      router.post(route(item.route));
      return;
    }

    if (item.route) {
      router.get(route(item.route));
    } else if (item.path) {
      router.get(item.path);
    }
  };

  const activeIndex = getActiveIndex();
  console.log("Active index:", activeIndex);

  // Mobile Menu Component
  const MobileMenu = () => {
    console.log("Rendering mobile menu");
    return (
    <div className="md:hidden">
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
      >
        <span className="sr-only">Open menu</span>
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-16 left-4 z-50 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {filteredNavItems.map((item, index) => {
                console.log(`Mobile menu item: ${item.name}, badge: ${item.badge}`);
                return (
                <button
                  key={index}
                  onClick={() => handleClick(item)}
                  className={`
                    w-full text-left px-4 py-2 text-sm flex items-center space-x-3
                    ${activeIndex === index 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                  {item.name === "Notifications" && item.badge > 0 && (
                    <span className="ml-auto bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              )})}
            </div>
          </div>
        </>
      )}
    </div>
  )};

  // Desktop Sidebar Component
  const DesktopSidebar = () => {
    console.log("Rendering desktop sidebar");
    return (
    <section className="page sidebar-page hidden md:block">
      <aside className="sidebar">
        <div className="inner">
          <div className="header">
            <img src={logo} className="logo" alt="Catalyst Logo" />
            <h1 className="text-white">Catalyst</h1>
          </div>
          <nav
            className="menu"
            style={{ "--top": `${activeIndex === -1 ? 0 : activeIndex * 56}px` }}
          >
            {filteredNavItems.map((item, index) => {
              console.log(`Desktop sidebar item: ${item.name}, badge: ${item.badge}`);
              return (
              <button
                className={activeIndex === index ? "active" : ""}
                key={index}
                type="button"
                onClick={() => handleClick(item)}
                style={{ position: 'relative' }}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <p>{item.name}</p>
                {item.name === "Notifications" && item.badge > 0 && (
                  <span 
                    className="absolute top-2 right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center z-10"
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )})}
          </nav>
        </div>
      </aside>
    </section>
  )};

  // Notifications Panel
  const NotificationsPanel = () => (
    isNotificationsOpen && (
      <div 
        ref={notificationsRef}
        className="fixed left-24 top-4 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[9999] transition-all duration-300 ease-in-out"
        style={{maxHeight: '80vh', overflowY: 'auto'}}
      >
        <div className="py-2">
          <div className="px-4 py-3 font-medium border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
            <div className="flex items-center">
              <span className="material-symbols-outlined mr-2">notifications</span>
              <span>Notifications</span>
            </div>
            {notifications.length > 0 && (
              <button 
                onClick={() => router.post('/notifications/mark-all-as-read')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          {notifications.length === 0 ? (
            <div className="px-4 py-12 text-gray-500 dark:text-gray-400 text-center">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">notifications_off</span>
              <p>No new notifications</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors duration-150"
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-500 dark:text-blue-300">
                        <span className="material-symbols-outlined">event</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                        {notification.data.message || "New notification"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <span className="material-symbols-outlined text-xs mr-1">schedule</span>
                        {formatNotificationDate(notification.created_at)}
                      </div>
                    </div>
                    {!notification.read_at && (
                      <div className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  );

  console.log("Rendering sidebar component");
  return (
    <>
      <MobileMenu />
      <DesktopSidebar />
      <NotificationsPanel />
    </>
  );
};